const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});


router.get('/', (req, res, next) => {
    con.connect(function (err) {
        con.query("SELECT * FROM `alcohol-usage`", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
        });
    });
});


router.get('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("SELECT * FROM `alcohol-usage` WHERE Country ='" + country + "'", function (err, Country, fields) {
            if (err) throw err;
            return res.status(200).send({ Country });
        });
    });
});

router.get('/continent/:continent', (req, res, next) => {
    con.connect(function (err) {
        const continent = req.params.continent;
        switch (continent.toUpperCase()) {
            case "EU":
            case "NA":
            case "AF":
            case "AS":
            case "AN":
            case "OC":
            case "SA":
                con.query("SELECT * FROM `alcohol-usage` WHERE continent = '" + continent + "'", function (err, result, fields) {
                    if (err) throw err;
                    res.status(200).json(result);
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
});


router.post('/', function (req, res, next) {
    const Country = {
        country: req.body.Country,
        total_litres_of_pure_alcohol: req.body.total_litres_of_pure_alcohol,
        continent: req.body.continent
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("INSERT INTO`alcohol-usage` VALUES('" + Country.country + "', '"
            + Country.total_litres_of_pure_alcohol + "', '" + Country.continent + "')", function (err, result, fields) {
                if (err) throw err;
                return res.status(200).send({ message: 'Alcohol-usage succesfully inserted.' });
            });
    });
});


router.patch('/:COUNTRY', (req, res, next) => {
    var Country = req.params.COUNTRY
    const data = {
        country: req.body.Country,
        total_litres_of_pure_alcohol: req.body.total_litres_of_pure_alcohol,
        continent: req.body.continent
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("UPDATE countries SET Country ='" + data.country + "',total_litres_of_pure_alcohol='" +
            data.total_litres_of_pure_alcohol + "', continent='" + data.continent +
            "'", function (err, result, fields) {
                if (err) throw err;
                return res.status(200).send({ message: 'alcohol usage succesfully updated.' });
            });
    });
});


router.delete('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("DELETE FROM `alcohol-usage` WHERE Country ='" + country + "'", function (err, Country, fields) {
            if (err) throw err;
            return res.status(200).send({ message: "Succesfully deleted record" });
        });
    });
});
module.exports = router;