const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

router.get('/', async (req, res, next) => {
    await pool.query("SELECT * FROM `alcohol-usage`", function (err, result, fields) {
        if (err) next(err);
        if (req.headers['content-type'] === "application/xml") {
            var xml = builder.create('Countries');
            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    xml.ele('Country')
                        .ele('Country', result[i]['Country']).up()
                        .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).up()
                        .ele('continent', result[i]['continent']).end()
                }
                var xmldoc = xml.toString({ pretty: true });
                var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                res.status(200).send(xmldoc);
            }
        } else {
            res.status(200).json(result);
        }
    });
});


router.get('/:COUNTRY', async (req, res, next) => {
    var country = req.params.COUNTRY
    await pool.query("SELECT * FROM `alcohol-usage` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) next(err);
        if (req.headers['content-type'] === "application/xml") {
            var xml = builder.create('Countries');
            if (err) next(err);
            for (var i = 0; i < result.length; i++) {
                xml.ele('Country')
                    .ele('Country', result[i]['Country']).up()
                    .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).up()
                    .ele('continent', result[i]['continent']).end()
            }
            var xmldoc = xml.toString({ pretty: true });
            var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
            xmldoc += "</countries";
            res.status(200).send(xmldoc);
        } else {
            return res.status(200).send({ Country });
        }
    });
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
            await pool.query("SELECT * FROM `alcohol-usage` WHERE continent = '" + continent + "'", function (err, result, fields) {
                if (err) next(err);
                if (req.headers['content-type'] === "application/xml") {
                    var xml = builder.create('Countries');
                    if (err) next(err);
                    for (var i = 0; i < result.length; i++) {
                        xml.ele('Country')
                            .ele('Country', result[i]['Country']).up()
                            .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).up()
                            .ele('continent', result[i]['continent']).end()
                    }
                    var xmldoc = xml.toString({ pretty: true });
                    var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                    res.send(xmldoc);
                }
                else {
                    res.status(200).json(result);
                }
            });
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

    await pool.query("INSERT INTO`alcohol-usage` VALUES('" + Country.country + "', '"
        + Country.total_litres_of_pure_alcohol + "', '" + Country.continent + "')", function (err, result, fields) {
            if (err) next(err);
            return res.status(200).send({ message: 'Alcohol-usage succesfully inserted.' });
        });
});


router.patch('/:COUNTRY', async (req, res, next) => {
    var Country = req.params.COUNTRY
    const data = {
        country: req.body.Country,
        total_litres_of_pure_alcohol: req.body.total_litres_of_pure_alcohol,
        continent: req.body.continent
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }
    await pool.query("UPDATE countries SET Country ='" + data.country + "',total_litres_of_pure_alcohol='" +
        data.total_litres_of_pure_alcohol + "', continent='" + data.continent +
        "'", function (err, result, fields) {
            if (err) next(err);
            return res.status(200).send({ message: 'alcohol usage succesfully updated.' });
        });
});


router.delete('/:COUNTRY', async (req, res, next) => {
    var country = req.params.COUNTRY
    await pool.query("DELETE FROM `alcohol-usage` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) next(err);
        return res.status(200).send({ message: "Succesfully deleted record" });
    });
});
module.exports = router;