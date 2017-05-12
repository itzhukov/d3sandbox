const maxNodes = 1500;
const distance = 60;

const nodes = d3.range(maxNodes).map( (i) => ({
	index: i
}));

const links = d3.range(nodes.length - 1).map( (i) => {
	return {
	  source: Math.floor( Math.sqrt(i)),
	  target: i + 1
	}
});

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links).distance(distance).strength(0.7))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(0.5)
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
  context.fillStyle = "rgba(0, 0, 0, 0.3)";
  context.fillRect(0, 0, width, height);
  // context.clearRect(0, 0, width, height);
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
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}

function dragsubject() {
  return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0.5);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}
