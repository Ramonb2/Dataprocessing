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
        con.query("SELECT * FROM `world-index`", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
        });
    });
});


router.get('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("SELECT * FROM `world-index` WHERE Country ='" + country + "'", function (err, Country, fields) {
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
                con.query("SELECT * FROM `world-index` as A " +
                    "inner join countries as B on A.Country = B.COUNTRY_NAME " +
                    "WHERE B.CONTINENT_CODE = '" + continent + "'", function (err, result, fields) {
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
    const data = {
        country: req.body.Country,
        Ladder: req.body.Ladder,
        SD_of_Ladder: req.body.SD_of_Ladder,
        Positive_affect: req.body.Positive_affect,
        Negative_affect: req.body.Negative_affect,
        Social_support: req.body.Social_support,
        Freedom: req.body.Freedom,
        Corruption: req.body.Corruption,
        Generosity: req.body.Generosity,
        Log_of_GDP_per_capita: req.body.Log_of_GDP_per_capita,
        Healthy_life_expectancy: req.body.Healthy_life_expectancy

    }
    if (!data) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("INSERT INTO `world-index` VALUES('" + data.country + "', '"
            + data.Ladder + "', '" + data.SD_of_Ladder + "', '"
            + data.Positive_affect + "', '" + data.Negative_affect + "', '"
            + data.Social_support + "', '" + data.Freedom + "', '"
            + data.Corruption + "', '" + data.Generosity + "', '"
            + data.Log_of_GDP_per_capita + "', '" + data.Healthy_life_expectancy + "')", function (err, result, fields) {
                if (err) throw err;
                return res.status(200).send({ message: 'World index records succesfully inserted.' });
            });
    });
});


router.delete('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("DELETE FROM `world-index` WHERE Country ='" + country + "'", function (err, Country, fields) {
            if (err) throw err;
            return res.status(200).send({ message: "Succesfully deleted record" });
        });
    });
});
module.exports = router;