function findYearIndex(){
    var i = 0;
    while($("#yearList").val() != aYears[i]){
        i++;
    }
    return i
}

$(function () { //change year from list
    $("#yearList").change(function () {
        year = $("#yearList").val();
        polygonColors(year);
    });
});

function polygonColors(year){
    $('.loading').show();
    // if(oDeficiencyData.hasOwnProperty(year)) {
        // addPolygonColors(oDeficiencyData[year])
        // $('.loading').hide();
    // } 
    // else {
        $.ajax("/deficiency_data/" + year + "/").done(function (oDeficiencyDataYear) {
            oDeficiencyData[year] = {};
            oDeficiencyData[year] = oDeficiencyDataYear;
            addPolygonColors(oDeficiencyData[year])
            $('.loading').hide();
        });
    // };
}

function addPolygonColors(oDeficiencyData){
    map.data.setStyle(function(feature) {
        var id = feature.getProperty('TTWA07CD');
        if(typeof id === 'undefined'){
            var id = feature.getProperty('LSOA11CD');
        }; 
        if(typeof id != "string"){
            var id = feature.getProperty('TTWA07CD');
        };
        if(typeof id === 'undefined'){
            var id = feature.getProperty('LSOA11CD');
        };         
        if (!oDeficiencyData.hasOwnProperty(id)) {
            return {
                fillColor: selectKeyColor("NA"),
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        } else {
            var n = oDeficiencyData[id];
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }
    })
}

$(function() { //use pay Given
    $("#pay").keydown(function (event) {
        if (event.keyCode == 13) {
            var parameters = { search: $(this).val() };
           $.get("/deficiency_data/" + year + "/"+ $(this).val(), parameters, function(oDeficiencyDataYearVal) {
           addPolygonColors(oDeficiencyDataYearVal[year])}
        )}
    })
})

function drawSalesChart(salesDistribution, err){
    if (err) throw err;
    var margin = {top: 50, right: 150, bottom: 50, left: 75},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
        
    // A formatter for counts.
    var formatCount = d3.format("d");
    
    var minY = d3.min(salesDistribution);
    var maxY = d3.max(salesDistribution);  

    var x = d3.scale.linear()
        .domain([0, maxY])
        .range([0, width]);
        
    var data = d3.layout.histogram()
        .bins(10)
        (salesDistribution);
        
    var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d.y; })])
              .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format("s"))
        .orient("bottom");
        
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
    
    d3.select("#featureInfoContainer").remove()
        
    var svg = d3.select("#featureInfoCanvas")
        .append("div")
        .classed("svg-container", true)
        .attr("id", "featureInfoContainer")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")   
        .classed("svg-content-responsive", true)
        .attr("viewBox", "0 0 1200 1600")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    svg.call(tip)
          
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
        // something here
        .on('mouseover', function(d) {tip.show("£ " + d, featureInfoContainer)})
	    .on('mouseout', function(d) {tip.hide("£ " + d, featureInfoContainer)});

    bar.append("rect")
        .attr("x", 3)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });

    bar.append("text")
        .attr("dy", "-.95em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 60)
    .style("font-size", "30px")
    .text("House Price");
    
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("x", -5)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size", "30px")
    .text("Frequency");
}    


function drawScatterPlot(data, err) {
    if (err) throw err;
    
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
  
    var x = d3.scale.linear()
              .domain([0, (5000 + d3.max(d3.entries(data), function(d) { return d.value[1] }))])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
    	      .domain([0, (5000 + d3.max(d3.entries(data), function(d) { return d.value[0] }))])
    	      .range([ height, 0 ]);
              
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.key; });
    
    d3.select("#featureInfoContainer").remove()
    
    var svg = d3.select('#featureInfoCanvas')
                  .append("div")
                  .classed("svg-container", true)
                  .attr("id", "featureInfoContainer")
                  .append("svg")
                  .attr("preserveAspectRatio", "xMinYMin meet")   
                  .classed("svg-content-responsive", true)
                  .attr("viewBox", "0 0 1200 1600")
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");            

    svg.call(tip)
    
    var scatter = svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'scatter')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient('bottom');

    scatter.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'scatter axis date')
        .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('left');

    scatter.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'scatter axis')
        .call(yAxis);

    var g = scatter.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(d3.entries(data))
      .enter().append("svg:circle")
          .attr("cx", function (d) { return x(d.value[1]); } )
          .attr("cy", function (d) { return y(d.value[0]); } )
          .attr("r", 10)
          .attr("fill", "steelblue")
          .on('mouseover', function(d) {tip.show(d, featureInfoContainer)})
          .on('mouseout', function(d) {tip.hide(d, featureInfoContainer)});
          
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width + 6)
    .attr("y", height + 60)
    .style("font-size", "40px")
    .text("Median Income for Area");
    
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -40)
    .attr("x", -100)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size", "40px")
    .text("Median Price of Housing");
}

function loadFeatureInfoBox(oSalesId) {
    drawSalesChart(oSalesId);
    $(".featureInfo").modal("show");
}

function loadScatterPlot(oScatterData) {
    drawScatterPlot(oScatterData);
    $(".featureInfo").modal("show");
}

function loadMapColours(idTTW){
    loadGeoData(topojson.feature(oLSOAarea[idTTW], oLSOAarea[idTTW]['objects'][idTTW]));
    addPolygonColors(oDeficiencyData[year]);
    }

function featureClick(event){
    
    if (event.feature.getProperty('TTWA07CD') != undefined) {
        var id = event.feature.getProperty('TTWA07CD');
        var name = event.feature.getProperty('TTWA07NM');
        var idTTW = oLookUps[event.feature.getProperty('TTWA07CD')];
        thisTTW = idTTW;
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
        $.ajax("/LSOA_Sales_map/" + idTTW ).done(function (oDeficiencyDataYear) {
            oDeficiencyData[year] = oDeficiencyDataYear;
            addPolygonColors(oDeficiencyData[year]);
        });
        loadMapColours(idTTW);
    } else { 
        var id = event.feature.getProperty('LSOA11CD');
        var name = event.feature.getProperty('LSOA11NM');
        $("#featureTitle").html(" Housing Sales Price Distribution " + name)
        $(".modal-header").attr("id", id)
        idTTW = thisTTW;
        $.ajax("/sales_data/" + year + "/" + idTTW + "/" + id ).done(function (oSalesYearTTWID) {
        loadFeatureInfoBox(oSalesYearTTWID);
        })
    }
}



$(function() { // BACK BUTTON
    $("#goBACK").click(function(){
        $.ajax("/reset" ).done(function () {
            var mapFlag = 0;
        });
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
        oDeficiencyData[year] = {};
        loadGeoData(topojson.feature(oTTWarea, oTTWarea.objects.TTW));
        $.ajax("/map_reset/" ).done(function (data) {
            oDeficiencyData[year] = data
            addPolygonColors(oDeficiencyData[year]);
        });
    })
})

$(function() { // TTW BUTTON
    $("#useTTWPay").click(function(){
        $.ajax("/TTW_pay/" + year ).done(function (oDeficiencyDataYear) {
            oDeficiencyData[year] = oDeficiencyDataYear;
            addPolygonColors(oDeficiencyData[year]);
        });
    })
})

$(function() { // SCATTER PLOT BUTTON
    $("#SCATTERPLOT").click(function(){
        $.ajax("/SCATTER_PLOT/").done(function (oScatterData) {
            $("#featureTitle").html(" Scatter Plot ")
            loadScatterPlot(oScatterData);
        });
    })
})