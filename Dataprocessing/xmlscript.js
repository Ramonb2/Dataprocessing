function xmlChart() {
    var route = document.getElementById("mySelect").value;

    var dynamicColors = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };



    var xmlhttp = new XMLHttpRequest();
   

    xmlhttp.onreadystatechange = function () {
        if (this.status == 200) {
            var myArr = this.responseText;
            console.log(myArr);
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(myArr, "text/xml");
            var index;

            var Countries_nodes = xmlDoc.getElementsByTagName('Countries');
            var Country_node = xmlDoc.getElementsByTagName('Country');
            var Country_name_node = xmlDoc.getElementsByTagName('Country_name');
            var depression_nodes = xmlDoc.getElementsByTagName('Depression');
            var GDP_nodes = xmlDoc.getElementsByTagName('Log_of_GDP_per_capita');
            var alcohol_nodes = xmlDoc.getElementsByTagName('total_litres_of_pure_alcohol');

            var ctx = document.getElementById('myChartxml');
            var sites = [];


            for (i = 0; i < Country_node.length; i++) {
                console.log(Countries_nodes);
                var site = {

                    label: Country_name_node[i].firstChild.data.toString(),
                    backgroundColor: dynamicColors(),
                    borderColor: "rgb(69,70,72)",
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverRadius: 5,
                    data: [
                        {
                            x: Number(alcohol_nodes[i].firstChild.data),
                            y: Number(GDP_nodes[i].firstChild.data),
                            r: 3.2 * depression_nodes[i].firstChild.data
                        }
                    ]
                };
                sites.push(site);
            }

            var data = { labels: ["countries"], datasets: sites };
            var options = {
                title: { display: true, text: 'Depression, gdp and alcohol' },
                scales: {
                    yAxes:
                        [
                            {
                                scaleLabel: { display: true, labelString: "GDP Ranking" },
                                ticks: { beginAtZero: true }
                            }
                        ],
                    xAxes:
                        [
                            {
                                scaleLabel: { display: true, labelString: "total consumption of alcohol" },
                                ticks: { beginAtZero: true }
                            }
                        ]
                }
            };
            new Chart(ctx, { type: "bubble", data: data, options: options });
        }


    };

    xmlhttp.open('GET', 'http://localhost:3000/AGD/' + route, true);
    xmlhttp.setRequestHeader("Content-Type", "application/xml");
    xmlhttp.send();
}