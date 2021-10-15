import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('https://cdn.glitch.com/ee969b39-5890-4207-8b9e-31577b0b6838%2Funemployment.csv?v=1603583788416', d=>{
    return{
        ...d,
        date: new Date(d.date),
        "Wholesale and Retail Trade":+d["Wholesale and Retail Trade"],
        Manufacturing: +d.Manufacturing,
        "Leisure and hospitality": +d["Leisure and hospitality"],
        "Business services":+d["Business services"],
        Construction: +d.Construction,
        "Education and Health": +d["Education and Health"],
        Government:+d.Government,
        Finance:+ d.Finance,
        "Self-employed":+d["Self-employed"],
        Other: +d.Other,
        "Transportation and Utilities":+d["Transportation and Utilities"],
        Information:+ d.Information,
        Agriculture: +d.Agriculture,
        "Mining and Extraction":+d["Mining and Extraction"],
        total: +(
            +d["Wholesale and Retail Trade"]
            + +d.Manufacturing
            + +d["Leisure and hospitality"]
            + +d["Business services"]
            + +d.Construction
            + +d["Education and Health"]
            + +d.Government
            + +d.Finance
            + +d["Self-employed"]
            + +d.Other
            + +d["Transportation and Utilities"]
            + +d.Information
            + +d.Agriculture
            + +d["Mining and Extraction"]
        )
    }
} )
.then(data=>{
      data=data;
    console.log("data",data);
   const c = StackedAreaChart("body");
   c.update(data);
   const o = AreaChart("body");
   o.update(data);
   o.on("brushed", (range)=>{
    c.filterByDate(range); 
  })
})





