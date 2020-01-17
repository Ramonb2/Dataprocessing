const express = require('express');
const router = express.Router();
var mysql = require('mysql'); 
var js2xmlparser = require("js2xmlparser");


router.get('/', (req, res, next)=>{
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "apidatabase"
    });

    con.connect(function (err) {
        con.query("SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol FROM depression as A JOIN `alcohol-usage` as B on A.Country = B.Country JOIN`world-index` as C on A.Country = C.Country", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
            con.destroy();
        });
    });
    
});

router.get('/xml', function(req, res, next) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "apidatabase"
    });

    con.connect(function (err) {
        con.query("SELECT A.Country, A.depression, C.Log_of_GDP_per_capita, B.total_litres_of_pure_alcohol FROM depression as A JOIN `alcohol-usage` as B on A.Country = B.Country JOIN`world-index` as C on A.Country = C.Country", function (err, result, fields) {
            if (err) throw err;
            result = js2xmlparser.parse("Data", result);
            con.destroy();
            return res.send(result);
            
        });
    });

});



router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price

    }
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