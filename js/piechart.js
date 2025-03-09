function drawPieChart(pieData) {
    // clear chart
    pieChartContainer.selectAll("*").remove()

    // create constants for chart
    const margin = {top: 0, right: 0, bottom: 0, left: 0}
    const width = pieChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const sortedData = pieData.sort((a, b) => b.value - a.value);
    const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);


    // append svg to dom
    const svg = pieChartContainer.append("svg")
                                 .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)


    // generate arc
    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(radius * 0.9)
                  .cornerRadius(2);

    // create pie generator that generates pie data from data
    const pieGenerator = d3.pie()
                           .value(d => d.value)

    // create color scale
    const color = d3.scaleOrdinal()
                    .domain(sortedData.map(d => d.name))
                    .range(d3.schemeObservable10);

    // create pie chart segments
    chart.selectAll("path")
         .data(pieGenerator(sortedData))
         .join("path")
         .attr("fill", d => color(d.data.name))
         .attr("d", arc)
         .attr("stroke", "white")
         .attr("stroke-width", 1)
         .style("opacity", 0.9);


    // add legend
    const legend = svg.append("g")
                      .attr("transform", `translate(0, 10)`);
    legend.selectAll("rect")
          .data(sortedData)
          .join("rect")
          .attr("y", (d, i) => i * 20)
          .attr("width", 17)
          .attr("height", 17)
          .attr("rx", 3)  // horizontal corner radius
          .attr("ry", 3)
          .attr("fill", d => color(d.name))
    legend.selectAll("text")
          .data(sortedData)
          .join("text")
          .attr("x", 20)
          .attr("y", (d, i) => i * 20 + 10)
          .text(d => `${d.name}: ${d.value}, ${((d.value / totalValue) * 100).toFixed(1)}%`)
          .attr("font-size", "14px")
          .attr("alignment-baseline", "middle")

    // add tooltip data
    svg.selectAll("path")
       .data(pieGenerator(pieData))
       .join("path")
       .attr("d", arc)
       .attr("fill", d => color(d.data.name))
       .on("mousemove", function (event, d) {
           tooltip.transition()
                  .duration(100)
                  .style("opacity", 0.9);
           tooltip.html(`
                <div style="font-weight:500">${d.data.name}</div>
                Value: ${d.data.value}<br>
                Percentage: ${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%`)
                  .style("left", event.pageX + "px")
                  .style("top", event.pageY + "px")
                  .style("transform", "translate(-50%, -100%)");
       })
       .on("mouseout", function () {
           tooltip.transition()
                  .duration(100)
                  .style("opacity", 0);
       });


}