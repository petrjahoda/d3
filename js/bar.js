async function drawBarChart() {
    d3.selectAll("svg").remove()
    const {dataset, xAccessor, yAccessor} = await accessData();
    let dimensions = createChartDimensions();
    const bounds = drawCanvas(dimensions);
    const {yScale, xScale} = createScales(xAccessor, yAccessor, dimensions, dataset);
    // drawOptional(yScale, bounds, dimensions);
    drawData(xAccessor, yAccessor, xScale, yScale, bounds, dimensions, dataset);
    drawPeripherals(xScale, yScale, bounds, dimensions);
    // setUpInteractions()
}

drawBarChart().then(() => console.log("chart completed"))

async function accessData() {
    const dataset = await d3.json("../data/data.json")
    dataset.sort(function (a, b) {
        return d3.ascending(a.Freq, b.Freq)
    })
    const xAccessor = d => d.Freq
    const yAccessor = d => d.Letter
    return {dataset, xAccessor, yAccessor};
}

function createChartDimensions() {
    let dimensions = {
        width: window.innerWidth,
        height: 200,
        margin: {top: 15, right: 15, bottom: 40, left: 60,},
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    return dimensions;
}

function drawCanvas(dimensions) {
    const wrapper = d3.select("#wrapper")
        .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    return wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left / 2}px, ${dimensions.margin.top}px)`);
}

function createScales(xAccessor, yAccessor, dimensions, dataset) {
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, xAccessor)])
        .range([0, dimensions.boundedWidth])
    const yScale = d3.scaleBand()
        .domain(dataset.map(yAccessor))
        .range([dimensions.boundedHeight, 0])
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

function drawData(xAccessor, yAccessor, xScale, yScale, bounds, dimensions, dataset) {
    bounds.selectAll('rect')
        .data(dataset)
        .join('rect')
        .attr('y', d => yScale(yAccessor(d)) + 4)
        .attr('width', d => xScale(xAccessor(d)))
        .attr("fill", "steelblue")
        .attr('height', '20')
        .on("mouseover", function (d) {
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", "steelblue");
        })
        .on("click", function (d) {
            console.log(d.target.__data__.Letter)
        })
    bounds.selectAll("text")
        .data(dataset)
        .join("text")
        .text(xAccessor)
        .attr('x', d => xScale(xAccessor(d)) - 10)
        .attr('y', d => yScale(yAccessor(d)) + dimensions.margin.top + 3)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");
}

function drawPeripherals(xScale, yScale, bounds, dimensions) {
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    bounds.append("g")
        .call(yAxisGenerator)
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line').remove();
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
        .selectAll('.domain, .tick line, text').remove()
}

function setUpInteractions() {
    console.log("setting up interactions")
}


function resize() {
    console.log("resized")
    drawBarChart()
}

window.addEventListener('resize', resize );