const express = require('express');
const morgan = require('morgan');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const bodyParser = require('body-parser');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "rest api for Dataprocessing",
            version: "1.6",
            description: "Dataprocessing api",
            contact: {
                name: "Ramon Brakels"
            },
        },
        servers: [
            {
                url: "http://{username}:3000",
                description: "Database",
                variables: {
                    username: {
                        default: "localhost",
                        description: "value"
                    }
                },
            }

        ]
    },
    apis: ["./api/routes/json/*.js"]
};


const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// making sure that you won't get CORS errors.

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});



app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

const AGD = require('./api/routes/json/AGD');
const alcohol_usage = require('./api/routes/json/alcohol-usage');
const world_wealth_index = require('./api/routes/json/world_wealth_index');
const countries = require('./api/routes/json/countries');
const depression = require('./api/routes/json/depression');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/AGD', AGD);
app.use('/alcohol-usage', alcohol_usage);
app.use('/wealth', world_wealth_index);
app.use('/countries', countries);
app.use('/depression', depression);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;