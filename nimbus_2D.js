
var canvas = document.getElementById( '2d' );
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, 352,288);


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
