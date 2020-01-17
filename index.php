<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
</head>
<body>
    <div>
    <canvas id='myChart' width='400' height='400'></canvas>
</div>

<?php
require_once 'vendor/autoload.php';
 
use JsonSchema\Validator;
use JsonSchema\Constraints\Constraint;
 
$config = json_decode(file_get_contents('http://10.232.35.47:3000/AGD'));
$validator = new Validator; $validator->validate(
  $config,
  (object)['$ref' => 'file://' . realpath('schema.json')],
  Constraint::CHECK_MODE_APPLY_DEFAULTS
);
 
if ($validator->isValid()) {
  echo "<script src='script.js'></script>";
} else {
  echo "JSON validation errors:\n";
  foreach ($validator->getErrors() as $error) {
    print_r($error);
  }
}



$xml= new DOMDocument();
$xml->load("http://10.232.35.47:3000/AGD/xml"); // Or load if filename required
if (!$xml->schemaValidate("schema.xsd")) // Or schemaValidateSource if string used.
{
   echo "test";
} else{
    
    echo "<script src='xmlscript.js'></script>";
}

?>


</script>
<div>
    <canvas id='myChartxml' width='400' height='400'></canvas>
</div>
</body>

</html>