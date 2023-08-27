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

// create a fake dataset
const dataset = [
    {date: new Date("2023-01-01"), value: 200},
    {date: new Date("2023-02-01"), value: 250},
    {date: new Date("2023-03-01"), value: 260},
    {date: new Date("2023-04-01"), value: 180},
    {date: new Date("2023-05-01"), value: 50},
    {date: new Date("2023-06-01"), value: 300},
    {date: new Date("2023-07-01"), value: 290},
    {date: new Date("2023-08-01"), value: 170},
    {date: new Date("2023-09-01"), value: 40},
    {date: new Date("2023-10-01"), value: 20},
    {date: new Date("2023-11-01"), value: 260},
    {date: new Date("2023-12-01"), value: 350}
];

console.log(dataset)

// define the x and y domains
// domain means what data is going to fit in the range
x.domain(d3.extent(dataset, d => d.date));
y.domain([0, d3.max(dataset, d => d.value)]);

// add the x-axis
svg.append("g")
.attr("transform",`translate(0,${height})`)
.call(d3.axisBottom(x)
    .ticks(d3.timeMonth.every(1))
    .tickFormat(d3.timeFormat("%b %Y")));

// add the y-axis
svg.append("g")
.call(d3.axisLeft(y));

// create the line generator
const line = d3.line()
.x(d => x(d.date))
.y(d => y(d.value))

// add the line path to the SVG element
svg.append("path")
.datum(dataset)
.attr("fill","none")
.attr("stroke","steelblue")
.attr("stroke-width",1)
.attr("d", line)