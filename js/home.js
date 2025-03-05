let chartData;
const container = d3.select("#container")



fetch("/d3_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    chartData = data;
    updateChart()
    window.addEventListener("resize", updateChart);
})).catch((e) => console.error(e))

function updateChart() {
    const leftMargin = 150
    const rightMargin = 50
    const barHeight = 25
    container.selectAll("*").remove()
    const svg = container.append("svg")
                         .attr("width", "100%")
                         .attr("height", barHeight * chartData["Data"].length)
                         .attr("top", "10px")
    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(chartData["Data"], d => d["Age"])])
                     .range([0, container.node().getBoundingClientRect().width - leftMargin - rightMargin])

    const yScale = d3.scaleBand()
                     .domain(chartData["Data"].map(d => d["Name"]))
                     .range([0, barHeight * chartData["Data"].length])
                     .paddingInner(0.1)
    const barAndLabel = svg.selectAll("g")
                           .data(chartData["Data"])
                           .join("g")
                           .attr("transform", d => `translate(0, ${yScale(d["Name"])})`)

    barAndLabel.append("rect")
               .attr("x", leftMargin)
               .attr("y", 0)
               .attr("width", d => xScale(d["Age"]))
               .attr("height", yScale.bandwidth())
               .attr("fill", d => d["Color"])
               .attr("data-name", d => d["Name"])


    barAndLabel.append("text")
               .text(d => d["Name"])
               .attr("x", leftMargin - 10)
               .attr("y", barHeight / 2 + 2.5)
               .attr("text-anchor", "end")
               .attr("font-family", "sans-serif")
               .attr("font-size", "12px")
    barAndLabel.append("text")
               .text(d => d["Age"])
               .attr("x", d => xScale(d["Age"]) + leftMargin + 10)
               .attr("y", barHeight / 2 + 2.5)
               .attr("font-family", "sans-serif")
               .attr("font-size", "12px")
    svg.append("line")
       .attr("x1", leftMargin)
       .attr("y1", 0)
       .attr("x2", leftMargin)
       .attr("y2", barHeight * chartData["Data"].length)
       .attr("stroke", "black")
       .attr("stroke-width", 1);
}

