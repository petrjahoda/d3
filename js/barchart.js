function drawBarChart() {
    // 1. clear chart
    barChartContainer.selectAll("*").remove()

    // 3. create chart
    const barHeight = 30
    const longestName = d3.max(barChartData["Data"], d => d["Name"].length)
    const margin = {top: 100, right: 100, bottom: 100, left: longestName * 8}
    const width = barChartContainer.node().getBoundingClientRect().width
    const height = barHeight * barChartData["Data"].length
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const svg = barChartContainer.append("svg")
                                 .attr("viewBox", [0, 0, width, height])
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)
    const tickCount = Math.floor(innerWidth / 100)

    // 4. create scales
    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(barChartData["Data"], d => d["Age"])])
                     .range([0, innerWidth])
                     .nice()
    const yScale = d3.scaleBand()
                     .domain(barChartData["Data"].map(d => d["Name"]))
                     .range([0, innerHeight])
                     .paddingInner(0.08)

    // 5. add X axis
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

    // 6. add data
    chart.append("g")
         .selectAll(".bar")
         .data(barChartData["Data"])
         .join("rect")
         .attr("class", "bar")
         .attr("x", 0)
         .attr("y", d => yScale(d["Name"]))
         .attr("width", d => xScale(d["Age"]))
         .transition()
         .delay(1000)
         .attr("height", yScale.bandwidth())
         .attr("fill", d => d["Color"])


    // 7. make the chart fancier
    chart.selectAll(".label")
         .data(barChartData["Data"])
         .join("text")
         .transition()
         .delay(1000)
         .text(d => d["Age"] + " let")
         .attr("x", d => xScale(d["Age"]) + 5)
         .attr("y", d => yScale(d["Name"]) + yScale.bandwidth() / 2)
         .attr("font-size", "10px")
         .attr("fill", "black")
         .attr("alignment-baseline", "middle");
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

    // 8. Add tooltip
    chart.selectAll("rect")
         .on("mouseover", function (event, d) {
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