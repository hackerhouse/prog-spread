(function (d3) {

    'use strict';

    var featureList = [
        'code',
        'influence',
        'career',
        'education',
        'research'
    ];

    var features = function (d) {
        return featureList[d];
    };


    var width = 960,
    height = 500,
    outerRadius = height / 2 - 10,
    innerRadius = 120;

    var angle = d3.time.scale()
    .range([0, 2 * Math.PI]);

    var radius = d3.scale.linear()
    .range([innerRadius, outerRadius]);

    var z = d3.scale.category20c();

    var stack = d3.layout.stack()
    .offset('zero')
    .values(function (d) {
        return d.values;
    })
    .x(function (d) { return d.time; })
    .y(function (d) { return d.value; });

    var nest = d3.nest()
    .key(function (d) { return d.key; });

    var line = d3.svg.line.radial()
    .interpolate('cardinal-closed')
    .angle(function (d) { return angle(d.time); })
    .radius(function (d) { return radius(d.y0 + d.y); });

    var area = d3.svg.area.radial()
    .interpolate('cardinal-closed')
    .angle(function (d) { return angle(d.time); })
    .innerRadius(function (d) { return radius(d.y0); })
    .outerRadius(function (d) { return radius(d.y0 + d.y); });

    var svg = d3.select('#radial').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    d3.csv('data.csv', function (data) {
        data.forEach(function (d) {
            d.time = +d.time;
            d.value = +d.value;
        });

        var layers = stack(nest.entries(data));

        // Extend the domain slightly to match the range of [0, 2π].
        angle.domain([0, d3.max(data, function (d) { return d.time + 1; })]);
        radius.domain([0, d3.max(data, function (d) { return d.y0 + d.y; })]);

        svg.selectAll('.layer')
        .data(layers)
        .enter().append('path')
        .attr('class', 'layer')
        .attr('d', function (d) { return area(d.values); })
        .style('fill', function (d, i) { return z(i); })
        .style('opacity', '0.5');

        svg.selectAll('.axis')
        .data(d3.range(angle.domain()[1]))
        .enter().append('g')
        .attr('class', 'axis')
        .attr('transform', function (d) { return 'rotate(' + angle(d) * 180 / Math.PI + ')'; })
        .call(d3.svg.axis()
              .scale(radius.copy().range([-innerRadius, -outerRadius]))
              .orient('left'))
              .append('text')
              .attr('y', -innerRadius + 6)
              .attr('dy', '.71em')
              .attr('text-anchor', 'middle')
              .text(function (d) { return features(d); });
    });

})(d3);
