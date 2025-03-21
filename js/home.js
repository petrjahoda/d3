let barChartData;
let lineChartData;
let stackedChartData;
const barChartContainer = d3.select("#bar-chart-container")
const lineChartContainer = d3.select("#line-chart-container")
const donutChartContainer = d3.select("#donut-chart-container")
const pieChartContainer = d3.select("#pie-chart-container")
const stackedChartContainer = d3.select("#stacked-chart-container")
const steamedChartContainer = d3.select("#steamed-chart-container")
const tooltip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .style("display", "block")
                  .style("background-color", "rgba(50, 50, 50, 0.7)")
                  .style("border-radius", "4px")
                  .style("color", "#fff")
                  .style("font-size", "14px")
                  .style("padding", "10px")
                  .style("pointer-events", "none")
                  .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.2)")
                  .style("z-index", "9999")
                  .style("opacity", 0);




fetch("/d3_bar_chart_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    barChartData = data;
    drawBarChart()
    window.addEventListener("resize", drawBarChart);
})).catch((e) => console.error(e))

fetch("/d3_line_chart_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    lineChartData = data;
    drawLineChart()
    window.addEventListener("resize", drawLineChart);
})).catch((e) => console.error(e))

drawDonutChart()
const pieData = [
    {"name": "CNC-1", "value": 45},
    {"name": "CNC-2", "value": 21},
    {"name": "CNC-3", "value": 56},
    {"name": "CNC-4", "value": 33}
];
drawPieChart(pieData)

fetch("/d3_stacked_chart_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    stackedChartData = data;
    drawStackedChart()
    drawSteamChart()
    window.addEventListener("resize", drawStackedChart);
    window.addEventListener("resize", drawSteamChart);
})).catch((e) => console.error(e))

