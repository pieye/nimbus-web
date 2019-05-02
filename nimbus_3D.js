
var renderer = new THREE.WebGLRenderer();
document.getElementById( 'container3D' ).appendChild( renderer.domElement );
var scene = new THREE.Scene();

var material = new THREE.PointsMaterial( {
  side: THREE.DoubleSide,
  color: 0xF5F5F5,
  vertexColors: THREE.VertexColors
});

var geometry = new THREE.BufferGeometry();
var points = new THREE.Points( geometry, material );
scene.add( points );

var positions = new Int16Array( 101376 * 3 );
var lutColors = new Float32Array( 101376 * 3 );

geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( lutColors , 3 ) );
geometry.setDrawRange( 0, numPixels );

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


function setupCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 100000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -1000;

  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,1));
}
