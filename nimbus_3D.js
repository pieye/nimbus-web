import { getColor } from './nimbus_common.js';
//import { TrackballControls } from './TrackballControls.js';

class Nimbus3DRender {
    
    constructor(element) {
        this.element = element;
        this.renderer = new THREE.WebGLRenderer();

        element.appendChild( this.renderer.domElement );

        //this.renderer.setSize(element.innerWidth, element.clientHeight);
        this.scene = new THREE.Scene();
        var numPixels = 352 * 288;


        var material = new THREE.PointsMaterial( {
          side: THREE.DoubleSide,
          size: 1,
          color: 0xFFFFFF,
          vertexColors: THREE.VertexColors
        });

        var geometry = new THREE.BufferGeometry();
        this.points = new THREE.Points( geometry, material );
        this.scene.add( this.points );
        
        this.setupCamera();

        var positions = new Int16Array( 101376 * 3 );
        var lutColors = new Float32Array( 101376 * 3 );

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( lutColors , 3 ) );
        geometry.setDrawRange( 0, numPixels );
    }

    resize(width, height){
            this.camera.aspect = width/height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( width, height);
            console.log("resize!", width, height);
    }

    render3Dscene(x_arr, y_arr, z_arr, dist_arr, conf, distMin, distMax) {
        var positions = this.points.geometry.attributes.position.array;
        var lutColors = this.points.geometry.attributes.color.array;
        var posIndex = 0;

        for( var index = 0; index < dist_arr.length; index++ )  {

            var colorVal = dist_arr[index];
            var color = getColor(colorVal, distMin, distMax);
            if(conf[index] == 0 || conf[index] == 4)
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
        this.points.geometry.attributes.position.needsUpdate = true;
        this.points.geometry.attributes.color.needsUpdate = true;
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 100000 );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 30000;

        //this.camera.up = new THREE.Vector3( 0, 1, 0 );
        this.camera.lookAt( new THREE.Vector3( 0, 0, 1 ) );

        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.controls.target.set( 0, 0, 0 );
        this.controls.update();
    }


} /* Nimbus3DRender */

var Nimbus3DRenderSingle = (function () {
    var instance;
 
    function createInstance(element) {
        var object = new Nimbus3DRender(element);
        return object;
    }
 
    return {
        getInstance: function (element) {
            if (!instance) {
                instance = createInstance(element);
            }
            return instance;
        }
    };
})();

export { Nimbus3DRenderSingle };
