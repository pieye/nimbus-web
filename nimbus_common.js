export function getColor(v, distMin, distMax)
{
  var r = 1.0;
  var g = 1.0;
  var b = 1.0;
  var dv;

  // console.log( "distMin?: " + distMin + ", distMax?: " + distMax );

  var vmin = distMin;
  var vmax = distMax;

  if (v < vmin)
  v = vmin;
  if (v > vmax)
  v = vmax;
  dv = vmax - vmin;

  if (v < (vmin + 0.25 * dv)) {
    r = 0;
    g = 4 * (v - vmin) / dv;
  } else if (v < (vmin + 0.5 * dv)) {
    r = 0;
    b = 1 + 4 * (vmin + 0.25 * dv - v) / dv;
  } else if (v < (vmin + 0.75 * dv)) {
    r = 4 * (v - vmin - 0.5 * dv) / dv;
    b = 0;
  } else {
    g = 1 + 4 * (vmin + 0.75 * dv - v) / dv;
    b = 0;
  }

  return [r, g, b];
}
