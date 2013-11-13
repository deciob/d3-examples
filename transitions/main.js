var datum = {
  x: 10,
  y: 10,
  width: 100,
  height: 100
};


var svg = d3.select("#viz").datum(datum).append("svg")
    .attr("width", 600)
    .attr("height", 600)
  .append("g");
  var r = svg.append("rect")
    .attr("class", "bibble")
    .attr("x", function(d) { return d.x; })
    .attr("width", function(d) { return d.width; })
    .attr("y", function(d) { return d.y; })
    .attr("height", function(d) { return d.height; });
  r.transition()
    .duration(1000)
    .delay(500)
    .ease("bounce")
    .attr("x", function(d, i) { return d.x + 300; })
    .attr("y", function(d, i) { return d.y + 300; });
  r.transition()
    .duration(1000)
    .delay(2000)
    .attr("width", function(d, i) { return d.width * 5; })
    .attr("height", function(d, i) { return d.height * 5; })
    .style("fill", "steelblue");
    
