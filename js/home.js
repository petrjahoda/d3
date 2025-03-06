let chartData;
const container = d3.select("#container")


fetch("/d3_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    chartData = data;
    drawBarChart()
    window.addEventListener("resize", drawBarChart);
})).catch((e) => console.error(e))

function drawBarChart() {

    // create constants for chart
    const barHeight = 30
    const margin = {top: 100, right: 0, bottom: 100, left: 80}
    const innerWidth = container.node().getBoundingClientRect().width
    const innerHeight = barHeight * chartData["Data"].length - margin.top - margin.bottom

    // clear chart
    container.selectAll("*").remove()

    // append svg to dom
    const svg = container.append("svg")
                         .attr("width", innerWidth)
                         .attr("height", innerHeight)

    // create chart from constants
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // create scales
    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(chartData["Data"], d => d["Age"])])
                     .range([0, innerWidth])
                     .nice()
    const yScale = d3.scaleBand()
                     .domain(chartData["Data"].map(d => d["Name"]))
                     .range([0, barHeight * chartData["Data"].length])
                     .paddingInner(0.1)

    // create and append axis from scales
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d + " let");
    const yAxis = d3.axisLeft(yScale)
                    .tickSize(0)
    chart.append("g")
         .attr("transform", `translate(0, -30)`)
         .call(xAxis)
    chart.append("g")
         .call(yAxis)
         .attr("transform", `translate(-0.5, 0)`)

    // append data to chart
    chart.selectAll(".bar")
         .data(chartData["Data"])
         .join("rect")
         .attr("class", "bar")
         .attr("x", 0)
         .attr("y", d => yScale(d["Name"]))
         .attr("width", d => xScale(d["Age"]))
         .attr("height", yScale.bandwidth())
         .attr("fill", d => d["Color"])

    // append labels to data
    chart.selectAll(".label")
         .data(chartData["Data"])
         .join("text")
         .text(d => d["Age"] + " let")
         .attr("x", d => xScale(d["Age"]) - 35)
         .attr("y", d => yScale(d["Name"]) + yScale.bandwidth() / 2)
         .attr("font-family", "sans-serif")
         .attr("font-size", "12px")
         .attr("fill", "white")
         .attr("alignment-baseline", "middle");

    // draw vertical grid lines
    chart.selectAll(".grid-line")
         .data(xScale.ticks())
         .join("line")
         .attr("class", "grid-line")
         .attr("x1", d => xScale(d))
         .attr("y1", 0)
         .attr("x2", d => xScale(d))
         .attr("y2", innerHeight)
         .attr("stroke", "hsla(215, 12%, 15%, 0.2)")
         .attr("stroke-dasharray", "4,4");
}