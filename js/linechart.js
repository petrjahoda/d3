function drawLineChart() {
    // clear chart
    lineChartContainer.selectAll("*").remove()

    // create constants for chart
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = lineChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    let tickCount = Math.floor(innerWidth / 100)
    // append svg to dom
    const svg = lineChartContainer.append("svg")
                                  .attr("viewBox", [0, 0, width, height])
    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)
    // create scales
    const xScale = d3.scaleTime()
                     .domain([new Date(d3.min(lineChartData["Data"], d => d["Time"] * 1000)), new Date(d3.max(lineChartData["Data"], d => d["Time"] * 1000))])
                     .range([0, innerWidth])
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(lineChartData["Data"], d => d["Value"])])
                     .range([innerHeight, 0])
                     .nice()
    // create axis and append axis to chart
    const xAxis = d3.axisBottom(xScale)
                    .ticks(tickCount)
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

    // resample data
    function resampleData(xDomain) {
        let lowerBound = xDomain[0].getTime().valueOf();
        let upperBound = xDomain[1].getTime().valueOf();
        let filteredData = lineChartData["Data"].filter(point => {
            const pointTime = new Date(point["Time"] * 1000);
            return point["Time"] * 1000 >= lowerBound && pointTime <= upperBound;
        });
        if (filteredData.length <= innerWidth) {
            return filteredData;
        }
        let result = [];
        const step = (filteredData.length - 1) / (innerWidth - 1);
        for (let i = 0; i < innerWidth; i++) {
            const exactIndex = i * step;
            const lowerIndex = Math.floor(exactIndex);
            if (lowerIndex > filteredData.length - 1) {
                continue;
            }
            const upperIndex = Math.min(Math.ceil(exactIndex), filteredData.length - 1);
            if (lowerIndex === upperIndex) {
                result.push(filteredData[lowerIndex]);
            } else {
                const fraction = exactIndex - lowerIndex;
                const lowerPoint = filteredData[lowerIndex];
                const upperPoint = filteredData[upperIndex];
                const interpolatedTime = lowerPoint["Time"] * (1 - fraction) + upperPoint["Time"] * fraction
                const interpolatedValue = lowerPoint["Value"] * (1 - fraction) + upperPoint["Value"] * fraction;
                result.push({Time: Math.round(interpolatedTime), Value: interpolatedValue});
            }
        }
        return result;
    }

    let currentData = resampleData(xScale.domain());
    // generate and append line data
    const lineGenerator = d3.area()
                            .x(d => xScale(new Date(d["Time"] * 1000)))
                            .y0(innerHeight)
                            .y1(d => yScale(d["Value"]))
                            .curve(d3.curveMonotoneX)
    chart.append("path")
         .attr("d", lineGenerator(currentData))
         .attr("fill", "hsla(355, 65%, 65%, 1.0)")
         .attr("stroke", "hsla(355, 65%, 65%, 1.0)")

    // add tooltip data to overlay rectangle to capture mouse events over the entire chart area.
    const bisectDate = d3.bisector(d => new Date(d["Time"] * 1000)).left;
    chart.append("rect")
         .attr("class", "overlay")
         .attr("width", innerWidth)
         .attr("height", innerHeight)
         .style("fill", "none")
         .style("pointer-events", "all")
         .on("mousemove", (event) => {
             const [xPos] = d3.pointer(event);
             const x0 = xScale.invert(xPos);
             const index = bisectDate(currentData, x0);
             const d0 = currentData[index - 1];
             const d1 = currentData[index];
             let d = d0;
             if (d1 && x0 - new Date(d0["Time"] * 1000) > new Date(d1["Time"] * 1000) - x0) {
                 d = d1;
             }
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0.9);
             tooltip.html(
                 `<div style="margin-bottom: 5px; font-weight: 500; color: #fff;">${d3.timeFormat(new Date(d["Time"] * 1000))}</div>
                  <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: hsla(355, 65%, 65%, 1.0); margin-right: 5px;"></span>
                  <span>Value: ${d["Value"].toFixed(2)}</span>
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
