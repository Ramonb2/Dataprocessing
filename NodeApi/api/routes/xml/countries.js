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


router.get('/', function (req, res, next) {
    con.connect(function (err) {
        let sql = "SELECT *FROM countries";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(404).json({
                    message: "wrong query "
                });
            }
            else if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var xml = builder.create('Countries');
                    xml.ele('country')
                        .ele('code', result[i]['CODE']).up()
                        .ele('country_name', result[i]['COUNTRY_NAME']).up()
                        .ele('Full_name', result[i]['FULL_NAME']).up()
                        .ele('ISO3', resuls[i]['ISO3']).up()
                        .ele('Country_number', result[i]['COUNTRY_NUMBER']).up()
                        .ele('Continent_code', result[i]['CONTINENT_CODE']).end()
                }
                var xmldoc = xml.toString({ pretty: true });
                var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                return res.status(201).send(xmldoc);
            } else {
                res.status(404).json({
                    message: "No valid entry found "
                });
            }
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
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var xml = builder.create('Countries');
                            xml.ele('country')
                                .ele('code', result[i]['CODE']).up()
                                .ele('country_name', result[i]['COUNTRY_NAME']).up()
                                .ele('Full_name', result[i]['FULL_NAME']).up()
                                .ele('ISO3', resuls[i]['ISO3']).up()
                                .ele('Country_number', result[i]['COUNTRY_NUMBER']).up()
                                .ele('Continent_code', result[i]['CONTINENT_CODE']).end()
                        }
                        var xmldoc = xml.toString({ pretty: true });
                        var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                        return res.status(201).send(xmldoc);
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