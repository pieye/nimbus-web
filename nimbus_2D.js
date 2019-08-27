import { getColor } from './nimbus_common.js';

var canvas = document.getElementById( '2dAmp' );
var canvasRadial = document.getElementById( '2dRad' );
var ctxAmpl = canvas.getContext('2d');
var ctxRad = canvasRadial.getContext('2d');
var imageDataAmpl = ctxAmpl.getImageData(0, 0, 352,288);
var imageDataRad = ctxRad.getImageData(0, 0, 352,288);

export function render2Dscene( arr, conf, distMin, distMax) {
    var ampDisp = new Float32Array(arr.length);
    var minAmp = 100000;
    var maxAmp = 0;
    for(var i = 0; i < arr.length; i++) {
        ampDisp[i] = Math.log(arr[i]+1);
        minAmp = Math.min(minAmp, ampDisp[i]);
        maxAmp = Math.max(maxAmp, ampDisp[i]);
    }

    maxAmp = Math.max(maxAmp, Math.log(4095+1));
    minAmp = 0;
    
  for(var i = 0; i < arr.length; i++) {
    if (conf[i] === 0)
    {
      var r = (ampDisp[i]-minAmp)/(maxAmp-minAmp);
      var g = (ampDisp[i]-minAmp)/(maxAmp-minAmp);
      var b = (ampDisp[i]-minAmp)/(maxAmp-minAmp);
      
      imageDataAmpl.data[4*i] = r*255;
      imageDataAmpl.data[4*i+1] = g*255;
      imageDataAmpl.data[4*i+2] = b*255;
      imageDataAmpl.data[4*i+3] = 255;
    }
    else if (conf[i] == 2)
    {
      imageDataAmpl.data[4*i] = 255;
      imageDataAmpl.data[4*i+1] = 255;
      imageDataAmpl.data[4*i+2] = 255;
      imageDataAmpl.data[4*i+3] = 255;
    }
    else if (conf[i] == 1 || conf[i] == 3)
    {
      imageDataAmpl.data[4*i] = 0;
      imageDataAmpl.data[4*i+1] = 0;
      imageDataAmpl.data[4*i+2] = 0;
      imageDataAmpl.data[4*i+3] = 255;
    }
  }

   ctxAmpl.putImageData(imageDataAmpl, 0, 0);
}

export function render2DRadialscene( arr, conf, distMin, distMax) {
  for(var i = 0; i < arr.length; i++) {
    if (conf[i] === 0)
    {
      var col = getColor(arr[i], distMin, distMax);
      var r = col[0];
      var g = col[1];
      var b = col[2];
      imageDataRad.data[4*i] = r*255;//(z_arr[i])/255;
      imageDataRad.data[4*i+1] = g*255;//(z_arr[i])/255;
      imageDataRad.data[4*i+2] = b*255;//(z_arr[i])/255;
      imageDataRad.data[4*i+3] = 255;
    }
    else if (conf[i] == 2)
    {
      imageDataRad.data[4*i] = 255;
      imageDataRad.data[4*i+1] = 255;
      imageDataRad.data[4*i+2] = 255;
      imageDataRad.data[4*i+3] = 255;
    }
    else if (conf[i] == 1 || conf[i] == 3)
    {
      imageDataRad.data[4*i] = 0;
      imageDataRad.data[4*i+1] = 0;
      imageDataRad.data[4*i+2] = 0;
      imageDataRad.data[4*i+3] = 255;
    }
  }

   ctxRad.putImageData(imageDataRad, 0, 0);
}