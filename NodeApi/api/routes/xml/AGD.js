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
        con.query("SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol FROM depression as A JOIN `alcohol-usage` as B on A.Country = B.Country JOIN`world-index` as C on A.Country = C.Country", function (err, result, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                xml.ele('Country')
                    .ele('Country', result[i]['Country']).up()
                    .ele('Depression', result[i]['depression']).up()
                    .ele('Log_of_GDP_per_capita', result[i]['Log_of_GDP_per_capita']).up()
                    .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).end()
            }
            var xmldoc = xml.toString({ pretty: true });
            var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
            res.send(xmldoc);

        });
    });

});

router.get('/:continent', (req, res, next) => {
    const continent = req.params.continent;
    con.connect(function (err) {
        switch (continent.toUpperCase()) {
            case "EU":
            case "NA":
            case "AF":
            case "AS":
            case "AN":
            case "OC":
            case "SA":
                con.query("SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol FROM depression as A JOIN `alcohol-usage` as B on A.Country = B.Country JOIN`world-index` as C on A.Country = C.Country WHERE B.continent ='" + continent + "'", function (err, result, fields) {
                    var xml = builder.create('Countries');
                    if (err) throw err;
                    for (var i = 0; i < result.length; i++) {
                        xml.ele('Country')
                            .ele('Country_name', result[i]['Country']).up()
                            .ele('Depression', result[i]['depression']).up()
                            .ele('Log_of_GDP_per_capita', result[i]['Log_of_GDP_per_capita']).up()
                            .ele('total_litres_of_pure_alcohol', result[i]['total_litres_of_pure_alcohol']).end()
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


module.exports = router;