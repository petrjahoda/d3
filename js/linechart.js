function drawLineChart() {
    // 1. clear chart
    lineChartContainer.selectAll("*").remove()

    // 3. create chart
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = lineChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    let tickCount = Math.floor(innerWidth / 100)
    const svg = lineChartContainer.append("svg")
                                  .attr("viewBox", [0, 0, width, height])
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)
    // 4. create scales
    const xScale = d3.scaleTime()
                     .domain([new Date(d3.min(lineChartData["Data"], d => d["Time"] * 1000)), new Date(d3.max(lineChartData["Data"], d => d["Time"] * 1000))])
                     .range([0, innerWidth])
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(lineChartData["Data"], d => d["Value"])])
                     .range([innerHeight, 0])
                     .nice()

    // OPTIONAL: resample data
    let resampledData = resampleData(xScale.domain());

    // 5. create data generator and handle breaks in data
    const chartGapRatio = lineChartData["Data"].length / resampledData.length
    const gapSeconds = 11
    const lineGenerator = d3.area()
                            .defined((d, i, data) => {
                                if (i === 0) return true;
                                const prevTime = data[i - 1]["Time"];
                                const currTime = d["Time"];
                                return (currTime - prevTime) <= (gapSeconds * chartGapRatio);
                            })
                            .x(d => xScale(new Date(d["Time"] * 1000)))
                            .y0(innerHeight)
                            .y1(d => yScale(d["Value"]))
                            .curve(d3.curveMonotoneX);


    // 6. add X axis
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

    // 7. add data
    chart.append("path")
         .attr("d", lineGenerator(resampledData))
         .attr("fill", "hsla(355, 65%, 65%, 1.0)")
         .attr("stroke", "hsla(355, 65%, 65%, 1.0)")

    // 10. Add tooltip
    const verticalLine = chart.append("g")
                              .attr("class", "vertical-line")
                              .style("opacity", 0);

    // Add the vertical line
    verticalLine.append("line")
                .attr("y1", 0)
                .attr("y2", innerHeight)
                .attr("stroke", "#666")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");

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
             const index = bisectDate(resampledData, x0);
             const d0 = resampledData[index - 1];
             const d1 = resampledData[index];
             let d = d0;
             if (d1 && x0 - new Date(d0["Time"] * 1000) > new Date(d1["Time"] * 1000) - x0) {
                 d = d1;
             }
             const lineX = xScale(new Date(d["Time"] * 1000));
             verticalLine.style("opacity", 1)
                         .attr("transform", `translate(${lineX},0)`);

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
             verticalLine.style("opacity", 0)
             tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
         });
}

function splitByGaps(data, thresholdMs = 11000) {
    if (!data || data.length === 0) return [];
    const segments = [];
    let currentSegment = [data[0]];

    for (let i = 1; i < data.length; i++) {
        const currTime = new Date(data[i]["Time"] * 1000);
        const prevTime = new Date(data[i - 1]["Time"] * 1000);
        // if the gap is larger than the threshold, start a new segment
        if (currTime - prevTime > thresholdMs) {
            segments.push(currentSegment);
            currentSegment = [];
        }
        currentSegment.push(data[i]);
    }
    if (currentSegment.length) {
        segments.push(currentSegment);
    }
    return segments;
}


function resampleData(xDomain) {
    const lowerBound = xDomain[0].getTime();
    const upperBound = xDomain[1].getTime();
    let filteredData = [];
    for (let i = 0; i < lineChartData["Data"].length; i++) {
        const point = lineChartData["Data"][i];
        const timestamp = point["Time"] * 1000;
        if (timestamp >= lowerBound && timestamp <= upperBound) {
            filteredData.push(point);
        }
    }
    if (filteredData.length <= innerWidth) {
        return filteredData;
    }
    const step = (filteredData.length - 1) / (innerWidth - 1);
    const result = new Array(innerWidth);
    let resultIndex = 0;
    for (let i = 0; i < innerWidth; i++) {
        const exactIndex = i * step;
        const lowerIndex = Math.floor(exactIndex);
        const fraction = exactIndex - lowerIndex;
        if (lowerIndex >= filteredData.length - 1) continue;
        if (exactIndex === lowerIndex) {
            result[resultIndex++] = filteredData[lowerIndex];
        } else {
            const lowerPoint = filteredData[lowerIndex];
            const upperPoint = filteredData[lowerIndex + 1];
            result[resultIndex++] = {
                Time: Math.round(lowerPoint["Time"] + fraction * (upperPoint["Time"] - lowerPoint["Time"])),
                Value: lowerPoint["Value"] + fraction * (upperPoint["Value"] - lowerPoint["Value"])
            };
        }
    }
    return result.slice(0, resultIndex);
}
