let barChartData;
let lineChartData;
const barChartContainer = d3.select("#bar-chart-container")
const lineChartContainer = d3.select("#line-chart-container")
const donutChartContainer = d3.select("#donut-chart-container")


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

