import { NimbusRPC } from './nimbusRPC.js';
import { NimbusStream } from './nimbusStream.js';
import { Nimbus3DRender } from './nimbus_3D.js';
import { render2Dscene } from './nimbus_2D.js';

// # Variable declarations

var NB3D_docElement = document.getElementById( 'container3D' );
var n3DRender = new Nimbus3DRender(NB3D_docElement);
var nimbusRPC = new NimbusRPC(location.host);

var slider = document.getElementById("expoSlider");
slider.onchange = function() {
    nimbusRPC.setExposure(this.value);
}

var statusbar = document.getElementById("statusbar");

document.addEventListener("DOMContentLoaded", function(event) {
    getExpoSlider();
});

let cb = function onNewData(header, ampl_arr, dist_arr, conf, x_arr, y_arr, z_arr)
{
    var plotMin = 0;
    var plotMax = 0;
    //statusbar.innerHTML = "Temp: " + (header[9]/10).toFixed(1) + "&deg;C | fps: " + header[8].toFixed(1);
    n3DRender.render3Dscene( x_arr, y_arr, z_arr, dist_arr, conf, plotMin, plotMax );
    render2Dscene( ampl_arr, conf, plotMin, plotMax);
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