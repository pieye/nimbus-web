import { NimbusRPC } from './nimbusRPC.js';
import { NimbusStream } from './nimbusStream.js';
import { Nimbus3DRenderSingle } from './nimbus_3D.js';
import { render2Dscene, render2DRadialscene } from './nimbus_2D.js';

// # Variable declarations
var NB3D_docElement = document.getElementById( 'container3D' );
var n3DRender       = Nimbus3DRenderSingle.getInstance(NB3D_docElement);
var nimbusRPC       = new NimbusRPC(location.host);
var exposure        = 500
var hdr             = 0.3

var slider = document.getElementById("expoSlider");
slider.onchange = function() {
    nimbusRPC.getExposureMode().then( ExposureMode => {
        if(ExposureMode == 2 || ExposureMode == 3)
            nimbusRPC.setAmplitude(this.value);
        else{
            exposure = this.value
            nimbusRPC.setExposure(exposure, hdr);
        }
    })
}

var slider_hdr = document.getElementById("hdrSlider");
slider_hdr.onchange = function() {
hdr = this.value
    nimbusRPC.getExposureMode().then( ExposureMode => {
        if(ExposureMode == 0 || ExposureMode == 1){
            nimbusRPC.setExposure(exposure, hdr)
        }
        else{
            nimbusRPC.setHdrFactor(hdr)
        }
    })
}

var fpsValueSpan  = document.getElementById( 'fpsValue' );
var tempValueSpan = document.getElementById( 'tempValue' );
var expoLongSpan  = document.getElementById( 'expoLongValue' );
var expoShortSpan = document.getElementById( 'expoShortValue' );

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
  
  fpsValueSpan.innerHTML  = header[8].toFixed(1);
  tempValueSpan.innerHTML = (header[9]/10).toFixed(1) + '&deg;C';
  expoLongSpan.innerHTML  = (header[10]).toFixed(0);
  expoShortSpan.innerHTML = (header[11]).toFixed(0);
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