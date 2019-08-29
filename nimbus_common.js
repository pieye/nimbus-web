export function getColor(v, distMin, distMax)
{
  var vmin = distMin;
  var vmax = distMax;

  if (v < vmin)
  v = vmin;
  if (v > vmax)
  v = vmax;
  
  var differenceMaxMin = vmax - vmin;
  var valueFraction = ( v - vmin ) / differenceMaxMin;
  
  var h = 0.25 + 0.5 * valueFraction;
  var s = 1.0 - 1.0 * valueFraction;
  var l = 0.9 - 0.8 * valueFraction;
  
  return hslToRgb( h, 0.66, 0.5 );
  
  /*
  var r = 1.0;
  var g = 1.0;
  var b = 1.0;
  
  if (v < (vmin + 0.25 * differenceMaxMin)) {
    r = 0;
    g = 4 * (v - vmin) / differenceMaxMin;
  } else if (v < (vmin + 0.5 * differenceMaxMin)) {
    r = 0;
    b = 1 + 4 * (vmin + 0.25 * differenceMaxMin - v) / differenceMaxMin;
  } else if (v < (vmin + 0.75 * differenceMaxMin)) {
    r = 4 * (v - vmin - 0.5 * differenceMaxMin) / differenceMaxMin;
    b = 0;
  } else {
    g = 1 + 4 * (vmin + 0.75 * differenceMaxMin - v) / differenceMaxMin;
    b = 0;
  }
  
  return[ r, g, b ];
  */
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r, g, b ];
}