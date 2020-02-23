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
        con.query("SELECT * FROM `alcohol-usage`", function (err, result, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            if (result.length != 0) {
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
        });
    });

});

router.get('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("SELECT * FROM `alcohol-usage` WHERE Country ='" + country + "'", function (err, Country, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                xml.ele('Country')
                    .ele('Country', result[i]['Country']).up()
                    .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).up()
                    .ele('continent', result[i]['continent']).end()
            }
            var xmldoc = xml.toString({ pretty: true });
            var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
            xmldoc += "</countries";
            res.send(xmldoc);
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
                    var xml = builder.create('Countries');
                    if (err) throw err;
                    for (var i = 0; i < result.length; i++) {
                        xml.ele('Country')
                            .ele('Country', result[i]['Country']).up()
                            .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).up()
                            .ele('continent', result[i]['continent']).end()
                    }
                    var xmldoc = xml.toString({ pretty: true });
                    var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
                    res.send(xmldoc);
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