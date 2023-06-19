const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const builder = require('xmlbuilder');
const pool = require('../../../db')

const util = require('util');

pool.query = util.promisify(pool.query);

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

function buildXml(data) {
    const xml = builder.create('Countries');
    for (const item of data) {
        xml.ele('Country')
            .ele('Country', item['Country']).up()
            .ele('total_litres_of_pure_alcohol', item['total_litres_of_pure_alcohol']).up()
            .ele('continent', item['continent']).end();
    }
    const xmldoc = xml.end({ pretty: true });
    return `<?xml version='1.0' encoding='UTF-8' ?>\n${xmldoc}`;
}

router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM `alcohol-usage`");

        if (req.headers['content-type'] === "application/xml") {
            const xmlDoc = buildXml(result);
            res.send(xmlDoc);
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});


router.get('/:COUNTRY', async (req, res, next) => {
    let country = req.params.COUNTRY
    try {
        const result = await pool.query("SELECT * FROM `alcohol-usage` WHERE Country =?", [country]);

        if (req.headers['content-type'] === "application/xml") {
            const xmlDoc = buildXml(result);
            res.send(xmlDoc);
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

router.get('/continent/:continent', async (req, res, next) => {
    const continent = req.params.continent;
    switch (continent.toUpperCase()) {
        case "EU":
        case "NA":
        case "AF":
        case "AS":
        case "AN":
        case "OC":
        case "SA":
            const result = await pool.query("SELECT * FROM `alcohol-usage` WHERE continent = ?", [continent]);
            if (req.headers['content-type'] === "application/xml") {
                const xmlDoc = buildXml(result);
                res.send(xmlDoc);
            } else {
                res.status(200).json(result);
            }
            break;
        case "ATL":
            res.status(200).json({
                message: 'Seems like you discovered Atlantis. Good job!'
            });
            break;
        default:
            res.status(200).json({
                message: 'This continent is unknown ' + continent.toUpperCase()
            });
            break;
    }
});


router.post('/', async function (req, res, next) {
    const Country = {
        country: req.body.Country,
        total_litres_of_pure_alcohol: req.body.total_litres_of_pure_alcohol,
        continent: req.body.continent
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    await pool.query("INSERT INTO`alcohol-usage` VALUES(?, ?, ?)", [Country.country, Country.total_litres_of_pure_alcohol, Country.continent], function (err, result, fields) {
        if (err) next(err);
        return res.status(200).send({ message: 'Alcohol-usage succesfully inserted.' });
    });
});


router.patch('/:COUNTRY', async (req, res, next) => {
    let Country = req.params.COUNTRY
    const data = {
        country: req.body.Country,
        total_litres_of_pure_alcohol: req.body.total_litres_of_pure_alcohol,
        continent: req.body.continent
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }
    await pool.query("UPDATE countries SET Country =?,total_litres_of_pure_alcohol=?, continent=?", [data.country, data.total_litres_of_pure_alcohol, data.continent], function (err, result, fields) {
        if (err) next(err);
        return res.status(200).send({ message: 'alcohol usage succesfully updated.' });
    });
});


router.delete('/:COUNTRY', async (req, res, next) => {
    let country = req.params.COUNTRY
    await pool.query("DELETE FROM `alcohol-usage` WHERE Country =?", [country], function (err, Country, fields) {
        if (err) next(err);
        return res.status(200).send({ message: "Succesfully deleted record" });
    });
});
module.exports = router;