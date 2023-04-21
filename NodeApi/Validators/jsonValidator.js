//for validating json schema
const jsonValidator = require('jsonschema').Validator;
const validator = new jsonValidator();
const RE2 = require("re2");
const { errorMonitor } = require('tedious/lib/bulk-load');

function validateJson(jsonvalidation) {
    return (req, res, next) => {
        const valid = validator.validate(req.body, jsonvalidation, { throwError: true, regExp: RE2 });
        if (!valid) {
            const errors = errorMonitor;
            res.status(500).json(errors);
        } else {
            return res.status(200).json({
                success: 1,
                data: results
            });
        }
        next();
    };
}

module.exports = validateJson;