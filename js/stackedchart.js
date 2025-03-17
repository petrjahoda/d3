function drawStackedChart() {
    // clear chart
    stackedChartContainer.selectAll("*").remove()

    // parse and preprocess the data
    const dates = stackedChartData[0]["Values"].map(item => item["Key"])
    const names = stackedChartData.map(item => item["Name"]);
    const data = dates.map(date => ({date, ...Object.fromEntries(stackedChartData.map(d => [d["Name"], d["Values"].find(v => v["Key"] === date)?.["Value"] || 0]))}));

    // create constants
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = stackedChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const tickCount = Math.floor(innerWidth / 50)

    // append svg to dom
    const svg = stackedChartContainer.append("svg")
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

    // add X axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d3.timeFormat('%b %d')(new Date(d)))
                    .tickValues(dates.filter((_, i) => i % Math.ceil(dates.length / tickCount) === 0))
    const yAxis = d3.axisLeft(yScale)
    chart.append('g')
         .attr('transform', `translate(0,${innerHeight})`)
         .call(xAxis)
         .selectAll('text')
         .style('text-anchor', 'middle')
    chart.append('g')
         .call(yAxis);

    // add chart data
    chart.selectAll('.bar')
         .data(stackedData)
         .join('g')
         .attr('class', 'bar')
         .style('fill', d => colorScale(d.key))
         .selectAll('rect')
         .data(d => d)
         .join('rect')
         .attr('x', d => xScale(d.data.date))
         .attr('y', d => yScale(d[1]))
         .attr('height', d => yScale(d[0]) - yScale(d[1]))
         .attr('width', xScale.bandwidth());

    // add legend
    svg.append('g')
       .attr('transform', `translate(${margin.left},${margin.top + innerHeight + 50})`)
       .selectAll('g')
       .data(names)
       .join('g')
       .attr('transform', (d, i) => `translate(${i * 120},0)`)
       .call(g => {
           g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => colorScale(d));
           g.append('text')
            .attr('x', 20)
            .attr('y', 12.5)
            .attr('text-anchor', 'start')
            .style('font-size', '12px')
            .text(d => d);
       });

    // add tooltip
    chart.selectAll("rect")
         .on("mousemove", function (event, d) {
             const barColor = d3.select(this).style("fill");
             tooltip.style("opacity", 1)
                    .html(`
                        ${new Date(d.data.date)}<br>
                        <span style="display: inline-block; width: 10px; height: 10px; background-color: ${barColor}; margin-right: 5px;"></span>
                        <span style="font-weight:500">${d3.select(this.parentNode).datum().key}</span>: ${(d[1] - d[0]).toFixed(1)}<br>
                        `)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .style("transform", "translate(-50%, -100%)");
         })
         .on("mouseout", function () {
             tooltip.style("opacity", 0);
             d3.select(this).style("fill-opacity", 1);
         });
}