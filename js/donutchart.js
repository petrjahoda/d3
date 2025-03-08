function drawDonutChart() {
    // clear chart
    donutChartContainer.selectAll("*").remove()

    // create constants for chart
    const margin = {top: 0, right: 0, bottom: 0, left: 0}
    const width = donutChartContainer.node().getBoundingClientRect().width
    const height = donutChartContainer.node().getBoundingClientRect().width
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom


    // append svg to dom
    const svg = donutChartContainer.append("svg")
                                   .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)

    // generate arc
    const arc = d3.arc()
                  .innerRadius(innerWidth / 4)
                  .outerRadius(innerWidth / 2.5)
                  .padAngle(0.005)
                  .cornerRadius(4)

    // append data
    chart.append("path")
         .attr("d", arc({startAngle: 0, endAngle: 0.5 * Math.PI}))
         .attr("fill", "hsla(355, 65%, 65%, 1.0)")
    chart.append("path")
         .attr("d", arc({startAngle: 0.5 * Math.PI, endAngle: 2 * Math.PI}))
         .attr("fill", "hsla(155, 65%, 65%, 1.0)")

    // add label
    const maleCentroid = arc.startAngle(0)
                        .endAngle(0.5 * Math.PI)
                        .centroid()

    const femaleCentroid = arc.startAngle(0.5 * Math.PI)
                            .endAngle(2 * Math.PI)
                            .centroid()

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