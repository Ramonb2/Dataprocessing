const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var builder = require('xmlbuilder');
const con = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});

const parser = require('../../../Validators/jsonValidator');

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
/**
 * @swagger
 * /depression:
 *  get:
 *      tags:
 *         - depression
 *      description: Select depression data from database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */

router.get('/', async (req, res, next) => {
    await con.query("SELECT * FROM `depression`", function (err, result, fields) {
        if (err) next(err);
        if (req.headers['content-type'] === "application/xml") {
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
        } else {
            res.status(200).json(result);
        }
    });
});

/**
 * @swagger
 * /depression/{COUNTRY}:
 *  get:
 *      tags:
 *          - depression
 *      description: Select depression data for a specific country from database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.get('/:COUNTRY', async (req, res, next) => {
    var country = req.params.COUNTRY
    await con.query("SELECT * FROM `depression` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) next(err);
        if (req.headers['content-type'] === "application/xml") {
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
        } else {
            return res.status(200).send({ Country });
        }
    });
});

/**
 * @swagger
 * /depression/continent/{continent}:
 *  get:
 *      tags:
 *          - depression
 *      description: Select depression data for a specific whole continent from database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
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
            await con.query("SELECT * FROM `depression` as A " +
                "inner join countries as B on A.Country = B.COUNTRY_NAME " +
                "WHERE B.CONTINENT_CODE = '" + continent + "'", function (err, result, fields) {
                    if (err) next(err);
                    if (req.headers['content-type'] === "application/xml") {
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
                    } else {
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

/**
 * @swagger
 * /depression:
 *  post:
 *      tags:
 *         - depression
 *      description: post depression data to database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.post('/', async function (req, res, next) {
    if(parser(req.body)){
    const data = {
        country: req.body.Country,
        Code: req.body.Code,
        Year: req.body.Year,
        Depression: req.body.Depression
    }
    if (!data) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }

    await con.query("INSERT INTO `depression` VALUES('" + data.country + "', '"
        + data.Code + "', '" + data.Year + "', '"
        + data.Depression + "')", function (err, result, fields) {
            if (err) next(err);
            return res.status(200).send({ message: 'Depression records succesfully inserted.' });
        });
    }else{
        res.status(400).send({ error: true, message: 'please provide all required fields' });
    }
});

/**
 * @swagger
 * /depression/{COUNTRY}:
 *  delete:
 *      tags:
 *        - depression
 *      description: delete depression data for a specific country from database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.delete('/:COUNTRY', async (req, res, next) => {
    var country = req.params.COUNTRY
    await con.query("DELETE FROM `world-index` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) next(err);
        return res.status(200).send({ message: "Succesfully deleted record" });
    });
});
module.exports = router;