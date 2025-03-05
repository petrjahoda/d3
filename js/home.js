// const rect = svg.append("rect")
//                 .attr("x", 10)
//                 .attr("y", 10)
//                 .attr("width", container.node().getBoundingClientRect().width * 0.8)
//                 .attr("height", 14)
//                 .attr("fill", "steelblue");
//
// window.addEventListener("resize", () => {
//     rect.attr("width", container.node().getBoundingClientRect().width * 0.8);
// });


fetch("/d3_data", {
    method: "POST", headers: {'Content-Type': 'application/json'}
}).then(response => response.json().then(data => {
    const container = d3.select("#container");
    const svg = container.append("svg")
                         .attr("width", "100%")
                         .attr("height", "100%")
    let barHeight = 14;
    let maxBarWidth = container.node().getBoundingClientRect().width
    // console.log(data);
    // console.log(d3.max(data["Data"], d => d["Age"]))
    // console.log(d3.min(data["Data"], d => d["Age"]))
    // console.log(d3.extent(data["Data"], d => d["Age"]))
    // console.log(d3.max(data["Data"], d => d["Height"]))
    // console.log(d3.min(data["Data"], d => d["Height"]))
    // console.log(d3.extent(data["Data"], d => d["Height"]))
    // const ages = d3.group(data["Data"], (d) => d["Age"]);
    // ages.forEach((d, i) => {
    //     console.log(i);
    //     d.forEach(e => console.log("\t"+e["Name"]))
    // })
    // const heights = d3.group(data["Data"], (d) => d["Height"]);
    // heights.forEach((d, i) => {
    //     console.log(i);
    //     d.forEach(e => console.log("\t"+e["Name"]))
    // })
    svg.selectAll("rect")
       .data(data["Data"])
       .join("rect")
       .attr("x", 0)
       .attr("y", (d, i) => (barHeight + 5) * i)
       .attr("width", d => maxBarWidth / 100 * d["Age"])
       .attr("height", barHeight)
       .attr("fill", d => d["Color"])
})).catch((e) => console.error(e))
