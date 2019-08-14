import { getColor } from './nimbus_common.js';

var canvas = document.getElementById( '2d' );
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, 352,288);

export function render2Dscene( arr, conf, distMin, distMax) {
  for(var i = 0; i < arr.length; i++) {
    if (conf[i] === 0)
    {
      //var col = getColor(arr[i], distMin, distMax);
      var r = arr[i]/4095;//col[0];
      var g = arr[i]/4095;//col[1];
      var b = arr[i]/4095;//col[2];
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
   //ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
}
