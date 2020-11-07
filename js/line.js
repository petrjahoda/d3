async function drawLineChart() {
    const {dataset, xAccessor, yAccessor} = await accessData();
    let dimensions = createChartDimensions();
    const bounds = drawCanvas(dimensions);
    const {yScale, xScale} = createScales(xAccessor, yAccessor, dimensions, dataset);
    drawOptional(yScale, bounds, dimensions);
    drawData(xAccessor, yAccessor, xScale, yScale, bounds, dataset);
    drawPeripherals(xScale, yScale, bounds, dimensions);
    setUpInteractions()
}

drawLineChart().then(() => console.log("chart completed"))

function setUpInteractions() {
    console.log("setting up interactions")
}

function drawCanvas(dimensions) {
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
    return wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left/2}px, ${dimensions.margin.top}px)`);
}

function createScales(xAccessor, yAccessor, dimensions, dataset) {
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    return {yScale, xScale};
}

function drawOptional(yScale, bounds, dimensions) {
    const freezingTemperaturePlacement = yScale(0)
    bounds.append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
        .attr("fill", "#e0f3f3")
}

function drawData(xAccessor, yAccessor, xScale, yScale, bounds, dataset) {
    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))
    bounds.append("path")
        .attr("d", lineGenerator(dataset))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
}

function drawPeripherals(xScale, yScale, bounds, dimensions) {
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    bounds.append("g")
        .call(yAxisGenerator)
    bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
}

function createChartDimensions() {
    let dimensions = {
        width: window.innerWidth,
        height: 400,
        margin: {top: 15, right: 15, bottom: 40, left: 60,},
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    return dimensions;
}

async function accessData() {
    const dataset = await d3.json("../data/nyc_weather_data.json")
    const dateFormatString = "%Y-%m-%d"
    const dateParser = d3.timeParse(dateFormatString)
    const xAccessor = d => dateParser(d.date)
    const yAccessor = d => (d.temperatureMax - 32) * (5 / 9) // convert to celsius
    return {dataset, xAccessor, yAccessor};
}
