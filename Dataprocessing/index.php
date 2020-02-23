<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script>
    function executeChart(){
        xmlChart();
        jsonChart();
    }
    </script>
</head>
<body>
    <div>
    <select id="mySelect" onchange="executeChart()">
      <option value="EU">Europe</option>
      <option value="AF">Africa</option>
      <option value="AS">Asia</option>
      <option value="OC">Oceania</option>
      <option value="AN">Antartica</option>
      <option value="SA">South America</option>
      <option value="NA">North America</option>
    </select>
    <canvas id='myChart' width='400' height='400'></canvas>
</div>

<?php
require_once 'vendor/autoload.php';
 /*
    To run this you first need to run the node.js server. Make sure Node.js is installed.
    if you installed this open windows powershell or cmd and navigate to the server directory.
    Type the command npm start in the terminal.
 */
use JsonSchema\Validator;
use JsonSchema\Constraints\Constraint;
 
$config = json_decode(file_get_contents('http://localhost:3000/AGD/EU'));
$validator = new Validator; $validator->validate(
  $config,
  (object)['$ref' => 'file://' . realpath('schema.json')],
  Constraint::CHECK_MODE_APPLY_DEFAULTS
);
 
if ($validator->isValid()) {
// if the validation is OK the following script will be loaded to draw a chart from the json data.
  echo "<script src='script.js'> </script>";
  echo "<script> executeChart() </script>";
} else {
  echo "JSON validation errors:\n";
  foreach ($validator->getErrors() as $error) {
    print_r($error);
  }
}



$xml= new DOMDocument();
$xml->load("http://localhost:3000/xml/AGD/EU"); // loads the xml from the api
if (!$xml->schemaValidate("schema.xsd")) // validates it according to the schema
{
  echo "not correct";
} else{
    // if the validation is OK the following script will be called to draw the graph based on the 
    // xml data.
    echo "<script src='xmlscript.js'></script>";
    echo "<script> executeChart() </script>";
} 
?>
<div>
    <canvas id='myChartxml' width='400' height='400'></canvas>
</div>
</body>

</html>