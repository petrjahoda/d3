function drawSteamChart() {
    // clear chart
    steamedChartContainer.selectAll("*").remove()

    // parse and preprocess the data
    const dates = stackedChartData[0]["Values"].map(item => item["Key"])
    const names = stackedChartData.map(item => item["Name"]);
    const data = dates.map(date => ({date, ...Object.fromEntries(stackedChartData.map(d => [d["Name"], d["Values"].find(v => v["Key"] === date)?.["Value"] || 0]))}));

    // create constants
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = steamedChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const tickCount = Math.floor(innerWidth / 50)

    // append svg to dom
    const svg = steamedChartContainer.append("svg")
                                     .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // generate data for stack
    const stackGenerator = d3.stack()
                             .keys(names);
    const stackedData = stackGenerator(data);

    // create scales
    const xScale = d3.scaleBand()
                     .domain(dates)
                     .range([0, innerWidth])
                     .padding(0.1);
    const yScale = d3.scaleLinear()
                     .domain([d3.min(stackedData, d => d3.min(d, d => d[1])), d3.max(stackedData, d => d3.max(d, d => d[1]))])
                     .range([innerHeight, 0])
                     .nice()
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
                         .domain(names);

    // create area generator
    const area = d3.area()
                   .x(d => xScale(d.data.date) + xScale.bandwidth() / 2)
                   .y0(d => yScale(d[0]))
                   .y1(d => yScale(d[1]))
                   .curve(d3.curveMonotoneX); // Makes the curve smoother

    // add X axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d3.timeFormat('%b %d')(new Date(d)))
                    .tickValues(dates.filter((_, i) => i % Math.ceil(dates.length / tickCount) === 0))
    const yAxis = d3.axisLeft(yScale);
    chart.append('g')
         .attr('transform', `translate(0,${innerHeight})`)
         .call(xAxis)
         .selectAll('text')
         .style('text-anchor', 'middle');
    chart.append('g')
         .call(yAxis);

    // add chart data
    chart.append('g')
         .attr('class', 'areas-container')
         .selectAll('path')
         .data(stackedData)
         .join('path')
         .attr('d', area)
         .attr('fill', d => colorScale(d.key))

    // add legend
    svg.append('g')
       .attr('transform', `translate(${margin.left},${margin.top + innerHeight + 50})`)
       .selectAll('g')
       .data(names)
       .join('g')
       .attr('transform', (d, i) => `translate(${i * 121},0)`)
       .call(g => {
           g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => colorScale(d));
           g.append('text')
            .attr('x', 20)
            .attr('y', 12.6)
            .attr('text-anchor', 'start')
            .style('font-size', '12px')
            .text(d => d);
       });

    // Add tooltip
    chart.selectAll('path')
         .on("mousemove", function (event, d) {
             const hoveredDate = xScale.domain().find(date => Math.abs(xScale(date) + xScale.bandwidth() / 2 - d3.pointer(event, this)[0]) < xScale.bandwidth() / 2);
             if (hoveredDate) {
                 const hoveredValue = d.find(segment => segment.data.date === hoveredDate);
                 if (hoveredValue) {
                     tooltip.style("opacity", 1)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 10) + "px")
                            .html(`<span style="font-weight:500">${d.key}</span><br>Date: ${hoveredDate}<br>Value: ${(hoveredValue[1] - hoveredValue[0]).toPrecision(3)}`);
                 }
             }
         })
         .on("mouseout", function () {
             tooltip.style("opacity", 0);
         });


}