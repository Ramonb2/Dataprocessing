const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var builder = require('xmlbuilder');
var bodyParser = require('body-parser')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "apidatabase"
});
const util = require('util');


pool.query = util.promisify(pool.query);
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/**
 * @swagger
 * /countries:
 *  get:
 *      description: Select countries
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */

router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM `countries`");

        if (req.headers['content-type'] === "application/xml") {
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
                return res.status(200).send(xmldoc);
            }
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});


/**
 * @swagger
 * paths:
*   /countries/{CODE}:
*       get:
*           parameters:
*               in: path
*               name: CODE
*               required: true
*               description: Country code
*           description: select country by code
*      
*           responses:
*               '200':
*                   description: A successful response
*               '204':
*                   description: Record not found
*               '400':
*                   description: Bad GET Request
*/
router.get('/:CODE', async (req, res, next) => {
    var CODE = req.params.CODE
    //pool.connect(function (err) {
    await pool.query("SELECT * FROM countries WHERE CODE =?", [CODE], function (err, Country, fields) {
        if (err) next(err);
        return res.status(200).send({ Country });
    });
    //});
});

/**
 * @swagger
 * /continent/{continent}:
 *  get:
 *      description: Select countries by continent
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.get('/continent/:continent', async (req, res, next) => {
    //pool.connect(function (err) {
    const continent = req.params.continent;
    switch (continent.toUpperCase()) {
        case "EU":
        case "NA":
        case "AF":
        case "AS":
        case "AN":
        case "OC":
        case "SA":
            await pool.query("SELECT * FROM `countries` WHERE continent_code = ?", [continent], function (err, result, fields) {
                if (err) next(err);
                if (req.headers['content-type'] === "application/xml") {
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
    //});
});


/**
 * @swagger
 * /countries:
 *      post:
 *          description: Add countries
 *          requestBody:
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *          responses:
 *                  '200':
 *                      description: A successful response
 *                  '204':
 *                      description: Record not found
 *                  '400':
 *                      description: Bad GET Requestasdasd
 */

router.post('/', jsonParser, async function (req, res, next) {
    console.log(req.body);

    const Country = {
        country_code: req.body.CODE,
        country_name: req.body.COUNTRY_NAME,
        fullcountry_name: req.body.FULL_NAME,
        iso3: req.body.ISO3,
        country_number: req.body.COUNTRY_NUMBER,
        continent_code: req.body.CONTINENT_CODE
    }
    if (!Country) {
        return res.status(400).send({
            error: true, message: 'please provide all required fields and in the following format:' +
                '{\r\n"CODE": "ZZ",\r\n"Country": "Brabandia",\r\n"FULL_NAME": "Branabdia",\r\n"ISO3": "BQR",\r\n"COUNTRY_NUMBER":500,\r\n"CONTINENT_CODE": "EU"\r\n}'
        });
    }

    // pool.connect(function (err) {
    try {
        await pool.query("INSERT INTO`countries`(`code`, `country_name`, `full_name`, `ISO3`, `country_number`, `continent_code`) VALUES('" + Country.country_code + "', '" + Country.country_name + "', '" + Country.fullcountry_name + "', '" + Country.iso3 + "', '" + Country.country_number + "', '" + Country.continent_code + "')", function (err, result, fields) {
            if (err) {
                next(err);

            } else {
                return res.status(200).send({ message: 'Country succesfully inserted.' });
            }

        });
    } catch (err) {
        return res.status(400).send({ error: true, message: 'please provide all required fields' });
    }
    // });

});

/**
 * @swagger
 * /countries/{CODE}:
 *  patch:
 *      description: Make changes to a country
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.patch('/:CODE', async (req, res, next) => {
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

    //pool.connect(function (err) {
    await pool.query("UPDATE countries SET COUNTRY_NAME ='" + Country.country_name + "',FULL_NAME='" +
        Country.fullcountry_name + "', ISO3='" + Country.iso3 + "',COUNTRY_NUMBER='"
        + Country.COUNTRY_NUMBER + "',CONTINENT_CODE='"
        + Country.continent_code + "'WHERE CODE ='"
        + CODE + "'", function (err, result, fields) {
            if (err) throw err;
            return res.status(200).send({ message: 'Country succesfully updated.' });
        });
    //});
});


/**
 * @swagger
 * /country/{CODE}:
 *  delete:
 *      parameters:
 *          in: path
 *          name: CODE
 *          schema:
 *             type: string
 *          required: true
 *          description: The country code
 *      description: Delete country
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.delete('/:CODE', async (req, res, next) => {
    var CODE = req.params.CODE
    //pool.connect(function (err) {
    await pool.query("DELETE FROM countries WHERE CODE ='" + CODE + "'", function (err, result, fields) {
        if (err) throw err;
        return res.status(200).send({ message: 'Country succesfully Deleted.' });
    });
    // });
});
module.exports = router;