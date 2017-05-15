const m = 16;
const maxNodes = 4^m;
const distance = 50;

const nodes = d3.range(maxNodes).map( (i) => ({
	index: i
}));

// const links = d3.range(nodes.length - 1).map( (i) => {
// 	return {
// 	  source: Math.floor( Math.sqrt(i)),
// 	  target: i + 1
// 	}
// });

let links = [];

for (let i=0; i<nodes.length; i++) {

	if(nodes[i+1] ){
		links.push({
			source: i,
			target: i+1
		});
	}

	if ( i%2==0 && nodes[i-3] ){
		links.push({
			source: i,
			target: i-3
		});
	}

	if (i == nodes.length-1){
		links.push({
			source: i,
			target: 0
		});
	}
	

	if (i == nodes.length-1){
		links.push({
			source: i,
			target: 2
		});
	}

	if (i == nodes.length-3){
		links.push({
			source: i,
			target: 0
		});
	}


}




var simulation = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody().strength(-100) )
		.force("link", d3.forceLink(links).distance(distance).strength(1))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.alphaTarget(0.8)
		.on("tick", ticked);

var canvas = document.querySelector("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height;

d3.select(canvas)
		.call(d3.drag()
				.container(canvas)
				.subject(dragsubject)
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

function ticked() {
	context.fillStyle = "rgba(0, 0, 0, 0.1)";
	context.fillRect(0, 0, width, height);
	context.save();
	context.translate(width / 2, height / 2);

	context.beginPath();
	links.forEach(drawLink);
	context.strokeStyle = "#aaa";
	context.stroke();

	context.beginPath();
	nodes.forEach(drawNode);
	context.fill();
	context.strokeStyle = "#fff";
	context.stroke();

	context.restore();
}

function drawLink(d) {
	context.moveTo(d.source.x, d.source.y);
	context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
	context.moveTo(d.x + 7, d.y);
	context.font = "15px";
	context.fillStyle  = "#fff";
	context.fillText(d.index, d.x-10, d.y-10);
	context.fillStyle  = "#000";
	context.arc(d.x, d.y, 7, 0, 2 * Math.PI);
}

function dragsubject() {
	return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
}

function dragstarted() {
	if (!d3.event.active) simulation.alphaTarget(0.8).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
	d3.event.subject.fx = d3.event.x;
	d3.event.subject.fy = d3.event.y;
}

function dragended() {
	if (!d3.event.active) simulation.alphaTarget(0.8);
	d3.event.subject.fx = null;
	d3.event.subject.fy = null;
}
