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
        con.query("SELECT * FROM `depression`", function (err, result, fields) {
            if (err) throw err;
            if(req.headers['content-type'] === "application/xml"){
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
                    res.status(200).send(xmldoc);
            }
        } else{
                res.status(200).json(result);
            }
        });
    });
});


router.get('/:COUNTRY', (req, res, next) => {
    var country = req.params.COUNTRY
    con.connect(function (err) {
        con.query("SELECT * FROM `depression` WHERE Country ='" + country + "'", function (err, Country, fields) {
            if (err) throw err;
            if(req.headers['content-type'] === "application/xml"){
            var xml = builder.create('Countries');
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
                res.status(200).send(xmldoc);
            }
            } else{
                return res.status(200).send({ Country });
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
                        if(req.headers['content-type'] === "application/xml"){
                            var xml = builder.create('Countries');
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
                                res.status(200).send(xmldoc);
                        }
                    } else{
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
});


router.post('/', function (req, res, next) {
    const data = {
        country: req.body.Country,
        Code: req.body.Code,
        Year: req.body.Year,
        Depression: req.body.Depression
    }
    if (!data) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    con.connect(function (err) {
        con.query("INSERT INTO `depression` VALUES('" + data.country + "', '"
            + data.Code + "', '" + data.Year + "', '"
            + data.Depression + "')", function (err, result, fields) {
                if (err) throw err;
                return res.status(200).send({ message: 'Depression records succesfully inserted.' });
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