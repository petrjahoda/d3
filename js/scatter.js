async function drawScatterChart() {
    const {dataset, xAccessor, yAccessor, colorAccessor} = await accessData();
    let dimensions = createChartDimensions();
    const bounds = drawCanvas(dimensions);
    const {yScale, xScale, colorScale} = createScales(xAccessor, yAccessor, colorAccessor, dimensions, dataset);
    drawOptional(yScale, bounds, dimensions);
    drawData(xAccessor, yAccessor, xScale, yScale, colorScale, colorAccessor, bounds, dimensions, dataset);
    drawPeripherals(xScale, yScale, bounds, dimensions);
    // setUpInteractions()
}

drawScatterChart().then(() => console.log("chart completed"))

async function accessData() {
    const dataset = await d3.json("../data/nyc_weather_data.json")
    const xAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity
    const colorAccessor = d => d.cloudCover
    return {dataset, xAccessor, yAccessor, colorAccessor};
}

function createChartDimensions() {
    let dimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
        margin: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
        },
    }
    dimensions.boundedWidth = dimensions.width - 2 * dimensions.margin.left - 2 * dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - 2 * dimensions.margin.top - 2 * dimensions.margin.bottom
    return dimensions;
}

function drawCanvas(dimensions) {
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
    return wrapper.append("g")
        .style("transform", `translate(${2 * dimensions.margin.left}px, ${2 * dimensions.margin.top}px)`);
}

function createScales(xAccessor, yAccessor, colorAccessor, dimensions, dataset) {
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()
    const colorScale = d3.scaleLinear()
        .domain(d3.extent(dataset, colorAccessor))
        .range(["skyblue", "darkslategrey"])
    return {yScale, xScale, colorScale};
}

function drawOptional(yScale, bounds, dimensions) {
}

function drawData(xAccessor, yAccessor, xScale, yScale, colorScale, colorAccessor, bounds, dimensions, dataset) {
    bounds.selectAll("circle")
        .data(dataset)
        .join("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", d => colorScale(colorAccessor(d)))
}

function drawPeripherals(xScale, yScale, bounds, dimensions) {
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
        .append("text")
        .attr("x", dimensions.width / 2 - dimensions.margin.right)
        .attr("y", dimensions.margin.bottom)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .html("Dew point (&deg;F)")
    bounds.append("g")
        .call(yAxisGenerator)
        .append("text")
        .attr("x", -dimensions.boundedHeight / 2 + dimensions.margin.top / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .text("Relative humidity")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")
}











