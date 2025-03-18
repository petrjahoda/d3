function drawDonutChart() {
    // 1. clear chart
    donutChartContainer.selectAll("*").remove()

    // 3. create chart
    const margin = {top: 0, right: 0, bottom: 0, left: 0}
    const width = donutChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const svg = donutChartContainer.append("svg")
                                   .attr("viewBox", [0, 0, width, height])
    const chart = svg.append("g")
                     .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)

    // 4. create scales, arc generator
    const arcGenerator = d3.arc()
                  .innerRadius(innerWidth / 4)
                  .outerRadius(innerWidth / 2.5)
                  .padAngle(0.005)
                  .cornerRadius(4)
    const maleCentroid = arcGenerator.startAngle(0)
                                     .endAngle(0.5 * Math.PI)
                                     .centroid()

    const femaleCentroid = arcGenerator.startAngle(0.5 * Math.PI)
                                       .endAngle(2 * Math.PI)
                                       .centroid()
    // 6. add data
    chart.append("path")
         .attr("d", arcGenerator({startAngle: 0, endAngle: 0.5 * Math.PI}))
         .attr("fill", "hsla(355, 65%, 65%, 1.0)")
    chart.append("path")
         .attr("d", arcGenerator({startAngle: 0.5 * Math.PI, endAngle: 2 * Math.PI}))
         .attr("fill", "hsla(155, 65%, 65%, 1.0)")

// 7. make the chart fancier
    chart.append("text")
        .text("Male")
        .attr("x", maleCentroid[0])
        .attr("y", maleCentroid[1])
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")

    chart.append("text")
        .text("Female")
        .attr("x", femaleCentroid[0])
        .attr("y", femaleCentroid[1])
        .attr("font-size", "12px")
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .attr("fill", "white")
}