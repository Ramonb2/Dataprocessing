const express = require('express');
const morgan = require('morgan');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');

const swaggerOptions = {
    swaggerDefinition: {
            openapi: "3.0.0",
            info:{
                title: "rest api for Dataprocessing",
                version: "1.6",
                description: "Dataprocessing api",
                contact: {
                    name:"Ramon Brakels"
                },       
            },
            servers: [
                {
                    url: "http://{username}:{port}/{basePath}",
                    description: "Database",
                    variables: {
                        username: {
                            default: "localhost",
                            description: "value"
                        }
                    },
                    port: {
                        enum: [
                            3000
                        ],
                        default: 3000
                    },
                    basePath: {
                        default: "/"
                    }
                }
                
            ]
    },
    apis: ["./AGD/*.js", "./countries/*.js","./depression/*.js", "./wealth/*.js","./alcohol-usage/*.js"]
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

const AGD = require('./api/routes/json/AGD');
const alcohol_usage = require('./api/routes/json/alcohol-usage');
const world_wealth_index = require('./api/routes/json/world_wealth_index');
const countries = require('./api/routes/json/countries');
const depression = require('./api/routes/json/depression');
const xmlAGD = require('./api/routes/xml/AGD');
const xmlalcohol_usage = require('./api/routes/xml/alcohol-usage');
const xmlworld_wealth_index = require('./api/routes/xml/world_wealth_index');
const xmlcountries = require('./api/routes/xml/countries');
const xmldepression = require('./api/routes/xml/depression');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(xmlparser());

app.use('/AGD', AGD);
app.use('/alcohol-usage', alcohol_usage);
app.use('/wealth', world_wealth_index);
app.use('/countries', countries);
app.use('/depression', depression);
app.use('/xml/AGD', xmlAGD);
app.use('/xml/alcohol-usage', xmlalcohol_usage);
app.use('/xml/wealth', xmlworld_wealth_index);
app.use('/xml/depression', xmldepression);
app.use('/xml/countries', xmlcountries);


app.use((req,res,next)=>{
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    }) 
})

module.exports = app;