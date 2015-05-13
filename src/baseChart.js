d3phylum.visuals.baseChart = function(visual_func, cache) {
  visual_func.width = function(value) {
    if (!arguments.length) return cache.width;
    cache.width = value;
    if (cache.margin) {
      cache.width -= cache.margin.left;
      cache.width -= cache.margin.right;
    }
    return visual_func;
  };

  visual_func.height = function(value) {
    if (!arguments.length) return cache.height;
    cache.height = value;
    if (cache.margin) {
      cache.height -= cache.margin.top || 0;
      cache.height -= cache.margin.bottom || 0;
    }
    return visual_func;
  };

  /* source_callback: function(callback) {} 
    callback would take in args: (error, data)
   */
  visual_func.source = function(source_callback) {
    cache.source = source_callback;
    return visual_func;
  };

  visual_func.axisLabels = function(axis_labels) {
    if (!arguments.length) return cache.axis_labels;
    cache.axis_labels = axis_labels;
    return visual_func;
  }
};