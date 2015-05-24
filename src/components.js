d3phylum.components.axis = function() {
  var _c = {
    ticks: 10
  };

  var visualFunc = function(selection) {
    var ticks_10 = _c.scale.ticks(10);

    var axis = d3.svg.axis()
      .orient(_c.orient)
      .scale(_c.scale)
      .ticks(_c.ticks)
      .tickFormat(
        function(d) {
          return ticks_10.indexOf(d) !== -1 ? d: '';
        }
      );
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
  };

  visualFunc.ticks = function(value) {
    if (!arguments.length) return _c.scale.ticks(_c.ticks);
    _c.ticks = value;
    return visualFunc;
  };

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

d3phylum.components.tooltip = function() {
  var _config = {};
  var _visuals = {};

  var tooltip = d3.select('div.d3p-tooltip');
  tooltip.remove();
  var tooltip = d3.select('body').append('div')
    .attr('class', 'd3p-tooltip')
    .style('opacity', 0);
  d3phylum._visuals.tooltip = tooltip;

  var visualFunc = function(selection) {
    selection.on('mouseover', function(d) {
      d3phylum._visuals.tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      d3phylum._visuals.tooltip.html(
        _config.html_content_func(d)
      )
      .style('left', (d3.event.pageX + 14) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function(d) {
      d3phylum._visuals.tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });
  };

  visualFunc.htmlContent = function(html_content_func) {
    _config.html_content_func = html_content_func;
    return visualFunc;
  }

  return visualFunc;
};