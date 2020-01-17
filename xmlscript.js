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
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(myArr, "text/xml");
        var index;

        var County_nodes = xmlDoc.getElementsByTagName('Country');
        var depression_nodes = xmlDoc.getElementsByTagName('depression');
        var GDP_nodes = xmlDoc.getElementsByTagName('Log_of_GDP_per_capita');
        var alcohol_nodes = xmlDoc.getElementsByTagName('total_litres_of_pure_alcohol');

        var ctx = document.getElementById('myChartxml');
        var sites = [];


        for (index = 0; index < County_nodes.length; index++) {
            var site = {

                label: County_nodes[index].firstChild.data.toString(),
                backgroundColor: dynamicColors(),
                borderColor: "rgb(69,70,72)",
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverRadius: 5,
                data: [
                    {
                        x: Number(alcohol_nodes[index].firstChild.data),
                        y: Number(GDP_nodes[index].firstChild.data),
                        r: 3.2 * depression_nodes[index].firstChild.data
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
xmlhttp.open("GET", "http://10.232.35.47:3000/AGD/xml", true);
xmlhttp.send()

