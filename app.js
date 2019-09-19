import { NimbusRPC } from './nimbusRPC.js';
import { NimbusStream } from './nimbusStream.js';
import { Nimbus3DRender } from './nimbus_3D.js';
import { render2Dscene, render2DRadialscene } from './nimbus_2D.js';

// # Variable declarations

var NB3D_docElement = document.getElementById( 'container3D' );
var n3DRender = new Nimbus3DRender(NB3D_docElement);
var nimbusRPC = new NimbusRPC(location.host);

var slider = document.getElementById("expoSlider");
slider.onchange = function() {
    nimbusRPC.setExposure(this.value);
}

var fpsValueSpan = document.getElementById( 'fpsValue' );
var tempValueSpan = document.getElementById( 'tempValue' );

document.addEventListener("DOMContentLoaded", function(event) {
    getExpoSlider();
});

let cb = function onNewData(header, ampl_arr, dist_arr, conf, x_arr, y_arr, z_arr)
{
  var plotMin = 0;
  var plotMax = 65535;
  n3DRender.render3Dscene( x_arr, y_arr, z_arr, dist_arr, conf, plotMin, plotMax );
  render2Dscene( ampl_arr, conf, plotMin, plotMax);
  render2DRadialscene( dist_arr, conf, plotMin, plotMax);
  
  fpsValueSpan.innerHTML = header[8].toFixed(1);
  tempValueSpan.innerHTML = (header[9]/10).toFixed(1) + '&deg;C';
}

var nimbusStream = new NimbusStream(location.host, cb);

function getExpoSlider() {
    nimbusRPC.getExposures().then(
        function(val) {
            slider.value=val[0]["exposure"];
        },
        function(status) {
            msg = "Error connecting to RPC server: " + status
            alert(msg);
        });
}