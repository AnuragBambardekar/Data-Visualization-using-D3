// Set up the dimensions of the chart
const margin = { top: 70, right: 40, bottom: 60, left: 70 }
const width = 2000 - margin.left - margin.right
const height = 1000 - margin.top - margin.bottom

// Create the SVG container for the chart
const svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load and process the data
d3.csv("NA_Emissions.csv").then(data => {
  data.forEach(d => {
    d.emissions = +d.emissions;
  });

  // console.log(data)

  // Sort the data by emissions
  // data.sort(function (a, b) {
  //   return d3.ascending(a.emissions, b.emissions);
  // });
  
  // Filter data to get every 4th date
  // const filteredData = data.filter((d, i) => i % 4 === 0);
  // console.log(filteredData)

  let barHover = (e) => {
    let hbar = d3.select(e.srcElement)
    hbar.attr("fill",'#AEC09A')
  }
  
  // Set the x and y scales
  const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, function (d) { return d.emissions; })+1000]);

  // Create the y scale with filtered data
  const y = d3.scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(data.map(function (d) { return d.date; }));

  // Create the x and y axes
  const xAxis = d3.axisBottom(x)
    .ticks(8)
    .tickSize(0);

  const yAxis = d3.axisLeft(y)
  .tickSize(0)
  .tickPadding(10);

  // Create the bars for the chart
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", function (d) { return y(d.date); })
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", function (d) { return x(d.emissions); })
    .attr('fill', '#96a5b9')
    .on("mouseover", barHover)
    .on("mouseout", (e) => {
        d3.select(e.srcElement).transition().attr("fill", '#96a5b9')
    })

  // Add vertical gridlines
  svg.selectAll("line.vertical-grid")
  .data(x.ticks(8))
  .enter()
  .append("line")
  .attr("class", "vertical-grid")
  .attr("x1", function (d) { return x(d); })
  .attr("y1", 0)
  .attr("x2", function (d) { return x(d); })
  .attr("y2", height)
  .style("stroke", "gray")
  .style("stroke-width", 0.5)
  .style("stroke-dasharray", "3 3");

  // Add the x and y axes to the chart
  svg.append("g")
    .attr("class", "x axis")
    .style("font-size", "10px")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .call(g => g.select(".domain").remove())

  svg.append("g")
    .attr("class", "y axis")
    .style("font-size", "10px")
    .call((yAxis))
    .selectAll('path')
    .style('stroke-width', '1.75px');

  // Add labels to the end of each bar
  svg.selectAll(".label")
  .data(data)
  .enter().append("text")
  .attr("x", function (d) { return x(d.emissions) + 5; })
  .attr("y", function (d) { return y(d.date) + y.bandwidth() / 2; })
  .attr("dy", ".35em")
  .style("font-family", "sans-serif")
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .style('fill', '#3c3d28')
  .text(function (d) { return d.emissions; });

  // Add emissions label
  svg.append("text")
  .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")")
  .style("text-anchor", "middle")
  .style("font-size", "18px")
  .style("fill", "black")
  .style("font-family", "sans-serif")
  .attr("dy", "1em")
  .text("Emissions");

  // Add the chart title
  svg.append("text")
    .attr("x", margin.left - 100)
    .attr("y", margin.top - 110)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .text("Emissions per year");

  // Add the chart data source
  svg.append("text")
    .attr("transform", "translate(" + (margin.left - 100) + "," + (height + margin.bottom - 10) + ")")
    .style("text-anchor", "start")
    .style("font-size", "18px")
    .style("fill", "lightgray")
    .style("font-family", "sans-serif")
    .text("Source: Unknown")


});