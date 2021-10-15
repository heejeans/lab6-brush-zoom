export default
function AreaChart(container){

    const margin = ({top: 10, right: 10, bottom: 20, left: 40});
  
    const width = 775-margin.left-margin.right, height = 150-margin.top - margin.bottom;
    
    const svg = d3.select(container)
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

    const listeners = { brushed: null };

    function brushed(event) {
        if (event.selection) {
          console.log("brushed", event.selection);
          console.log(event.selection.map(xScale.invert)); // or map(d=> xScale.invert(d)))
     
          listeners["brushed"](event.selection.map(xScale.invert));
        }
    };

    const brush = d3.brushX()
    .extent([[0, 0.5], [width , height ]])
    .on("brush", brushed);

    svg.append("g").attr('class', 'brush').call(brush);
  
    const xScale = d3.scaleTime()  
     .range([0, width]);    
  
    const yScale = d3.scaleLinear()       
      .range([height, 0]);

    svg.append("g")
      .attr("class", "y-axis");

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

	function update(data){ 

        xScale.domain([d3.min(data,d =>{return d.date;}),d3.max(data,d=>{return d.date;}) ]);
        yScale.domain([0,d3.max(data,d=>{return d.total})]);

        const area= d3.area()
        .defined(d=>{return d.total >=0;})
        .x(d=>{return xScale(d.date);})
        .y0(d=>{return yScale.range()[0];})
        .y1(d=>{return yScale(d.total);});

        svg.append("path")
        .datum(data)
        .attr("class","area")
        .attr("fill","steelblue")
        .attr("d",area);
        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        
        svg.select(".x-axis")
        .call(xAxis);
        svg.select(".y-axis")
        .call(yAxis);

  }
  
  function on(event, listener) {
    listeners[event] = listener;
  }
	return {
    update, // ES6 shorthand for "update": update
    on
	};
}



