function xmlChart() {
    const route = document.getElementById("mySelect").value;
    fetchXMLData(route)
      .then(xmlText => parseXMLData(xmlText))
      .then(parsedData => {
        const ctx = document.getElementById('myChartxml');
        createChart(ctx, parsedData);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  function jsonChart() {
    const route = document.getElementById("mySelect").value;
    fetchJsonData(route)
      .then(data => {
        const ctx = document.getElementById('myChart');
        const chartData = parseJsonData(data);
        createChart(ctx, chartData);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  // Fetch XML data from the server
  async function fetchXMLData(route) {
    const response = await fetch(`http://localhost:3000/AGD/${route}`, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return await response.text();
  }

  // Fetch JSON data from the server
async function fetchJsonData(route) {
    const response = await fetch(`http://localhost:3000/AGD/${route}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return await response.json();
  }
  
  // Parse XML data
  function parseXMLData(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const countryNodes = xmlDoc.getElementsByTagName('Country');
    const countryNameNodes = xmlDoc.getElementsByTagName('Country_name');
    const depressionNodes = xmlDoc.getElementsByTagName('Depression');
    const GDPNodes = xmlDoc.getElementsByTagName('Log_of_GDP_per_capita');
    const alcoholNodes = xmlDoc.getElementsByTagName('total_litres_of_pure_alcohol');
  
    const sites = Array.from(countryNodes).map((node, i) => {
      return {
        label: countryNameNodes[i].firstChild.data.toString(),
        backgroundColor: dynamicColors(),
        borderColor: "rgb(69,70,72)",
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverRadius: 5,
        data: [
          {
            x: Number(alcoholNodes[i].firstChild.data),
            y: Number(GDPNodes[i].firstChild.data),
            r: 3.2 * depressionNodes[i].firstChild.data
          }
        ]
      };
    });
  
    return { labels: ["countries"], datasets: sites };
  }

  // Parse JSON data
function parseJsonData(data) {
    const sites = data.map(element => {
      return {
        label: element.Country.toString(),
        backgroundColor: dynamicColors(),
        borderColor: "rgb(69,70,72)",
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverRadius: 5,
        data: [{
          x: Number(element.total_litres_of_pure_alcohol),
          y: Number(element.Log_of_GDP_per_capita),
          r: 3.2 * element.depression
        }]
      };
    });
  
    return { labels: ["countries"], datasets: sites };
  }
  
  
  // Create the chart using Chart.js
  function createChart(ctx, data) {
    const options = {
      title: { display: true, text: 'Depression, gdp and alcohol' },
      scales: {
        yAxes: [{
          scaleLabel: { display: true, labelString: "GDP Ranking" },
          ticks: { beginAtZero: true }
        }],
        xAxes: [{
          scaleLabel: { display: true, labelString: "total consumption of alcohol" },
          ticks: { beginAtZero: true }
        }]
      }
    };
  
    new Chart(ctx, { type: "bubble", data, options });
  }
  
  // Generate random RGB color
  const dynamicColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  };
  
  xmlChart();
  jsonChart();