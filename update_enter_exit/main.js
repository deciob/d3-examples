var margin = {top: 20, right: 20, bottom: 160, left: 40},
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([11, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    //.tickFormat(formatPercent);

var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/WUP2011-F11a-30_Largest_Cities.csv", accessor	, function(error, data) {
  //console.log(data)
  var top_ten = _.filter( data, function (obj) {
    return +obj.rank < 11;
  });
  var data_by_year = _.groupBy( data, function (obj) {
    return obj.year;
  });
  //console.log(data_by_year);

  //var data_1950 = data.slice(0,10);
  //var data_2011 = data.slice(10,20);
  //var current_data = data_1950;
  //data = data_1950;
  //x.domain(data.map(function(d) { return d.agglomeration; }));
  y.domain([0, d3.max(data, function(d) {return parseFloat(d.population); })]);
  //console.log(d3.max(data, function(d) {return parseFloat(d.population); }))

  var xAxisDom = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
      //.call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("populations (millions)");

  var current_year = 1950;
  document.getElementById("update").addEventListener("click", function(e) {
    current_year += 5;
    draw(data_by_year[current_year]);
  });
  draw(data_by_year[current_year]);

  function agglomeration(d) {
    return d.agglomeration;
  }

  function transEnd(d) {
    //console.log(current_year, +d.rank)
    if (+d.rank === 30 && current_year > 1950) {
      document.getElementById('year-label').innerHTML = current_year;
      current_year += 5;
      //console.log(current_year, +d.rank)
      if (data_by_year[current_year]) {
        setTimeout(function(){draw(data_by_year[current_year]);},500);
      }
    }
  }

  function listener(e, i) {
    d3.select(this).attr("class", "bar active");
  }

  function draw(data) {
    x.domain(data.map(function(d) { return d.agglomeration; }));
    xAxisDom.transition().duration(600).call(xAxis).selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");
    var bars = svg.selectAll(".bar")
      .data(data, agglomeration);
    //bars.on("click", listener);
    bars.enter().append("rect")
      .attr("class", function(d) {
        var active = d.agglomeration == "New York" ? "active" : "";
        return "bar " + active; })
      .attr("x", function(d) { return x(d.agglomeration); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return height; })
      .attr("height", function(d) { return 0; })
      .on("click", listener);
    bars.transition()
      .duration(600)
      .attr("x", function(d, i) { return x(d.agglomeration); })
      .attr("y", function(d) { return y(d.population); })
      .attr("height", function(d) { 
        return height - y(d.population); })
      .each("end", transEnd);
    bars.exit().remove();
  }
  

});

function accessor(d) {
  // csv headers:
  // year,rank,country,agglomeration,population
  return {
    year: +d.year, //new Date(+d.year, 0, 1), // convert "Year" column to Date
    rank: d.rank,
    country: d.country,
    agglomeration: d.agglomeration,
    population: d.population
  };
}