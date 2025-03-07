let barChartData;
let lineChartData;
const barChartContainer = d3.select("#bar-chart-container")
const lineChartContainer = d3.select("#line-chart-container")


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


function drawLineChart() {
    // clear chart
    lineChartContainer.selectAll("*").remove()
    // create constants for chart
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = lineChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // append svg to dom
    const svg = lineChartContainer.append("svg")
                                  .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // create scales
    const xScale = d3.scaleTime()
                     .domain([d3.min(lineChartData["Data"], d => new Date(d["Time"])), d3.max(lineChartData["Data"], d => new Date(d["Time"]))])
                     .range([0, innerWidth])
    const yScale = d3.scaleLinear()
                     .domain([d3.max(lineChartData["Data"], d => d["Value"]), 0])
                     .range([0, innerHeight])
                     .nice()

    // create axis and append axis to chart
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%H:%M:%S"))
    const yAxis = d3.axisLeft(yScale)
    chart.append("g")
         .attr("class", "x-axis")
         .attr("transform", `translate(0, ${innerHeight})`)
         .call(xAxis)
    chart.append("g")
         .call(yAxis)
         .attr("class", "y-axis")
         .attr("font-weight", "500")
         .attr("font-size", "12px")

    // generate and append line data
    const lineGenerator = d3.line()
                            .x(d => xScale(new Date(d["Time"])))
                            .y(d => yScale(d["Value"]))
                            .curve(d3.curveMonotoneX)
    chart.append("path")
         .attr("d", lineGenerator(lineChartData["Data"]))
         .attr("fill", "none")
         .attr("stroke", "hsla(355, 65%, 65%, 1.0)")

    //create tooltip
    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("background", "#f4f4f4")
                      .style("padding", "5px 10px")
                      .style("border", "1px solid #ccc")
                      .style("border-radius", "5px")
                      .style("pointer-events", "none")
                      .style("opacity", 0);

    // Add circles at data points, and attach tooltip events.
    const bisectDate = d3.bisector(d => new Date(d["Time"])).left;

    // Overlay rectangle to capture mouse events over the entire chart area.
    chart.append("rect")
         .attr("class", "overlay")
         .attr("width", innerWidth)
         .attr("height", innerHeight)
         .style("fill", "none")
         .style("pointer-events", "all")
         .on("mousemove", (event) => {
             // Get mouse position relative to the chart
             const [xPos] = d3.pointer(event);
             // Convert the x position to a date
             const x0 = xScale.invert(xPos);
             // Find the index of the closest data point
             const index = bisectDate(lineChartData["Data"], x0);
             const d0 = lineChartData["Data"][index - 1];
             const d1 = lineChartData["Data"][index];
             // Use the closer of the two data points (if available)
             let d = d0;
             if (d1 && x0 - new Date(d0["Time"]) > new Date(d1["Time"]) - x0) {
                 d = d1;
             }
             // Update and position the tooltip
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0.9);
             tooltip.html(
                 `<strong>Time:</strong> ${d3.timeFormat("%H:%M:%S")(new Date(d["Time"]))}<br/>
                  <strong>Value:</strong> ${d["Value"]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 25) + "px");
         })
         .on("mouseout", () => {
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
         });
}

function drawBarChart() {
    // clear chart
    barChartContainer.selectAll("*").remove()

    // create constants for chart
    const barHeight = 30
    const longestName = d3.max(barChartData["Data"], d => d["Name"].length)
    const margin = {top: 100, right: 100, bottom: 100, left: longestName * 8}
    const width = barChartContainer.node().getBoundingClientRect().width
    const height = barHeight * barChartData["Data"].length
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom


    // append svg to dom
    const svg = barChartContainer.append("svg")
                                 .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // create scales
    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(barChartData["Data"], d => d["Age"])])
                     .range([0, innerWidth])
                     .nice()
    const yScale = d3.scaleBand()
                     .domain(barChartData["Data"].map(d => d["Name"]))
                     .range([0, innerHeight])
                     .paddingInner(0.08)

    // create axis and append axis to chart
    let tickCount = Math.floor(innerWidth / 100)
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d + " let")
                    .ticks(tickCount)
    const yAxis = d3.axisLeft(yScale)
                    .tickSize(0)
    chart.append("g")
         .attr("transform", `translate(0, -20)`)
         .attr("class", "x-axis")
         .call(xAxis)
    chart.append("g")
         .call(yAxis)
         .attr("class", "y-axis")
         .attr("font-weight", "500")
         .attr("font-size", "12px")
         .attr("transform", `translate(-2, 0)`)

    //make axis fancier
    d3.select(".x-axis")
      .selectAll('path')
      .remove()
    d3.select(".x-axis")
      .selectAll('text')
      .attr("font-size", "12px")
      .attr("transform", "translate(0, -10)");
    d3.select(".x-axis")
      .selectAll('line')
      .attr("transform", "translate(0, 10)");
    d3.select(".y-axis")
      .selectAll('path')
      .remove()

    // append data to chart
    chart.append("g")
         .selectAll(".bar")
         .data(barChartData["Data"])
         .join("rect")
         .attr("class", "bar")
         .attr("x", 0)
         .attr("y", d => yScale(d["Name"]))
         .attr("width", d => xScale(d["Age"]))
         .attr("height", yScale.bandwidth())
         .attr("fill", d => d["Color"])

    // append age labels to the end fo every bar
    chart.selectAll(".label")
         .data(barChartData["Data"])
         .join("text")
         .text(d => d["Age"] + " let")
         .attr("x", d => xScale(d["Age"]) + 5)
         .attr("y", d => yScale(d["Name"]) + yScale.bandwidth() / 2)
         .attr("font-size", "10px")
         .attr("fill", "black")
         .attr("alignment-baseline", "middle");

    // draw vertical grid lines through chart
    chart.selectAll(".grid-line")
         .data(xScale.ticks(tickCount))
         .join("line")
         .attr("class", "grid-line")
         .attr("x1", d => xScale(d))
         .attr("y1", 0)
         .attr("x2", d => xScale(d))
         .attr("y2", innerHeight)
         .attr("stroke", "hsla(215, 12%, 15%, 0.2)")
         .attr("stroke-dasharray", "4,4");

    // add interactivity
    chart.selectAll("rect")
         .on("mouseover", function (event, d) {
             console.log(d["Name"]);
             chart.selectAll("rect")
                  .transition()
                  .duration(500)
                  .style("opacity", 0.5);
             d3.select(this)
               .transition()
               .duration(200)
               .style("opacity", 1);
         })
         .on("mouseout", function () {
             chart.selectAll("rect")
                  .transition()
                  .duration(500)
                  .style("opacity", 1);
         });
}