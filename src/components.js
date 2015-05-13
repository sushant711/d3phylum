d3phylum.components.axis = function() {
  var _c = {};

  var visualFunc = function(selection) {
    var axis = d3.svg.axis().orient(_c.orient).scale(_c.scale);
    selection.call(axis);
    var scale_extent = _c.scale.range();
    var scale_range = Math.abs(scale_extent[0] - scale_extent[1]);
    switch (_c.orient) {
      case 'top':
        selection.append('text')
          .attr('class', 'd3p-label')
          .attr('x', scale_range)
          .attr('y', 13)
          .attr('text-anchor', 'end')
          .text(_c.label)
        break;
      case 'right':
        selection.append('text')
          .attr('class', 'd3p-label')
          .attr('y', -7)
          .attr('transform', 'rotate(-90)')
          .attr('text-anchor', 'end')
          .text(_c.label)
        break;
      case 'bottom':
        selection.append('text')
          .attr('class', 'd3p-label')
          .attr('x', scale_range)
          .attr('y', -7)
          .attr('text-anchor', 'end')
          .text(_c.label)
        break;
      case 'left':
        selection.append('text')
          .attr('class', 'd3p-label')
          .attr('y', 14)
          .attr('transform', 'rotate(-90)')
          .attr('text-anchor', 'end')
          .text(_c.label)
        break;
    }
  };

  visualFunc.orient = function(value) {
    if (!arguments.length) return _c.orient;
    _c.orient = value;
    return visualFunc;
  };

  visualFunc.scale = function(value) {
    if (!arguments.length) return _c.scale;
    _c.scale = value;
    return visualFunc;
  };

  visualFunc.label = function(value) {
    if (!arguments.length) return _c.label;
    _c.label = value;
    return visualFunc;
  }

  return visualFunc;
};

d3phylum.components.legendGuide = function() {
  var _c = {
    keys: [],
    fill_opacity: 0.4
  };

  var visualFunc = function(selection) {
    var legend = selection.selectAll('div.d3p-legend')
        .data(_c.keys)
      .enter().append('div')
        .attr('class', 'd3p-legend')

    legend.append('div')
      .attr('class', 'd3p-legend-color-code')
      .style('background-color', function(key) {
        var rgb = d3phylum.utils.hexToRgb(_c.color_scale(key));
        return 'rgba(' + [
          rgb.r, rgb.g, rgb.b,
          _c.fill_opacity
        ].join(',') + ')'
      })
      .style('border', function(key) {
        return '1px solid ' + _c.color_scale(key);
      })
      .on('click', function(d) {
        var target_selection = d3.select(this.closest('.d3p-legend'));
        _c.on_click_callback(d, target_selection);
      });

    legend.append('span')
      .attr('class', 'd3p-legend-text')
      .text(function(key) { return key; });
  };

  visualFunc.colorScale = function(scale) {
    if (!arguments.length) return _c.color_scale;
    _c.color_scale = scale;
    return visualFunc;
  };

  visualFunc.keys = function(keys) {
    if (!arguments.length) return _c.keys;
    _c.keys = keys;
    return visualFunc;
  };

  visualFunc.fillOpacity = function(opacity) {
    if (!arguments.length) return _c.fill_opacity;
    _c.fill_opacity = opacity;
    return visualFunc;
  };

  visualFunc.onClick = function(callback) {
    if (!arguments.length) return _c.on_click_callback;
    _c.on_click_callback = callback;
    return visualFunc;
  };

  return visualFunc;
};