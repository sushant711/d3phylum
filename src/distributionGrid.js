d3phylum.visuals.distributionGrid = function() {
  const all_groups_select_option = '##all_groups##'
  var _c = {
    margin: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 80
    },
    group_to_show: all_groups_select_option
  };

  var _visuals = {};

  var _config = {
    width: 600,
    height: 580,
    x_ticks: 20,
    y_ticks: 20,
    x_axis_label: 'x',
    y_axis_label: 'y',
    gradience_scale_type: 'linear',
    grid_cell_rgb: {r: 70, g: 30, b: 180}
  };

  var _baseSetup = function() {
    _c.x_scale = d3.scale.linear().range([
      0, _config.width - _c.margin.left - _c.margin.right]);
    _c.y_scale = d3.scale.linear().range([
      _config.height - _c.margin.top - _c.margin.bottom, 0]);
  };

  var _baseRender = function() {
    _visuals.parent_selection.selectAll('*').remove();
    _visuals.svg_plot = _visuals.parent_selection.append('svg')
      .attr({
        class: 'd3p-plot',
        width: _config.width,
        height: _config.height
      });
    _visuals.control_widgets = _visuals.parent_selection.append('div')
      .attr('class', 'd3p-control-widgets')
      .style({
        'margin-top': '17px',
        'margin-right': _c.margin.right + 'px',
        'margin-bottom': '17px',
        'margin-left': _c.margin.left + 'px',
        display: 'inline-block',
        width: _config.width + 'px'
      });
  };

  var _afterSourceSetup = function(source_data) {
    _c.source_points = source_data.points;
    _c.points = _c.source_points;

    var x_extent = d3.extent(_c.source_points, function(p) { return p.x; });
    var y_extent = d3.extent(_c.source_points, function(p) { return p.y; });
    var x_cushioned_domain = d3phylum.utils.getCushionedDomainForExtent(
      x_extent, 0.1);
    var y_cushioned_domain = d3phylum.utils.getCushionedDomainForExtent(
      y_extent, 0.1);

    _c.x_scale.domain(x_cushioned_domain);
    _c.y_scale.domain(y_cushioned_domain);
  };

  var _renderAxis = function() {
    /* X axis */
    var x_axis = d3phylum.components.axis()
      .orient('bottom')
      .scale(_c.x_scale)
      .label(_config.x_axis_label)
      .ticks(_config.x_ticks);
    _visuals.svg_plot.append('g')
      .attr('class', 'd3p-x d3p-axis')
      .attr('transform', d3phylum.utils.svgTranslate(
        _c.margin.left, _config.height - _c.margin.bottom))
      .call(x_axis);

    /* Y axis */
    var y_axis = d3phylum.components.axis()
      .orient('left')
      .scale(_c.y_scale)
      .label(_config.y_axis_label)
      .ticks(_config.y_ticks);
    _visuals.svg_plot.append('g')
      .attr('class', 'd3p-y d3p-axis')
      .attr('transform', d3phylum.utils.svgTranslate(
        _c.margin.left, _c.margin.top))
      .call(y_axis);
  };

  var _renderGrid = function() {
    _visuals.grid = _visuals.svg_plot.append('g')
      .attr('class', 'd3p-grid')
      .attr('transform', d3phylum.utils.svgTranslate(
        _c.margin.left, _c.margin.top));

    /* Grid width & height */
    var x_ticks = _c.x_scale.ticks(_config.x_ticks);
    var y_ticks = _c.y_scale.ticks(_config.y_ticks);
    _c.grid_cell_width = parseInt(
      _c.x_scale(x_ticks[1]) - _c.x_scale(x_ticks[0])
    );
    _c.grid_cell_height = parseInt(
      _c.y_scale(y_ticks[0]) - _c.y_scale(y_ticks[1])
    );

    /* Verticle gridlines */
    _visuals.grid.selectAll('.d3p-v-gridline')
        .data(_c.x_scale.ticks(_config.x_ticks))
        .enter()
      .append('line')
        .attr('class', 'd3p-v-gridline')
        .attr('x1', _c.x_scale)
        .attr('y1', 0)
        .attr('x2', _c.x_scale)
        .attr('y2', _config.height - _c.margin.top - _c.margin.bottom);

    /* Horizontal gridlines */
    _visuals.grid.selectAll('.d3p-h-gridline')
        .data(_c.y_scale.ticks(_config.y_ticks))
        .enter()
      .append('line')
        .attr('class', 'd3p-h-gridline')
        .attr('x1', 0)
        .attr('y1', _c.y_scale)
        .attr('x2', _config.width - _c.margin.left - _c.margin.right)
        .attr('y2', _c.y_scale);
  };

  var _getGridData = function() {
    var x_grid_pivot_scale = d3.scale.quantize()
      .domain(_c.x_scale.domain())
      .range(_c.x_scale.ticks(_config.x_ticks));

    var y_grid_pivot_scale = d3.scale.quantize()
      .domain(_c.y_scale.domain())
      .range(_c.y_scale.ticks(_config.y_ticks));


    var grid_index = {};
    _c.points.forEach(function(point) {
      var point_x_pivot = x_grid_pivot_scale(point.x);
      var point_y_pivot = y_grid_pivot_scale(point.y);
      var pivot_hash = JSON.stringify({
        x: point_x_pivot,
        y: point_y_pivot
      });
      grid_datum = grid_index[pivot_hash] || {
        x: point_x_pivot,
        y: point_y_pivot,
        count: 0
      };
      grid_datum.count += 1;
      grid_index[pivot_hash] = grid_datum;
    });
    return Object.keys(grid_index).map(
      function (hash) {
        return grid_index[hash];
      }
    );
  };

  var _getGradienceScale = function(count_data) {
    var gradience_scale;
    var count_extent = d3.extent(
      count_data,
      function(d) {
        return d.count;
      }
    );
    if (_config.gradience_scale_type === 'log') {
      count_extent[0] += 1;
      count_extent[1] += 1;
      gradience_scale = d3.scale.log().domain(count_extent).range([0.06, 1]);
      return function(count) {
        return gradience_scale(count + 1);
      };
    }
    else if (_config.gradience_scale_type === 'linear') {
      gradience_scale = d3.scale.linear().domain(count_extent).range([0.06, 1]);
      return function(count) {
        return gradience_scale(count);
      };
    }
  };

  var _renderGradienceForGridCells = function() {
    _c.grid_data = _getGridData();
    var gradience_scale = _getGradienceScale(_c.grid_data);

    var half_grid_cell_width = _c.grid_cell_width / 2;
    var half_grid_cell_height = _c.grid_cell_height / 2;

    var grid_cell_tooltip = d3phylum.components.tooltip();
    grid_cell_tooltip.htmlContent(function(d) {
      return d3phylum.utils.strSubstitute(
        '{{x_label}}: {{x}}<br/>{{y_label}}: {{y}}<br/>Count: {{count}}',
        {
          '{{x_label}}': _config.x_axis_label,
          '{{y_label}}': _config.y_axis_label,
          '{{x}}': d.x,
          '{{y}}': d.y,
          '{{count}}': d.count
        }
      );
    });
    
    _visuals.grid.selectAll('.d3p-gridcell')
        .data(_c.grid_data)
        .enter()
      .append('circle')
        .attr('cx', function(d) {return _c.x_scale(d.x);})
        .attr('cy', function(d) {return _c.y_scale(d.y);})
        .attr('r', d3.min([half_grid_cell_width, half_grid_cell_height]))
        .style('fill', function(d) {
          var rgb = _config.grid_cell_rgb;
          return d3phylum.utils.rgbaStr(
            rgb.r, rgb.g, rgb.b, gradience_scale(d.count)
          );
        })
        .call(grid_cell_tooltip);
  };

  var _getSummaryCounts = function(axis) {
    var axis_index = {};
    _c.grid_data.forEach(function(datum) {
      var indexed_datum = axis_index[datum[axis]];
      if (!indexed_datum) {
        indexed_datum = {count: 0};
        indexed_datum[axis] = datum[axis];
      }
      indexed_datum.count += datum.count;
      axis_index[datum[axis]] = indexed_datum;
    });
    return Object.keys(axis_index).map(
      function(axis_value) {
        return axis_index[axis_value];
      }
    );
  };

  var _renderSummaryGradience = function() {
    var rgb = _config.grid_cell_rgb;

    _c.x_summary_counts = _getSummaryCounts('x');
    _c.y_summary_counts = _getSummaryCounts('y');

    var x_gradience_scale = _getGradienceScale(_c.x_summary_counts);
    var y_gradience_scale = _getGradienceScale(_c.y_summary_counts);

    var x_tooltip = d3phylum.components.tooltip();
    x_tooltip.htmlContent(function(d) {
      return d3phylum.utils.strSubstitute(
        '{{x_label}}: {{x}}<br /> Count: {{count}}',
        {
          '{{x_label}}': _config.x_axis_label,
          '{{x}}': d.x,
          '{{count}}': d.count
        }
      );
    });

    var y_tooltip = d3phylum.components.tooltip();
    y_tooltip.htmlContent(function(d) {
      return d3phylum.utils.strSubstitute(
        '{{y_label}}: {{y}}<br /> Count: {{count}}',
        {
          '{{y_label}}': _config.y_axis_label,
          '{{y}}': d.y,
          '{{count}}': d.count
        }
      );
    });

    _visuals.x_summary_counts = _visuals.svg_plot.append('g')
        .attr('class', 'd3p-x-summary-counts')
        .attr('transform', d3phylum.utils.svgTranslate(
          _c.margin.left, _config.height - 30)
        );
    _visuals.x_summary_counts.selectAll('.d3p-x-summary-count-cell')
        .data(_c.x_summary_counts)
        .enter()
      .append('rect')
        .attr('x', function(d) { return _c.x_scale(d.x) - _c.grid_cell_width / 2 ; })
        .attr('y', 0)
        .attr('width', _c.grid_cell_width)
        .attr('height', 30)
        .style('fill', function(d) {
          return d3phylum.utils.rgbaStr(
            rgb.r, rgb.g, rgb.b, x_gradience_scale(d.count)
          );
        })
        .call(x_tooltip);

    _visuals.y_summary_counts = _visuals.svg_plot.append('g')
        .attr('class', 'd3p-y-summary-counts')
        .attr('transform', d3phylum.utils.svgTranslate(
          0, _c.margin.top)
        );
    _visuals.y_summary_counts.selectAll('.d3p-y-summary-count-cell')
        .data(_c.y_summary_counts)
        .enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', function(d) { return _c.y_scale(d.y) - _c.grid_cell_height / 2 ; })
        .attr('width', 30)
        .attr('height', _c.grid_cell_height)
        .style('fill', function(d) {
          return d3phylum.utils.rgbaStr(
            rgb.r, rgb.g, rgb.b, y_gradience_scale(d.count)
          );
        })
        .call(y_tooltip);
  };

  var _renderPlot = function() {
    _visuals.svg_plot.selectAll('*').remove();

    /* Points by groups to show */
    if (_c.group_to_show !== all_groups_select_option) {
      _c.points = _c.source_points.filter(function(p) {
        return _c.group_to_show === p.group;
      });
    } else {
      _c.points = _c.source_points;
    }

    _renderGrid();
    _renderAxis();
    _renderGradienceForGridCells();
    _renderSummaryGradience();
  };

  var _renderScaleTypeSelectionWidget = function() {
    var labels = _visuals.control_widgets.append('div')
        .attr('class', 'd3p-scale-type-selection-widget')
        .text('Gradience scale type:')
        .selectAll('input[type="radio"]')
        .data(['linear', 'log'])
        .enter()
      .append('label')
        .append('span')
          .attr('class', 'd3p-input-radio-wrapper');

      labels.append('input')
        .attr('checked', function(d) {
          return d === _config.gradience_scale_type ? 'checked' : null ;
        })
        .attr('type', 'radio')
        .attr('name', 'd3p-scale-type-option')
        .attr('value', function(d) { return d; })
        .on('click', function(d) {
          _config.gradience_scale_type = d;
          _renderPlot();
        });
      labels.append('span').text(function(d) { return d; })
  };

  var _renderDistributionGridZoomWidget = function() {
    _visuals.control_widgets.append('div')
        .attr('class', 'd3p-distribution-grid-zoom-widget')
        .text('Distribution grid ticks:')
        .selectAll('a.d3p-distribution-grid-zoom-option')
        .data([5, 10, 20, 50, 100])
        .enter()
      .append('a')
        .attr('href', '#')
        .attr('class', 'd3p-distribution-grid-zoom-option')
        .text(function(d) { return d; })
        .on('click', function(d) {
          _config.x_ticks = d;
          _config.y_ticks = d;
          _renderPlot();
        });
  };

  var _renderGroupSelectionWidget = function() {
    var distinct_groups = d3.map(
      _c.source_points,
      function(d) {
        return d.group;
      }
    ).keys();
    var labels = _visuals.control_widgets.append('div')
        .attr('class', 'd3p-group-selection-widget')
        .text('Distribution by group:')
        .selectAll('input[type="radio"]')
        .data(distinct_groups.concat([all_groups_select_option]))
        .enter()
      .append('label')
      .append('span')
        .attr('class', 'd3p-input-radio-wrapper');

    labels.append('input')
      .attr('type', 'radio')
      .attr('name', 'd3p-group-select-option')
      .attr('value', function(d) { return d; })
      .on('click', function(d) {
        _c.group_to_show = d;
        _renderPlot();
      });

    labels.append('span').text(function(d) {
      return d === all_groups_select_option ? 'All' : d;
    });

  };

  var _renderControlWidgets = function() {
    _visuals.control_widgets.selectAll('*').remove();
    _renderScaleTypeSelectionWidget();
    _renderDistributionGridZoomWidget();
    _renderGroupSelectionWidget();
  };

  var visualFunc = function(selection) {
    _visuals.parent_selection = selection;
    _baseSetup();
    _baseRender();
    _config.source(function(error, data) {
      _afterSourceSetup(data);
      _renderPlot();
      _renderControlWidgets();
    });
  };

  visualFunc.width = function(value) {
    if (!arguments.length) return _config.width;
    _config.width = value;
    return visualFunc;
  };

  visualFunc.height = function(value) {
    if (!arguments.length) return _config.height;
    _config.height = value;
    return visualFunc;
  };

  visualFunc.source = function(source_callback) {
    _config.source = source_callback;
    return visualFunc;
  };

  visualFunc.axisTicks = function(value) {
    if (!arguments.length) return {
      x: _config.x_ticks, y: _config.y_ticks
    };
    _config.x_ticks = value.x;
    _config.y_ticks = value.y;
    return visualFunc;
  };

  visualFunc.axisLabels = function(value) {
    if (!arguments.length) return {
      x: _config.x_axis_label, y: _config.y_axis_label
    };
    _config.x_axis_label = value.x;
    _config.y_axis_label = value.y;
    return visualFunc;
  };

  visualFunc.gradienceScaleType = function(value) {
    if (!arguments.length) return _config.gradience_scale_type;
    _config.gradience_scale_type = value;
    return visualFunc;
  };

  visualFunc.cellColor = function(hex) {
    if (!arguments.length) {
      var rgb = _config.grid_cell_rgb;
      return d3phylum.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    _config.grid_cell_rgb = d3phylum.utils.hexToRgb(hex);
    return visualFunc;
  };

  return visualFunc;
};