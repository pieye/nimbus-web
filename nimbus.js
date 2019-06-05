
// # Variable declarations

var NB_render2D = false;
var NB_render3D = false;

var nimbusData = new Int16Array( 352*288*2 );
var numPixels = 352 * 288;

var distMax = 0;
var distMin = 65432;

setupCamera();

var dataStream = new WebSocket("ws://"+location.host+":8080/stream");
// var dataStream = new WebSocket("ws://"+"192.168.0.69"+":8080/stream");
dataStream.binaryType = 'arraybuffer';
dataStream.onmessage=function(evt){
  var data = evt.data;
  // distMax = 0;
  // distMin = 65432;

  offset = 2 * numPixels;
  ampl_arr = new Uint16Array(evt.data, 0, numPixels);
  dist_arr = new Uint16Array(evt.data, offset, numPixels);
  offset += 2 * numPixels;
  conf = new Uint8Array(evt.data, offset, numPixels);
  offset += numPixels;

  var t0 = performance.now();

  x_arr = new Int16Array(numPixels);
  y_arr = new Int16Array(numPixels);
  z_arr = new Int16Array(numPixels);

  for (var i = 0; i < numPixels; i++) {
     x_arr[i] = dist_arr[i] * xMultiMatrix[i];
     y_arr[i] = dist_arr[i] * yMultiMatrix[i];
     z_arr[i] = dist_arr[i] * zMultiMatrix[i];
  }

  var t1 = performance.now();
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

  render3Dscene( x_arr, y_arr, z_arr, dist_arr, conf );
  render2Dscene( z_arr, conf, dist_arr );
};

function getColor( v )
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
