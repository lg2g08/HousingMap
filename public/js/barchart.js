function drawBarChart(salesDistribution, err){
    if (err) throw err;
    var margin = {top: 50, right: 150, bottom: 50, left: 75},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var width = 600,
        height = 300;
            
    var minY = d3.min(salesDistribution);
    var maxY = d3.max(salesDistribution);   

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(salesDistribution, function(d) { return d; })]);
        
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

    var barWidth = width / salesDistribution.length;

    var bar = chart.selectAll("g")
       .data(salesDistribution)
      .enter().append("g")
       .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });  
      
      bar.append("rect")
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return height - y(d); })
          <!-- .style("fill", "url(#gradient)") -->
          .style("fill", "blue")
          .attr("width", barWidth - 15);

      // bar.append("text")
          // .attr("x", barWidth - 60)
          // .attr("y", function(d) { return y(d) - 20; })
          // .attr("dy", ".5em")
          // .style("fill", "blue")
          // .style("font-size", "11px") 
          // .style("font-family", "Lucida Console")
          // .text(function(d) { return d; }); 
          
    chart.append("text")
            .attr("x", width/2)             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("fill", "blue")
            .style("font-family", "Lucida Console")
            .style("font-size", "20px") 
            .text("Housing Prices 2014");
            
    var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(5);
              
    chart.append("text")
            .attr("transform", "translate(" + (width + 95) + ",0)")
            .attr("dy", "5em")
            .style("text-anchor", "middle")
            .style("font-size", "20px") 
            .text("Cost (£)");
              
     chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width + 50) + ",0)")
        .call(yAxis);
}