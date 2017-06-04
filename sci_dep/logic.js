
var board = document.getElementById('board');
var rawList, sciList, tree, sciNameList;
var technologies_png_path = 'stellaris_asset/technologies_png/';

function isArray(obj) { 
  return Object.prototype.toString.call(obj) === '[object Array]';   
}


function reductionAt(sciList, subs){
  if(!isArray(sciList)){
    if(sciList.length > 0 && sciList[0] === '@'){
      return subs[sciList];
    }
    return sciList;
  }
  subs = subs || {};
  return sciList.filter(function(term){
    if( isArray(term) && term[0] === '=' && term[1] && term[1][0] === '@'){
      subs[term[1]] = term[2];
      return false;
    }
    return true;
  }).map(function(term){
    return reductionAt(term, subs);
  });
}

function render(nameList, height, width, rown){
  d3.select('#board').selectAll('img').data(nameList).enter()
    .append('img')
    .attr('src',function(name){
      return technologies_png_path + name + '.png';
    })
    .attr('style',function(name, i){
      return 'position:absolute;transform:translate(' + (i % rown) * width + 'px,' + Math.floor(i/rown) * height + 'px)'
    });
}

function toGraph(sciList){
  var nodes = [], edges = [];
  
  var nameIdMap = {};
  sciList.forEach(function(term, i){
    nameIdMap[term[1]] = i;
  });
  
  sciList.forEach(function(term){
    var key = term[1], value = term[2];
    nodes.push({name : key, 
				image : technologies_png_path + key + '.png'});
    var subTree = new parser.AST(value);
    var prerequisites = subTree.find('prerequisites').value();
    if(isArray(prerequisites)){
      prerequisites.forEach(function(name){
        var edge = {source : nameIdMap[key], target : nameIdMap[name]};
        edges.push(edge);
      });
    }
  });
  return {nodes : nodes, edges : edges}
}

function render2(graph, localisation, width, height, linkDistance, charge, img_w, img_h){
  var svg = d3.select('svg').attr('width',width).attr('height',height);
  
  svg.append('defs').html('<linearGradient id="orange_red" x1="0%" y1="0%" x2="0%" y2="100%">' +
	'<stop offset="0%" style="stop-color:rgb(18,29,26);' +
	'stop-opacity:1"/>' +
	'<stop offset="100%" style="stop-color:rgb(48,67,61);' +
	'stop-opacity:1"/>' +
	'</linearGradient>')
  
  svg.append("rect")
    .attr('width',width).attr('height',height)
	.attr('fill','url(#orange_red)');
  
  var force = d3.layout.force()
                .nodes(graph.nodes)
                .links(graph.edges)
                .size([width, height])
                .linkDistance(linkDistance)
                .charge(charge)
                .start();

  var edges_line = svg.selectAll("line")
                        .data(graph.edges)
                        .enter()
                        .append("line")
                        .style("stroke","#aaa")
                        .style("stroke-width",2);
						
  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
	.style("width", "400px")
	.style("color","rgb(255,255,255)")
	.style("font-family",'"Consolas", "Bitstream Vera Sans Mono", "Courier New"')
    .text("a simple tooltip");

  /*
  var nodes_img = svg.selectAll("image")
                        .data(graph.nodes)
                        .enter()
                        .append("image")
                        .attr("width",img_w)
                        .attr("height",img_h)
                        .attr("xlink:href",function(d){
                            return d.image;
                        })
                        .call(force.drag);
	*/
  var nodes_img = svg.selectAll("image")
                        .data(graph.nodes)
                        .enter()
                        .append("image")
                        .attr("width",img_w)
                        .attr("height",img_h)
                        .attr("xlink:href",function(d){
                            return d.image;
                        })
						.on("mouseover", function(e){
							// data attribute will merged in event object
							//console.log(e.name);
							//console.log(localisation[e.name]);
							//console.log(localisation[e.name+'_desc']);
							var desc = localisation[e.name][1] + '\\n' + localisation[e.name+'_desc'][1]
							//console.log(desc);
							desc = desc.replace(/\\n/g,'<br>');
							//console.log(desc);
							tooltip.html(desc);
							//console.log(tooltip);
							return tooltip.style("visibility", "visible");
						})
						.on("mousemove", function(){
							return tooltip.style("top",
							(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+25)+"px");
						})
						.on("mouseout", function(){
							return tooltip.style("visibility", "hidden");
						})
                        .call(force.drag);

                        

  force.on("tick", function(){
        
        graph.nodes.forEach(function(d, i){
            d.x = d.x - img_w/2 < 0      ? img_w/2          : d.x ;
            d.x = d.x + img_w/2 > width  ? width - img_w/2  : d.x ;
            d.y = d.y - img_h/2 < 0      ? img_h/2          : d.y ;
            d.y = d.y + img_h/2 > height ? height - img_h/2 : d.y ;
        });
    
         edges_line.attr("x1", function(d){ return d.source.x; });
         edges_line.attr("y1", function(d){ return d.source.y; });
         edges_line.attr("x2", function(d){ return d.target.x; });
         edges_line.attr("y2", function(d){ return d.target.y; });
         
         nodes_img.attr("x", function(d){ return d.x - img_w/2; });
         nodes_img.attr("y", function(d){ return d.y - img_h/2; });
  });

                        
}

function loadData(allData){
  var data = allData['technology'];
  rawList = Array.prototype.concat.apply([], Object.keys(data).map(function(key){
    return data[key];
  }));
  sciList = reductionAt(rawList)
  tree = new parser.AST(sciList);
  sciNameList = sciList.map(function(term){
    return term[1];
  });
  //render(sciNameList, 52, 52, 10);
  render2(toGraph(sciList),allData['localisation'] , 3000, 3000, 50, -800, 52, 52);
  console.log('load end');
}