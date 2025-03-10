function drawStackedChart() {
    const stackedChartData = [
        {
            "name": "CNC-1", "days": {
                "2024-01-01": 10.2,
                "2024-01-02": 10.7,
                "2024-01-03": 15.3,
                "2024-01-04": 12.8,
                "2024-01-05": 23.1,
                "2024-01-06": 7.4,
                "2024-01-07": 19.6,
                "2024-01-08": 22.3,
                "2024-01-09": 9.1,
                "2024-01-10": 14.5,
                "2024-01-11": 10.9,
                "2024-01-12": 16.7,
                "2024-01-13": 11.2,
                "2024-01-14": 18.4,
                "2024-01-15": 13.9,
                "2024-01-16": 20.1,
                "2024-01-17": 6.3,
                "2024-01-18": 24.7,
                "2024-01-19": 17.5,
                "2024-01-20": 14.2,
                "2024-01-21": 10.2,
                "2024-01-22": 21.6,
                "2024-01-23": 19.3,
                "2024-01-24": 8.4,
                "2024-01-25": 27.2,
                "2024-01-26": 12.6,
                "2024-01-27": 18.9,
                "2024-01-28": 23.4,
                "2024-01-29": 9.7,
                "2024-01-30": 16.8,
                "2024-01-31": 11.5
            },
        },
        {
            "name": "CNC-2", "days": {
                "2024-01-01": 12.5,
                "2024-01-02": 14.3,
                "2024-01-03": 9.8,
                "2024-01-04": 17.2,
                "2024-01-05": 11.6,
                "2024-01-06": 8.9,
                "2024-01-07": 15.3,
                "2024-01-08": 19.2,
                "2024-01-09": 10.5,
                "2024-01-10": 13.8,
                "2024-01-11": 9.4,
                "2024-01-12": 14.7,
                "2024-01-13": 12.1,
                "2024-01-14": 16.5,
                "2024-01-15": 11.3,
                "2024-01-16": 18.9,
                "2024-01-17": 7.6,
                "2024-01-18": 22.4,
                "2024-01-19": 14.1,
                "2024-01-20": 11.9,
                "2024-01-21": 10.8,
                "2024-01-22": 20.3,
                "2024-01-23": 16.4,
                "2024-01-24": 9.2,
                "2024-01-25": 24.3,
                "2024-01-26": 13.0,
                "2024-01-27": 17.6,
                "2024-01-28": 20.5,
                "2024-01-29": 8.7,
                "2024-01-30": 14.2,
                "2024-01-31": 12.8
            },
        },
        {
            "name": "CNC-3", "days": {
                "2024-01-01": 8.4,
                "2024-01-02": 11.7,
                "2024-01-03": 14.9,
                "2024-01-04": 10.5,
                "2024-01-05": 20.2,
                "2024-01-06": 6.8,
                "2024-01-07": 18.4,
                "2024-01-08": 21.7,
                "2024-01-09": 7.5,
                "2024-01-10": 12.4,
                "2024-01-11": 9.0,
                "2024-01-12": 13.8,
                "2024-01-13": 10.2,
                "2024-01-14": 15.9,
                "2024-01-15": 12.8,
                "2024-01-16": 17.5,
                "2024-01-17": 5.9,
                "2024-01-18": 23.2,
                "2024-01-19": 16.3,
                "2024-01-20": 13.4,
                "2024-01-21": 9.7,
                "2024-01-22": 18.6,
                "2024-01-23": 15.7,
                "2024-01-24": 7.1,
                "2024-01-25": 25.8,
                "2024-01-26": 11.9,
                "2024-01-27": 16.8,
                "2024-01-28": 22.7,
                "2024-01-29": 9.3,
                "2024-01-30": 15.4,
                "2024-01-31": 10.7
            },
        },
    ];
    // clear chart
    stackedChartContainer.selectAll("*").remove()

    // Parse and preprocess the data
    const dates = Object.keys(stackedChartData[0].days);
    const series = stackedChartData.map(d => d.name);
    const data = dates.map(date => {
        const entry = {date: date};
        stackedChartData.forEach(d => {
            entry[d.name] = d.days[date];
        });
        return entry;
    });

    // create constants for chart
    const margin = {top: 100, right: 100, bottom: 100, left: 100}
    const width = stackedChartContainer.node().getBoundingClientRect().width
    const height = 500
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const stack = d3.stack().keys(series);
    const stackedData = stack(data);
    const tickCount = Math.floor(innerWidth / 50)

    // append svg to dom
    const svg = stackedChartContainer.append("svg")
                                  .attr("viewBox", [0, 0, width, height])

    // create chart and append to dom
    const chart = svg.append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const xScale = d3.scaleBand()
                     .domain(dates)
                     .range([0, innerWidth])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(stackedData, d =>
                         d3.max(d, d => d[1])
                     )])
                     .nice()
                     .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
                         .domain(series);

    // Add X axis
    chart.append('g')
       .attr('transform', `translate(0,${innerHeight})`)
       .call(d3.axisBottom(xScale)
               .ticks(tickCount)
               .tickFormat(d => d3.timeFormat('%b %d')(new Date(d))) // Format date
               .tickValues(dates.filter((_, i) => i % Math.ceil(dates.length / tickCount) === 0))) // Limit ticks
       .selectAll('text')
       .style('text-anchor', 'middle')

    // Add Y axis
    chart.append('g')
       .call(d3.axisLeft(yScale));

    // Add chart
    const group = chart.selectAll('.layer')
                     .data(stackedData)
                     .join('g')
                     .attr('class', 'layer')
                     .style('fill', d => colorScale(d.key));

    group.selectAll('rect')
         .data(d => d)
         .join('rect')
         .attr('x', d => xScale(d.data.date))
         .attr('y', d => yScale(d[1]))
         .attr('height', d => yScale(d[0]) - yScale(d[1]))
         .attr('width', xScale.bandwidth());

    // Add legend
    const legend = svg.append('g')
                      .attr('transform', `translate(${width - 100},${0})`);

    series.forEach((name, i) => {
        const legendRow = legend.append('g')
                                .attr('transform', `translate(0,${i * 20})`);

        legendRow.append('rect')
                 .attr('width', 15)
                 .attr('height', 15)
                 .style('fill', colorScale(name));

        legendRow.append('text')
                 .attr('x', 20)
                 .attr('y', 12.5)
                 .attr('text-anchor', 'start')
                 .style('font-size', '12px')
                 .text(name);
    });
}