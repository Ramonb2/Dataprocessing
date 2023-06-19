<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script src='xmlscript.js'></script>
    <style>
        .header {
            background-color: #000;
            color: #fff;
            padding: 10px;
            display: flex;
            justify-content: space-between;
        }

        .header-button {
            margin-left: auto;
            height: 50px;
            font-weight: bold;
        }
    </style>
    <script>
        function executeChart() {
            xmlChart();
            console.log('test');
            jsonChart();
        }

        function openModal() {
            $('#myModal').modal('show');
        }

        // function submitForm() {
        //     const format = document.getElementById("exampleFormControlSelect1").value;
        //     const input = document.getElementById("exampleFormControlTextarea1").value;

        //     const escapedInput = input.replace(/\n/g, "");

        //     const requestData = {
        //         input: JSON.stringify(escapedInput)
        //     };

        //     const requestOptions = {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(requestData)
        //     };

        //     fetch('http://localhost:3000/countries', requestOptions)
        //         .then(response => {
        //             if (!response.ok) {
        //                 throw new Error(`HTTP error! Status: ${response.status}`);
        //             }
        //             // Handle response
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //         });

        //     $('#myModal').modal('hide');
        // }
    </script>
</head>
<body>
    <div class="header">
        <h1>Dataprocessing</h1>
        <button class="btn btn-lg btn-primary" onclick="openModal()">Add country data</button>
    </div>

    <div class="container mt-5">
        <div class="form-group">
            <label for="mySelect">Select Region:</label>
            <select id="mySelect" class="form-control" onchange="executeChart()">
                <option value="EU">Europe</option>
                <option value="AF">Africa</option>
                <option value="AS">Asia</option>
                <option value="OC">Oceania</option>
                <option value="AN">Antarctica</option>
                <option value="SA">South America</option>
                <option value="NA">North America</option>
            </select>
        </div>
        <div class="row">
            <div class="col-md-12">
                <canvas id="myChart" width="800" height="800"></canvas>
            </div>
            <div class="col-md-12">
                <canvas id="myChartxml" width="800" height="800"></canvas>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add country</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="index.php" method="post">
                        <div class="form-group">
                            <label for="exampleFormControlSelect1">Format</label>
                            <select class="form-control" id="exampleFormControlSelect1">
                                <option>JSON</option>

                            </select>
                        </div>

                        <div class="form-group">
                            <label for="input1">input</label>
                            <textarea class="form-control" name="input" id="input" rows="3"></textarea>
                        </div>
                        <!-- Add more input fields if needed -->
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <input type="submit" class="btn btn-primary" id="submit" value="Click me">
                    </form>
                </div>
                <div class="modal-footer">
                    
                </div>
            </div>
        </div>
    </div>
    <script>
        jsonChart()
        console.log('test')
        xmlChart() </script>
    <?php

    /*
        To run this you first need to run the node.js server. Make sure Node.js is installed.
        if you installed this open windows powershell or cmd and navigate to the server directory.
        Type the command npm start in the terminal.
    */
    use JsonSchema\Validator;
    use JsonSchema\Constraints\Constraint;
    if(isset($_POST['input'])){
        require_once 'vendor/autoload.php';

        $data = $_POST['input'];
        $config = json_decode(file_get_contents('http://localhost:3000/AGD/EU'));
        $validator = new Validator; $validator->validate(
            $data,
            (object)['$ref' => 'file://' . realpath('schema.json')],
            Constraint::CHECK_MODE_APPLY_DEFAULTS

        );
        if ($validator->isValid()) {
            // if the validation is OK the following script will be loaded to draw a chart from the json data.
            $url = 'http://localhost:3000/countries'; // Replace with your API endpoint

            $data = $_POST['input'];
            $jsonData = json_encode($data);

            $headers = array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
            );

            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonData);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            $response = curl_exec($curl);

            if ($response === false) {
                echo 'Error: ' . curl_error($curl);
            } else {
                echo 'Response: ' . $response;
            }

            curl_close($curl);
        } else {
        echo "
        <script> alert('Invalid data')</script>
        ";
        }

    }

    ?>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    </body>
</html>