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
var js2xmlparser = require("js2xmlparser");



router.get('/', (req, res, next) => {
    con.connect(function (err) {
        con.query("SELECT * FROM `depression`", function (err, result, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    xml.ele('Country')
                        .ele('Country', result[i]['Country']).up()
                        .ele('Code', result[i]['Code']).up()
                        .ele('Year', result[i]['Year']).up()
                        .ele('Depression', result[i]['Depression']).end()
                }
                var xmldoc = xml.toString({ pretty: true });
                var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                res.send(xmldoc);
            }
        });
    });
});


router.get('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("SELECT * FROM `depression` WHERE Country ='" + country + "'", function (err, Country, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    xml.ele('Country')
                        .ele('Country', result[i]['Country']).up()
                        .ele('Code', result[i]['Code']).up()
                        .ele('Year', result[i]['Year']).up()
                        .ele('Depression', result[i]['Depression']).end()
                }
                var xmldoc = xml.toString({ pretty: true });
                var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                res.send(xmldoc);
            }
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
                con.query("SELECT * FROM `depression` as A " +
                    "inner join countries as B on A.Country = B.COUNTRY_NAME " +
                    "WHERE B.CONTINENT_CODE = '" + continent + "'", function (err, result, fields) {
                        if (err) throw err;
                        if (result.length != 0) {
                            for (var i = 0; i < result.length; i++) {
                                xml.ele('Country')
                                    .ele('Country', result[i]['Country']).up()
                                    .ele('Code', result[i]['Code']).up()
                                    .ele('Year', result[i]['Year']).up()
                                    .ele('Depression', result[i]['Depression']).end()
                            }
                            var xmldoc = xml.toString({ pretty: true });
                            var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                            res.send(xmldoc);
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


router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});

module.exports = router;