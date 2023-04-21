const { readFileSync } = require('fs');
const ajv = new (require('ajv'))();


function parser(input) {

    try{

    
    let schemaFile = './Validators/schema.json';
    function readJsonFile(file) {
        let raw = readFileSync(file);
        file.parse
        return JSON.parse(raw);
    }

    let schema = readJsonFile(schemaFile);

    const isValid = ajv.validate(schema, input);

    if (!isValid) {
        console.error(JSON.stringify(ajv.errors, null, 2));
        return undefined;
    }
        
    ajv.compile(schema);
    console.info('[INFO] Valid!');
    return true;
}
catch(err){
    console.error(err);
    return undefined;
}
}

module.exports = parser;