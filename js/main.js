var height, line, margin, parseDate, ready, svg, width, x, xAxis, y, yAxis;

margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};

width = 960 - margin.left - margin.right;

height = 500 - margin.top - margin.bottom;

parseDate = d3.time.format("%d-%b-%y").parse;

x = d3.time.scale().range([0, width]);

y = d3.scale.linear().range([height, 0]);

xAxis = d3.svg.axis().scale(x).orient("bottom");

yAxis = d3.svg.axis().scale(y).orient("left");

line = d3.svg.line().x(function(d) {
  return x(d.date);
}).y(function(d) {
  return y(d.close);
});

svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

ready = function(error, data, ticks) {
  var graph;
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    return d.close = +d.close;
  });
  ticks.forEach(function(d) {
    d.date = parseDate(d.date);
    return d.close = +d.close;
  });
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  y.domain(d3.extent(data, function(d) {
    return d.close;
  }));
  xAxis = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  yAxis = svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");
  graph = svg.append("path").datum(data).attr("class", "line").attr("d", line);
  return ticks = svg.append("g").selectAll("line").data(ticks).enter().append("line").attr("class", "tick").attr("x1", function(d) {
    return x(d.date);
  }).attr("y1", function(d) {
    return y(d.close) - 10;
  }).attr("x2", function(d) {
    return x(d.date);
  }).attr("y2", function(d) {
    return y(d.close) + 10;
  });
};

queue().defer(d3.tsv, "../data/data.tsv").defer(d3.tsv, "../data/ticks.tsv").await(ready);
