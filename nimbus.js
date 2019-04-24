
// # Variable declarations

var renderer = new THREE.WebGLRenderer();
document.getElementById( 'container3D' ).appendChild( renderer.domElement );      

var scene = new THREE.Scene();
var nimbusData= new Int16Array( 352*288*2 );

var material = new THREE.PointsMaterial( {
  side: THREE.DoubleSide,
  color: 0xF5F5F5,
  vertexColors: THREE.VertexColors
});

var geometry = new THREE.BufferGeometry();
var points = new THREE.Points( geometry, material );

var positions = new Int16Array( 101376 * 3 );
var lutColors = new Float32Array( 101376 * 3 );
var numPixels = 352 * 288;

var canvas = document.getElementById( '2d' );
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, 352,288);

var distMax = 0;
var distMin = 65432;

for( var i = 0; i < numPixels; i++ ) {
  lutColors[ 3 * i ] = 1;//color.r;
  lutColors[ 3 * i + 1 ] = 0;//color.g;
  lutColors[ 3 * i + 2 ] = 0;//color.b;
}

geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( lutColors , 3 ) );
geometry.setDrawRange( 0, numPixels );

scene.add( points );

// var dataStream = new WebSocket("ws://"+location.host+":8080/stream");
var dataStream = new WebSocket("ws://"+"192.168.0.69"+":8080/stream");
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
  x_arr = new Int16Array(evt.data, offset, numPixels);
  offset += 2 * numPixels;
  y_arr = new Int16Array(evt.data, offset, numPixels);
  offset += 2 * numPixels;
  z_arr = new Int16Array(evt.data, offset, numPixels);

  render3Dscene( x_arr, y_arr, z_arr, dist_arr, conf );
  render2Dscene( z_arr, conf, dist_arr );
};

function render3Dscene(x_arr, y_arr, z_arr, dist_arr, conf) {
  var positions = points.geometry.attributes.position.array;
  var lutColors = points.geometry.attributes.color.array;
  var posIndex = 0;

  for( var index = 0; index < numPixels; index++ )  {
    distMin = Math.min( distMin, dist_arr[index] );
    distMax = Math.max( distMax, dist_arr[index] );

    var colorVal = dist_arr[index];
    var color = getColor( colorVal );
    if(conf[index] == 0)
    {
      positions[posIndex++] = x_arr[index];
      positions[posIndex++] = y_arr[index];
      positions[posIndex++] = z_arr[index];
      lutColors[ 3 * index ] = color[0];
      lutColors[ 3 * index + 1 ] = color[1];
      lutColors[ 3 * index + 2 ] = color[2];
    }
    else
    {
      positions[posIndex++] = 0;
      positions[posIndex++] = 0;
      positions[posIndex++] = -30000;
      lutColors[ 3 * index ] = 0;
      lutColors[ 3 * index + 1 ] = 0;
      lutColors[ 3 * index + 2 ] = 0;
    }
  }
  points.geometry.attributes.position.needsUpdate = true;
  points.geometry.attributes.color.needsUpdate = true;
  renderer.render( scene, camera );
}

function render2Dscene( z_arr, conf, dist_arr ) {
  for(var i = 0; i < numPixels; i++) {
    if (conf[i] === 0)
    {
      var col = getColor(dist_arr[i]);
      var r = col[0];
      var g = col[1];
      var b = col[2];
      imageData.data[4*i] = r*255;//(z_arr[i])/255;
      imageData.data[4*i+1] = g*255;//(z_arr[i])/255;
      imageData.data[4*i+2] = b*255;//(z_arr[i])/255;
      imageData.data[4*i+3] = 255;
    }
    else if (conf[i] == 2)
    {
      imageData.data[4*i] = 255;
      imageData.data[4*i+1] = 255;
      imageData.data[4*i+2] = 255;
      imageData.data[4*i+3] = 255;
    }
    else if (conf[i] == 1 || conf[i] == 3)
    {
      imageData.data[4*i] = 0;
      imageData.data[4*i+1] = 0;
      imageData.data[4*i+2] = 0;
      imageData.data[4*i+3] = 255;
    }
  }

ctx.putImageData(imageData, 0, 0);
}

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

function setupCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 100000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -1000;

  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,1));
}

// init
setupCamera();