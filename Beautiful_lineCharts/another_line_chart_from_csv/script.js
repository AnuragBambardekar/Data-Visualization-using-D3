// set the dimensions and margins for the chart

const margin = {top:70, right:3, bottom:40, left:80};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// set up the x and y scales
const x = d3.scaleTime().range([0,width]);
const y = d3.scaleLinear().range([height,0]);

// create the svg
const svg = d3.select("#chart-container")
.append("svg")
.attr("width",width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

// load and process data from .csv
d3.csv("NA_Emissions.csv").then(function(data){
    // console.log(data)
    const parseDate = d3.timeParse("%Y");
    data.forEach(d => {
        d.date = parseDate(d.date)
        d.emissions = +d.emissions;
        console.log(d)
    });


// define the x and y domains
// domain means what data is going to fit in the range
x.domain(d3.extent(data, d => d.date));
y.domain([1500, d3.max(data, d => d.emissions)]);

// console.log(d3.max(data, d => d.emissions))

// add the x-axis
// svg.append("g")
// .attr("transform",`translate(0,${height})`)
// .call(d3.axisBottom(x)
//     .ticks(d3.timeYear.every(4))
//     .tickFormat(d3.timeFormat("%Y")));

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", "14px")
    .call(d3.axisBottom(x)
      .tickValues(x.ticks(d3.timeYear.every(4))) 
      .tickFormat(d3.timeFormat("%Y"))) 
    .call(g => g.select(".domain").remove()) 
    .selectAll(".tick line") 
    .style("stroke-opacity", 0)
  svg.selectAll(".tick text")
    .attr("fill", "#777");


// add the y-axis
// svg.append("g")
// .call(d3.axisLeft(y)
//     .ticks((d3.max(data, d => d.emissions) - 1500) / 500)
//     .tickFormat(d => {
//         return `${(d / 1000)}`;
//     }));

svg.append("g")
.style("font-size", "14px")
.call(d3.axisLeft(y)
    .ticks((d3.max(data, d => d.emissions) - 1500) / 500)
    .tickFormat(d => {
        return `${(d / 1000)}`;
    })
    .tickSize(0)
    .tickPadding(10))
.call(g => g.select(".domain").remove()) 
.selectAll(".tick text")
.attr("fill", "#777")
.style("visibility", (d, i, nodes) => {
    if (i === 0) {
    return "hidden"; 
    } else {
    return "visible"; 
    }
});


// Add gridlines
svg.selectAll("xGrid")
.data(x.ticks().slice(1))
.join("line")
.attr("x1", d => x(d))
.attr("x2", d => x(d))
.attr("y1", 0)
.attr("y2", height)
.attr("stroke", "#e0e0e0")
.attr("stroke-width", .5);

svg.selectAll("yGrid")
.data(y.ticks((d3.max(data, d => d.emissions) - 1500) / 500).slice(1))
.join("line")
.attr("x1", 0)
.attr("x2", width)
.attr("y1", d => y(d))
.attr("y2", d => y(d))
.attr("stroke", "#e0e0e0")
.attr("stroke-width", .5)


// create the line generator
const line = d3.line()
.x(d => x(d.date))
.y(d => y(d.emissions))

// add the line path to the SVG element
svg.append("path")
.datum(data)
.attr("fill","none")
.attr("stroke","steelblue")
.attr("stroke-width",1)
.attr("d", line)

// Add Y-axis label
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.style("font-size", "13px")
.style("fill", "#777")
.style("font-family", "sans-serif")
.text("CO2 emissions, North America, Annual (million metric tonnes carbon dioxide)");

// Add the chart title
svg.append("text")
.attr("class", "chart-title")
.attr("x", margin.left - 115)
.attr("y", margin.top - 100)
.style("font-size", "24px")
.style("font-weight", "bold")
.style("font-family", "sans-serif")
.text("CO2 Emissions in the US Have Trended Upward Since 90's");

// Add the source credit
svg.append("text")
    .attr("class", "source-credit")
    .attr("x", width - 1125)
    .attr("y", height + margin.bottom - 3)
    .style("font-size", "9px")
    .style("font-family", "sans-serif")
    .text("Source: Unknown");

})