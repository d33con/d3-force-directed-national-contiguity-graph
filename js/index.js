d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function (error, data) {

  if (error) throw 'error';

  // calculate height and width according to window size
  var w = parseInt(d3.select('#graph').style('width'));
  var h = w * 0.4;

  // set up force layout
  var force = d3.layout.force()
      .nodes(data.nodes)
      .links(data.links)
      .size([w, h])
      .linkDistance(50)
      .charge(-100)
      .start();

  // append svg to graph div
  var svg = d3.select('#graph')
      .append('svg')
        .attr('width', w)
        .attr('height', h);

  // create link lines
  var link = svg.selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link');

  // tooltip
  var tooltip = d3.select('#graph').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

  // create nodes and add to flags div
  var nodes = d3.select('#flags').selectAll('img')
      .data(data.nodes)
      .enter().append('img')
      .attr('class', function (d) { return 'flag flag-' + d.code; })
      .call(force.drag)
      .on('mouseover', function (d) {
          tooltip.transition()
              .duration(300)
              .style('opacity', 0.95);
          tooltip.html('<div>' + d.country + '</div>')
              .style('left', (d3.event.pageX + 5) + 'px')
              .style('top', (d3.event.pageY - 25) + 'px');
        })
        .on('mouseout', function () {
          tooltip.transition()
             .duration(300)
             .style('opacity', 0);
        });

  // update svg attributes
  force.on('tick', function () {

    link.attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });

    nodes.style('left', function (d) { return d.x + 'px'; })
          .style('top', function (d) { return d.y + 'px'; });

  });

});
