var myArr = [];
var dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.status == 200) {
        myArr = JSON.parse(this.responseText);

        var ctx = document.getElementById('myChart');
        var sites = [];

        myArr.forEach(element => {


            var site = {

                label: element.Country.toString(),
                backgroundColor: dynamicColors(),
                borderColor: "rgb(69,70,72)",
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverRadius: 5,
                data: [
                    {
                        x: Number(element.total_litres_of_pure_alcohol),
                        y: Number(element.Log_of_GDP_per_capita),
                        r: 3.2 * element.depression
                    }
                ]
            };
            sites.push(site);
        })
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
xmlhttp.open('GET', 'http://localhost:3000/AGD', true);
xmlhttp.send();


