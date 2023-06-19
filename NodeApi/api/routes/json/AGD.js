const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const builder = require('xmlbuilder');

const pool = require('../../../db')



function buildXMLResponse(result) {
    const xml = builder.create('Countries');
    result.forEach(row => {
        xml.ele('Country')
            .ele('Country_name', row['Country']).up()
            .ele('Depression', row['depression']).up()
            .ele('Log_of_GDP_per_capita', row['Log_of_GDP_per_capita']).up()
            .ele('total_litres_of_pure_alcohol', row['total_litres_of_pure_alcohol']).end()
    });
    let xmldoc = xml.toString({ pretty: true });
    xmldoc = xmldoc.replace(/^/, "<?xml version='1.0' encoding='UTF-8' ?>\n");
    return xmldoc;
}


router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/**
 * @swagger
 * /AGD:
 *  get:
 *      description: Select graph data
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.get('/', (req, res, next) => {
    const query = `
        SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol
        FROM depression as A
        JOIN \`alcohol-usage\` as B on A.Country = B.Country
        JOIN \`world-index\` as C on A.Country = C.Country
    `;
    pool.query(query, function (err, result, fields) {
        if (err) next(err);
        if (req.headers['content-type'] === "application/xml") {
            res.send(buildXMLResponse(result));
        } else {
            res.status(200).json(result);
        }
    });
});


/**
 * @swagger
 * /AGD/{continent}:
 *  get:
 *      description: Select graph data for a continent
 *      responses:
 *          '200':
 *              description: A successful response
 *          '204':
 *              description: Record not found
 *          '400':
 *              description: Bad GET Request
 */
router.get('/:continent', (req, res, next) => {
    const continent = req.params.continent.toUpperCase();
    const allowedContinents = ["EU", "NA", "AF", "AS", "AN", "OC", "SA"];

    if (allowedContinents.includes(continent)) {
        const query = `
            SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol
            FROM depression as A
            JOIN \`alcohol-usage\` as B on A.Country = B.Country
            JOIN \`world-index\` as C on A.Country = C.Country
            WHERE B.continent = ?
        `;
        pool.query(query, [continent], function (err, result, fields) {
            if (err) next(err);
            if (req.headers['content-type'] === "application/xml") {
                res.send(buildXMLResponse(result));
            } else {
                res.status(200).json(result);
            }
        });
    } else if (continent === "ATL") {
        res.status(200).json({
            message: 'Seems like you discovered Atlantis. Good job!'
        });
    } else {
        res.status(200).json({
            message: 'This continent is unknown ' + continent
        });
    }
});

module.exports = router;