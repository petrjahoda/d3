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
                     .domain([0, d3.max(lineChartData["Data"], d => d["Value"])])
                     .range([innerHeight, 0])
                     .nice()

    // create axis and append axis to chart
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%H:%M:%S"))
    const yAxis = d3.axisLeft(yScale)
    chart.append("g")
         .attr("class", "x-axis")
         .attr("transform", `translate(0, ${innerHeight + 10})`)
         .call(xAxis)
    chart.append("g")
         .call(yAxis)
         .attr("transform", `translate(-5, 0)`)
         .attr("class", "y-axis")
         .attr("font-weight", "500")
         .attr("font-size", "12px")

    // generate and append line data
    const lineGenerator = d3.area()
                            .x(d => xScale(new Date(d["Time"])))
                            .y0(innerHeight)
                            .y1(d => yScale(d["Value"]))
                            .curve(d3.curveMonotoneX)
    chart.append("path")
         .attr("d", lineGenerator(lineChartData["Data"]))
         .attr("fill", "hsla(355, 65%, 65%, 1.0)")
         .attr("stroke", "hsla(355, 65%, 65%, 1.0)")

    //create tooltip
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


    // Overlay rectangle to capture mouse events over the entire chart area.
    const bisectDate = d3.bisector(d => new Date(d["Time"])).left;
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
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0.9);
             tooltip.html(
                 `<div style="margin-bottom: 5px; font-weight: bold; color: #fff;">${d3.timeFormat("%H:%M:%S")(new Date(d["Time"]))}</div>
                  <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: hsla(355, 65%, 65%, 1.0); margin-right: 5px;"></span>
                    <span>Value: ${d["Value"]}</span>
                  </div>`)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .style("transform", "translate(-50%, -100%)");
         })
         .on("mouseout", () => {
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
         });
}
