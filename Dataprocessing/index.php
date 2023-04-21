<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script src='script.js'></script>
    <script src='xmlscript.js'></script>
    <script>
      function executeChart(){
        xmlChart();
        console.log('test');
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
<div>
    <canvas id='myChartxml' width='400' height='400'></canvas>
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

  echo "<script> console.log('test')
  jsonChart() </script>";
} else {
  echo "JSON validation errors:\n";
  foreach ($validator->getErrors() as $error) {
    print_r($error);
  }
}

function get_xml_from_url($url){
  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type: application/xml'));

  $xmlstr = curl_exec($ch);
  curl_close($ch);

  return $xmlstr;
}

function validate_xml($xmlstr){
  $xml = new DOMDocument();
  $xml->loadXML($xmlstr);
  return $xml->schemaValidate("schema.xsd");
}

if (validate_xml(get_xml_from_url("http://localhost:3000/AGD/EU"))){
  echo "<script> console.log('test')
  xmlChart() </script>";
} else {
  echo "XML not valid";
}

?>
</body>

</html>