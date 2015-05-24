d3phylum.visuals.scatterBubblePlot = function() {
  var _visuals = {};
  var _c = {
    margin: {
      top: 20,
      right:20,
      bottom: 20,
      left: 40
    },
    cushion: {
      x: 0.1,
      y: 0.1
    },
    axis_labels: {
      x: 'x',
      y: 'y'
    },
    bubble_opacity: {
      fill: 0.4
    },
    legend_disable_opacity: 0.3,
    masked_groups: []
  };
  _c.width = 720 - _c.margin.right - _c.margin.left;
  _c.height = 480 - _c.margin.top - _c.margin.bottom;

  var _baseSetup = function() {
    _c.x_scale = d3.scale.linear().range([0, _c.width]);
    _c.y_scale = d3.scale.linear().range([_c.height, 0]);
    _c.group_color_scale = d3.scale.category10();
  };

  var _baseRender = function() {
    _visuals.parent_selection.selectAll('*').remove();
    _visuals.svg_plot = _visuals.parent_selection.append('svg')
      .attr('class', 'd3p-plot')
      .attr('width', _c.width + _c.margin.left + _c.margin.right)
      .attr('height', _c.height + _c.margin.top + _c.margin.bottom);
    _visuals.tooltip = d3.select('body').append('div')
      .attr('class', 'd3p-tooltip')
      .style('opacity', 0);
    _visuals.control_widgets = _visuals.parent_selection.append('div')
      .attr('class', 'd3p-control-widgets')
      .style({
        'margin-top': '17px',
        'margin-right': _c.margin.right + 'px',
        'margin-bottom': '17px',
        'margin-left': _c.margin.left + 'px',
        display: 'inline-block',
        width: _c.width + 'px'
      });
  };

  var _updateBubbles = function(updated_bubbles) {
    _c.bubbles = updated_bubbles;
    var x_extent = d3.extent(_c.bubbles, function(b) { return b.x });
    var y_extent = d3.extent(_c.bubbles, function(b) { return b.y });

    _c.x_scale.domain(
      d3phylum.utils.getCushionedDomainForExtent(
        x_extent, _c.cushion.x
      )
    );
    _c.y_scale.domain(
      d3phylum.utils.getCushionedDomainForExtent(
        y_extent, _c.cushion.y
      )
    );
  };

  var _isMaskedGroup = function(group) {
    return _c.masked_groups.indexOf(group) !== -1
  };

  var _setUnmaskedBubbles = function() {
    var unmasked_bubbles = _c.source_bubbles.filter(
      function(b) {
        return !_isMaskedGroup(b.group);
      }
    );
    _updateBubbles(unmasked_bubbles);
  };

  var _addToMaskedGroups = function(group) {
    if (_c.masked_groups.indexOf(group) === -1) {
      _c.masked_groups.push(group);
    }
    _setUnmaskedBubbles();
  };

  var _removeFromMaskedGroups = function(group) {
    var idx = _c.masked_groups.indexOf(group);
    if (idx !== -1) {
      _c.masked_groups.splice(idx, 1);
    }
    _setUnmaskedBubbles();
  };

  var _renderPlot = function() {
    /* Clear all children within svg plot */
    _visuals.svg_plot.selectAll('*').remove();

    /* Render axis */
    /* x axis */
    var x_axis = d3phylum.components.axis()
      .scale(_c.x_scale)
      .orient('bottom')
      .label(_c.axis_labels.x);

    _visuals.svg_plot.append('g').attr('class', 'd3p-x d3p-axis')
      .attr(
        'transform',
        d3phylum.utils.svgTranslate(
          _c.margin.left,
          _c.height + _c.margin.top
        )
      )
      .call(x_axis);

    /* y axis */
    var y_axis = d3phylum.components.axis()
      .scale(_c.y_scale)
      .orient('left')
      .label(_c.axis_labels.y);

    _visuals.svg_plot.append('g').attr('class', 'd3p-y d3p-axis')
        .attr(
          'transform',
          d3phylum.utils.svgTranslate(
            _c.margin.left,
            _c.margin.top
          )
        )
        .call(y_axis);

    /* Render bubbles */
    var bubbles_field = _visuals.svg_plot.append('g')
      .attr('transform', d3phylum.utils.svgTranslate(
            _c.margin.left, _c.margin.top))
      .attr('class', 'd3p-plot-field');

    bubbles_field.selectAll('.d3p-dots')
        .data(_c.bubbles)
        .enter()
      .append('circle')
        .attr({
          class: 'd3p-dot',
          cx: function(b) { return _c.x_scale(b.x); },
          cy: function(b) { return _c.y_scale(b.y); }
        })
        .attr('r', function (b) {
          return b.size || 3;
        })
        .style(
          'fill',
          function(b) {
            return _c.group_color_scale(b.group);
          }
        )
        .style('fill-opacity', _c.bubble_opacity.fill)
        .style('stroke', function(b) {
          return _c.group_color_scale(b.group);
        })
        .on('mouseover', function(b) {
          d3.select(this).style('fill-opacity', 1);
          _visuals.tooltip.transition()
            .duration(200)
            .style('opacity', 1);
          _visuals.tooltip.html(
            '{{group}}<br/>{{x-axis-label}} - {{x}}<br/>{{y-axis-label}} - {{y}}'
              .replace(/{{group}}/g, b.group)
              .replace(/{{x-axis-label}}/g, _c.axis_labels.x)
              .replace(/{{y-axis-label}}/g, _c.axis_labels.y)
              .replace(/{{x}}/g, b.x)
              .replace(/{{y}}/g, b.y)
            )
            .style('left', (d3.event.pageX + 14) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function(b) {
          d3.select(this).style('fill-opacity', _c.bubble_opacity.fill);
          _visuals.tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        });
  };

  var _renderControlWidgets = function() {
    var legend_guide = d3phylum.components.legendGuide()
      .colorScale(_c.group_color_scale)
      .keys(_c.group_color_scale.domain())
      .fillOpacity(_c.bubble_opacity.fill)
      .onClick(function(d, target_selection) {
        if (!_isMaskedGroup(d)) {
          target_selection.style('opacity', _c.legend_disable_opacity);
          _addToMaskedGroups(d);
        } else {
          target_selection.style('opacity', 1);
          _removeFromMaskedGroups(d);
        }
        _renderPlot();
      });

    var legend_widget = _visuals.control_widgets.append('div')
      .attr('class', 'd3p-legend-guide')
      .call(legend_guide);
  };

  var visualFunc = function(selection) {
    _visuals.parent_selection = selection;
    _baseSetup();
    _baseRender();
    _c.source(function(error, bubbles) {
      _c.source_bubbles = bubbles;
      _updateBubbles(bubbles);
      _renderPlot();
      _renderControlWidgets();
    });
  };

  d3phylum.visuals.baseChart(visualFunc, _c);

  return visualFunc;
}