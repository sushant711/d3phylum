d3phylum.utils = {
  svgTranslate: function(x, y) {
    return 'translate(' + x + ',' + y + ')';
  },

  getCushionedDomainForExtent: function(extent, cushion_factor) {
    var range = extent[1] - extent[0];
    range += range * 2 * cushion_factor;
    var cushion = range * cushion_factor;
    return [extent[0] - cushion, extent[1] + cushion];
  },

  hexToRgb: function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex: function(r, g, b) {
    var toHex = function (c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return '#' + toHex(r) + toHex(g) + toHex(b);
  },

  strSubstitute: function(str, context) {
    Object.keys(context).map(
      function (key) {
        str = str.replace(key, context[key]);
        return key;
      }
    );
    return str;
  },

  rgbaStr: function(r, g, b, a) {
    return this.strSubstitute(
      'rgba({{r}}, {{g}}, {{b}}, {{a}})',
      {
        '{{r}}': r, '{{g}}': g,
        '{{b}}': b, '{{a}}': a
      }
    );
  }
};