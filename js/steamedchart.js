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

    // append svg to dom
    const svg = steamedChartContainer.append("svg")
                                     .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // generate data for stack
    const stackGenerator = d3.stack()
                             .keys(names)
                             .order(d3.stackOrderNone)
                             .offset(d3.stackOffsetSilhouette);
    const stackedData = stackGenerator(data)


    // create scales
    const xScale = d3.scaleTime()
                     .domain(d3.extent(dates, d => new Date(d)))
                     .range([0, innerWidth])


    const yScale = d3.scaleLinear()
                     .domain([-d3.max(stackedData, d => d3.max(d, d => d[1])), d3.max(stackedData, d => d3.max(d, d => d[1]))])
                     .range([innerHeight, 0])
                     .nice();

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
                         .domain(names);

    // create area generator
    const area = d3.area()
                   .x(d => xScale(new Date(d.data.date)))
                   .y0(d => yScale(d[0]))
                   .y1(d => yScale(d[1]))
                   .curve(d3.curveMonotoneX); // Makes the curve smoother

    // add X axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat('%b %d'))
                    .ticks(Math.min(dates.length, 10));
    const yAxis = d3.axisLeft(yScale);

    // chart.append('g')
    //      .attr('transform', `translate(0,${innerHeight})`)
    //      .call(xAxis)
    //      .selectAll('text')
    //      .style('text-anchor', 'middle');
    //
    // chart.append('g')
    //      .call(yAxis);

    // add chart data - steam areas
    chart.selectAll('.area')
         .data(stackedData)
         .join('path')
         .attr('class', 'area')
         .attr('d', area)
         .style('fill', d => colorScale(d.key))
         .style('stroke', '#fff')
         .style('stroke-width', 0.5);

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

    // Tooltip functionality with bisector for better hover experience
    const bisect = d3.bisector(d => new Date(d.date)).left;

    // Create a vertical line for tooltip
    const tooltipLine = chart.append('line')
                             .attr('class', 'tooltip-line')
                             .style('stroke', '#ddd')
                             .style('stroke-width', '1px')
                             .style('stroke-dasharray', '3,3')
                             .style('opacity', 0);

    // Create invisible overlay for mouse tracking
    const overlay = chart.append('rect')
                         .attr('width', innerWidth)
                         .attr('height', innerHeight)
                         .style('fill', 'none')
                         .style('pointer-events', 'all');

    overlay
        .on('mousemove', function(event) {
            const mouse = d3.pointer(event);
            const x0 = xScale.invert(mouse[0]);
            const idx = bisect(data, x0, 1);
            const d0 = data[Math.max(0, idx - 1)];
            const d1 = data[Math.min(data.length - 1, idx)];
            const d = x0 - new Date(d0.date) > new Date(d1.date) - x0 ? d1 : d0;

            // Position the tooltip line
            tooltipLine
                .style('opacity', 1)
                .attr('x1', xScale(new Date(d.date)))
                .attr('x2', xScale(new Date(d.date)))
                .attr('y1', 0)
                .attr('y2', innerHeight);

            // Update tooltip content
            tooltip.style('opacity', 1)
                   .html(`
                    <div style="font-weight:500">${d3.timeFormat('%B %d, %Y')(new Date(d.date))}</div>
                    ${names.map(name =>
                       `<div>
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${colorScale(name)}; margin-right: 5px;"></span>
                            <span style="font-weight:500">${name}</span>: ${d[name].toFixed(1)}
                        </div>`
                   ).join('')}
                `)
                   .style('left', (event.pageX) + 'px')
                   .style('top', (event.pageY - 28) + 'px')
                   .style('transform', 'translate(-50%, -100%)');
        })
        .on('mouseout', function() {
            tooltipLine.style('opacity', 0);
            tooltip.style('opacity', 0);
        });
}