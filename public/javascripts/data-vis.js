var width = 960;
var height = 500;

var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])
				   .scale([1000]);


var path = d3.geo.path()
		  	 .projection(projection);

var color = d3.scale.linear()
			  .range(["rgb(192,214,228)", "rgb(202,234,231)","rgb(131,208,201)","rgb(101,195,186)", "rgb(53,167,156)", "rgb(42,133,124)", "rgb(0,90,81)"]);

var legendText = ["Comprehensive Reform", "", "", "", "", "", "No Reform"];


var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
      .attr("margin", "auto")
      .attr("display", "block");


var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

d3.csv("backlog_data.csv", function(data) {
color.domain([0,1,2,3,4,5,6]);

d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	var dataState = data[i].state;

	var dataValue = data[i].total;

	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		json.features[j].properties.total = dataValue;

		break;
		}
	}
}

svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.total;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});

var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 200)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
          .attr("fill", "#63ace5")
      	  .text(function(d) { return d; });
	});

});
