const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var builder = require('xmlbuilder');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});


router.get('/', (req, res, next) => {
    con.connect(function (err) {
        con.query("SELECT * FROM `countries`", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
        });
    });
});


router.get('/:CODE', (req, res, next) => {
    var CODE = req.params.CODE
    con.connect(function (err) {
        con.query("SELECT * FROM countries WHERE CODE ='" + CODE + "'", function (err, Country, fields) {
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
                con.query("SELECT * FROM `countries` WHERE continent_code = '" + continent + "'", function (err, result, fields) {
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
        country_code: req.body.CODE,
        country_name: req.body.COUNTRY_NAME,
        fullcountry_name: req.body.FULL_NAME,
        iso3: req.body.ISO3,
        country_number: req.body.COUNTRY_NUMBER,
        continent_code: req.body.CONTINENT_CODE
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("INSERT INTO`countries`(`code`, `country_name`, `full_name`, `ISO3`, `country_number`, `continent_code`) VALUES('" + Country.country_code + "', '" + Country.country_name + "', '" + Country.fullcountry_name + "', '" + Country.iso3 + "', '" + Country.country_number + "', '" + Country.continent_code + "')", function (err, result, fields) {
            if (err) throw err;
            return res.status(200).send({ message: 'Country succesfully inserted.' });
        });
    });
});


router.patch('/:CODE', (req, res, next) => {
    var CODE = req.params.CODE
    const Country = {
        country_name: req.body.COUNTRY_NAME,
        fullcountry_name: req.body.FULL_NAME,
        iso3: req.body.ISO3,
        country_number: req.body.COUNTRY_NUMBER,
        continent_code: req.body.CONTINENT_CODE
    }
    if (!Country) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("UPDATE countries SET COUNTRY_NAME ='" + Country.country_name + "',FULL_NAME='" +
            Country.fullcountry_name + "', ISO3='" + Country.iso3 + "',COUNTRY_NUMBER='"
            + Country.COUNTRY_NUMBER + "',CONTINENT_CODE='"
            + Country.continent_code + "'WHERE CODE ='"
            + CODE + "'", function (err, result, fields) {
                if (err) throw err;
                return res.status(200).send({ message: 'Country succesfully updated.' });
            });
    });
});


router.delete('/:CODE', (req, res, next) => {
    var CODE = req.params.CODE
    con.connect(function (err) {
        con.query("DELETE FROM countries WHERE CODE ='" + CODE + "'", function (err, result, fields) {
            if (err) throw err;
            return res.status(200).send({ message: 'Country succesfully Deleted.' });
        });
    });
});
module.exports = router;