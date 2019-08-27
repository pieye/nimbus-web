import { getColor } from './nimbus_common.js';

class Nimbus3DRender {
    
    constructor(element) {
        this.renderer = new THREE.WebGLRenderer();

        // this.renderer.setSize(500,500);
        element.appendChild( this.renderer.domElement );

        this.scene = new THREE.Scene();
        var numPixels = 352 * 288;
        this.NB3D_mouseDown = false;

        this.NB3D_lastXPos = 0;
        this.NB3D_lastYPos = 0;

        this.viewCenter = new THREE.Vector3( 0, 0, 10000 );

        var material = new THREE.PointsMaterial( {
          side: THREE.DoubleSide,
          color: 0xF5F5F5,
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

        var self = this;
        element.onmousedown = function( eve ) {
            self.NB3D_mouseDown = true;
            self.NB3D_lastXPos = eve.clientX;
            self.NB3D_lastYPos = eve.clientY;
        };

        element.onmousemove = function( eve ) {
            if( !self.NB3D_mouseDown ) return;
            
            var x = eve.clientX - self.NB3D_lastXPos;
            self.NB3D_lastXPos = eve.clientX;
            
            var y = eve.clientY - self.NB3D_lastYPos;
            self.NB3D_lastYPos = eve.clientY;
            
            self.rotateCamera( x / 100, y / 100 );
        };

        element.onmouseup = function() {
            self.NB3D_mouseDown = false;
        };

        element.onwheel = function( eve ) {
            eve.preventDefault();
            console.log( eve.deltaY );
            var lookAtToCam = new THREE.Vector3().subVectors( self.camera.position, self.viewCenter );
            lookAtToCam.setLength( eve.deltaY * 5 );
            var newCamPos = new THREE.Vector3().addVectors( lookAtToCam, self.camera.position );
            self.viewCenter = new THREE.Vector3().addVectors( lookAtToCam, self.viewCenter );
            
            self.camera.position.x = newCamPos.x;
            self.camera.position.y = newCamPos.y;
            self.camera.position.z = newCamPos.z;
            self.camera.lookAt( self.viewCenter );
        }
    }

    rotateCamera( angleHorizontal, angleVertical ) {
      var lookAtToCam = new THREE.Vector3().subVectors( this.camera.position, this.viewCenter );
      var rotAxis = this.camera.up;
      lookAtToCam.applyAxisAngle( rotAxis, -angleHorizontal );
      
      var crossAxis = new THREE.Vector3().crossVectors( lookAtToCam, this.camera.up );
      crossAxis.normalize();
      lookAtToCam.applyAxisAngle( crossAxis, angleVertical );
      
      var newCamPos = new THREE.Vector3().addVectors( lookAtToCam, this.viewCenter );
      
      this.camera.position.x = newCamPos.x;
      this.camera.position.y = newCamPos.y;
      this.camera.position.z = newCamPos.z;
      this.camera.lookAt( this.viewCenter );
    }

    render3Dscene(x_arr, y_arr, z_arr, dist_arr, conf, distMin, distMax) {
      var positions = this.points.geometry.attributes.position.array;
      var lutColors = this.points.geometry.attributes.color.array;
      var posIndex = 0;

      for( var index = 0; index < dist_arr.length; index++ )  {

        var colorVal = dist_arr[index];
        var color = getColor(colorVal, distMin, distMax);
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
      this.points.geometry.attributes.position.needsUpdate = true;
      this.points.geometry.attributes.color.needsUpdate = true;
      this.renderer.render( this.scene, this.camera );
    }

    setupCamera() {
      this.camera = new THREE.PerspectiveCamera( 62, window.innerWidth/window.innerHeight, 0.1, 100000 );
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 0;

      this.camera.up = new THREE.Vector3( 0, 1, 0 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 1 ) );
    }

} /* Nimbus3DRender */

export { Nimbus3DRender };
