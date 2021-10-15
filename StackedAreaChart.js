export default
function StackedAreaChart(container) {
	// initialization
    const margin = ({top: 10, right: 10, bottom: 20, left: 40});
  
    const width = 775-margin.left-margin.right, height = 400-margin.top - margin.bottom;
    
    const svg = d3.select(container)
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()  
     .range([0, width]);    
  
    const yScale = d3.scaleLinear()       
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .range(d3.schemeCategory10);
    
    const tooltip = svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("font-size", 13)
      .attr("x",10)
      .attr("y",0);

    svg.append("g")
      .attr("class", "y-axis");

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

  let selected = null, xDomain, data;
   
	function update(_data){
        data=_data;
        
        const k= selected? [selected] :data.columns.slice(1);
        const stack=d3.stack()
            .keys(k)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        
        const stackedData=stack(data);
        console.log("stacked",stackedData);
        
        color.domain(k);
        yScale.domain([0,d3.max(stackedData,d=> d3.max(d,d=>d[1]))]);
        //xScale.domain(d3.extent(data, d=>d.date));
        xScale.domain(xDomain? xDomain: d3.extent( data,d=>d.date));
        
        svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width)
          .attr("height", height);
          
        const area=d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));
        
        const areas = svg.selectAll(".area")
            .data(stackedData, d => d.key);
            
        areas.enter() 
            .append("path")
            .attr("class","area")
            .merge(areas)
            .attr("d", area)
            .attr("fill",d=>{
                return color(d.key);
            })
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
              // toggle selected based on d.key
              if (selected === d.key) {
                selected = null;
              } else {
                selected = d.key;
              }
              update(data); // simply update the chart again
          }) ;
    
        areas.exit().remove();
        
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);
        
        svg.select(".x-axis")
        .call(xAxis);
    
        svg.select(".y-axis")
        .call(yAxis);     
  }

  function filterByDate(range){
		xDomain = range;  
		update(data); 
  }
	return {
    update,
    filterByDate
	}
}

