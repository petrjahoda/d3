const container = d3.select("#container");
const svg = container.append("svg")
                     .attr("width", "100%")

const rect = svg.append("rect")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", container.node().getBoundingClientRect().width * 0.8)
                .attr("height", 14)
                .attr("fill", "steelblue");

window.addEventListener("resize", () => {
    rect.attr("width", container.node().getBoundingClientRect().width * 0.8);
});