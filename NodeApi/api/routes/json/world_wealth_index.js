const express = require('express');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const router = express.Router();
var mysql = require('mysql');
var builder = require('xmlbuilder');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/**
 * @swagger
 * /wealth:
 *  get:
 *      description: Select wealth data from database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.get('/', async (req, res, next) => {
    await pool.query("SELECT * FROM `world-index`", function (err, result, fields) {
        if (req.headers['content-type'] === "application/xml") {
            var xml = builder.create('Countries');
            if (err) next(err);
            for (var i = 0; i < result.length; i++) {
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
            var xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
            res.status(200).send(xmldoc);
        } else {
            res.status(200).json(result);
        }
    });
});

/**
 * @swagger
 * /wealth/{COUNTRY}:
 *  get:
 *      description: Select wealth data for a specific country from database
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
    await pool.query("SELECT * FROM `world-index` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) throw err;
        return res.status(200).send({ Country });
    });
});

/**
 * @swagger
 * /wealth/{continent}:
 *  get:
 *      description: Select wealth data for a whole continent from database
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
            await pool.query("SELECT * FROM `world-index` as A " +
                "inner join countries as B on A.Country = B.COUNTRY_NAME " +
                "WHERE B.CONTINENT_CODE = '" + continent + "'", function (err, result, fields) {
                    if (err) next(err);
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

/**
 * @swagger
 * /wealth:
 *  post:
 *      description: Add wealth data from a country to database
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.post('/', async function (req, res, next) {
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

    await pool.query("INSERT INTO `world-index` VALUES('" + data.country + "', '"
        + data.Ladder + "', '" + data.SD_of_Ladder + "', '"
        + data.Positive_affect + "', '" + data.Negative_affect + "', '"
        + data.Social_support + "', '" + data.Freedom + "', '"
        + data.Corruption + "', '" + data.Generosity + "', '"
        + data.Log_of_GDP_per_capita + "', '" + data.Healthy_life_expectancy + "')", function (err, result, fields) {
            if (err) next(err);
            return res.status(200).send({ message: 'World index records succesfully inserted.' });
        });
});

/**
 * @swagger
 * /wealth/{COUNTRY}:
 *  delete:
 *      description: Delete wealth data from a country from database
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
    await pool.query("DELETE FROM `world-index` WHERE Country ='" + country + "'", function (err, Country, fields) {
        if (err) next(err);
        return res.status(200).send({ message: "Succesfully deleted record" });
    });
});
module.exports = router;