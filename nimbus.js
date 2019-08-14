import { NimbusRPC } from './nimbusRPC.js';
import { Nimbus3DRender } from './nimbus_3D.js';
import { render2Dscene } from './nimbus_2D.js';

// # Variable declarations

var NB_render2D = false;
var NB_render3D = false;

var nimbusData = new Int16Array( 352*288*2 );
var numPixels = 352 * 288;

var distMax = 0;
var distMin = 65432;

var xMultiMatrix = null;
var yMultiMatrix = null;
var zMultiMatrix = null;

var NB3D_docElement = document.getElementById( 'container3D' );
var n3DRender = new Nimbus3DRender(NB3D_docElement);
var nimbusRPC = new NimbusRPC(location.host);

var slider = document.getElementById("expoSlider");
slider.onchange = function() {
    nimbusRPC.setExposure(this.value);
}

document.addEventListener("DOMContentLoaded", function(event) {
    getMultiMatrix();
    getExpoSlider();
});

var dataStream = new WebSocket("ws://"+location.host+":8080/stream");
dataStream.binaryType = 'arraybuffer';
dataStream.onmessage=function(evt){
    if (xMultiMatrix === null || yMultiMatrix === null || zMultiMatrix === null)
        return;
    var data = evt.data;
    var plotMin = distMin;
    var plotMax = distMax;
    // distMax = 0;
    // distMin = 65432;

    var offset = 2 * numPixels;
    var ampl_arr = new Uint16Array(evt.data, 0, numPixels);
    var dist_arr = new Uint16Array(evt.data, offset, numPixels);
    offset += 2 * numPixels;
    var conf = new Uint8Array(evt.data, offset, numPixels);
    offset += numPixels;

    var t0 = performance.now();

    var x_arr = new Int16Array(numPixels);
    var y_arr = new Int16Array(numPixels);
    var z_arr = new Int16Array(numPixels);

    for (var i = 0; i < numPixels; i++) {
        var temp;
        temp = dist_arr[i] * xMultiMatrix[i];
        x_arr[i] = (temp >> 16);
        temp = dist_arr[i] * yMultiMatrix[i];
        y_arr[i] = (temp >> 16);
        temp = dist_arr[i] * zMultiMatrix[i];
        z_arr[i] = (temp >> 16);
    }

    var t1 = performance.now();
    //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

    distMin, distMax = n3DRender.render3Dscene( x_arr, y_arr, z_arr, dist_arr, conf, plotMin, plotMax );
    render2Dscene( ampl_arr, conf, plotMin, plotMax );
};

function getMultiMatrix() {
    nimbusRPC.getUnitXVector().then(
        function(val) {
            xMultiMatrix=val;
        },
        function(status) {
            console.log(status);
        });

    nimbusRPC.getUnitYVector().then(
        function(val) {
            yMultiMatrix=val;
        },
        function(status) {
            console.log(status);
        });

    nimbusRPC.getUnitZVector().then(
        function(val) {
            zMultiMatrix=val;
        },
        function(status) {
            console.log(status);
        });
}

function getExpoSlider() {
    nimbusRPC.getExposures().then(
        function(val) {
            slider.value=val[0]["exposure"];
        },
        function(status) {
            console.log(status);
        });
}
