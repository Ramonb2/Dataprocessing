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
        con.query("SELECT * FROM `world-index`", function (err, result, fields) {
            var xml = builder.create('Countries');
            if (err) throw err;
            for(var i=0; i< result.length; i++){
                xml.ele('Country')
                .ele('Country', result[i]['Country']).up()
                .ele('Ladder', result[i]['Ladder']).up()
                .ele('SD_of_Ladder', result[i]['SD_of_Ladder']).up()
                .ele('Positive_affect', result[i]['Positive_affect']).up()
                .ele('Negative_affect', result[i]['Negative_affect']).up()
                .ele('Social_support', result[i]['Social_support']).up()
                .ele('Corruption', result[i]['Corruption']).up()
                .ele('Generosity', result[i]['Generosity']).up()
                .ele('Log_of_GDP_per_capita', result[i]['Log_of_GDP_per_capita']).up()
                .ele('Healthy_life_expectancy', result[i]['Healthy_life_expectancy']).end()
            }     
            var xmldoc = xml.toString({ pretty: true });            
            var xmldoc = xmldoc.replace(/^/,"<?xml version='1.0' encoding='UTF-8' ?>\n");
            res.send(xmldoc);
        });
    });

});




router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling POST request to /products',
        createdProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discorverd the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});

module.exports = router;