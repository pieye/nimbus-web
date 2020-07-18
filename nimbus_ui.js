import { Nimbus3DRenderSingle } from './nimbus_3D.js';
import { NimbusRPC } from './nimbusRPC.js';

// Variables
// resolution height and width
var resolutionHeight = 288;
var resolutionWidth = 352;

var animationDT = 666;

var nimbusRPC = new NimbusRPC(location.host);

// On document loaded
$( document ).ready(function() {
  
  // connect clicks
  $( 'button.toggleFullScreen' ).click( function() { toggleFullScreen( $( this ) ) });
  $( 'button#globalSettingsButton' ).click( function() { toggleGlobalSettings() });
  $( 'button#AutoExposureButton' ).click( function() { toggleAutoExposure() });
  $( 'button#HDRButton' ).click( function() { toggleHDR() });
  $( 'button#showInfoButton' ).click( function() { toggleTopInfos() });
  
});

var switchStatus = false;
$("#HDRSwitch").on('change', function() {
  nimbusRPC.getExposureMode().then( ExposureMode => {
    if(ExposureMode == 1){
      document.getElementById("hdrSlider").disabled = true
      nimbusRPC.setExposureMode(0);
      HDRSwitch.checked=0
    }
    else if(ExposureMode == 3){
      document.getElementById("hdrSlider").disabled = true
      nimbusRPC.setExposureMode(2);
      HDRSwitch.checked=0
    }
    else if(ExposureMode == 0){
      nimbusRPC.setExposureMode(1);
      document.getElementById("hdrSlider").disabled = false
      HDRSwitch.checked=1
    }
    else if(ExposureMode == 2){
      nimbusRPC.setExposureMode(3);
      document.getElementById("hdrSlider").disabled = false
      HDRSwitch.checked=1
    }
  })
});

$("#AutoExposureSwitch").on('change', function() {
  nimbusRPC.getExposureMode().then( ExposureMode => {
    if(ExposureMode == 2){
      nimbusRPC.setExposureMode(0);
      AutoExposureSwitch.checked=0
    }
    else if(ExposureMode == 3){
      nimbusRPC.setExposureMode(1);
      AutoExposureSwitch.checked=0
    }
    else if(ExposureMode == 0){
      nimbusRPC.setExposureMode(2);
      AutoExposureSwitch.checked=1
    }
    else if(ExposureMode == 1){
      nimbusRPC.setExposureMode(3);
      AutoExposureSwitch.checked=1
    }
  })
});

function checkExposureMode(){
  nimbusRPC.getExposureMode().then( ExposureMode => {
    if(ExposureMode == 0){
      AutoExposureSwitch.checked=0
      document.getElementById("hdrSlider").disabled = true
      HDRSwitch.checked=0
    }
    else if(ExposureMode == 1){
      AutoExposureSwitch.checked=0
      document.getElementById("hdrSlider").disabled = false
      HDRSwitch.checked=1
    }
    else if(ExposureMode == 2){
      AutoExposureSwitch.checked=1
      document.getElementById("hdrSlider").disabled = true
      HDRSwitch.checked=0
    }
    else if(ExposureMode == 3){
      AutoExposureSwitch.checked=1
      document.getElementById("hdrSlider").disabled = false
      HDRSwitch.checked=1
    }
  })  
}

function toggleGlobalSettings() {
  checkExposureMode()
  $( '#globalSettingsContainer' ).slideToggle( animationDT );
}

function toggleTopInfos() {
  $( '#infoContainer' ).slideToggle( animationDT );
}

function toggleFullScreen( button ) {
  var NB3D_docElement = document.getElementById( 'container3D' );
  var parentContainer = button.parent( '.viewContainer' )
  var n3DRender = Nimbus3DRenderSingle.getInstance(NB3D_docElement);
    console.log(n3DRender);
  if( parentContainer.hasClass( 'fullScreen' ) ) {
    parentContainer.removeClass( 'fullScreen' );
    $( 'h1' ).show();
    parentContainer.siblings( '.viewContainer' ).show();
    
    parentContainer.height( resolutionHeight );
    parentContainer.width( resolutionWidth );
    
    var canvas = parentContainer.children( 'canvas' );
    canvas.height( resolutionHeight );
    canvas.width( resolutionWidth );
    n3DRender.resize(resolutionWidth, resolutionHeight);
    
    button.css( 'position', 'absolute' );
    
    $('html, body').css( {
      overflow: 'inherit',
      height: 'inherit'
    });
    
    button.removeClass( 'toNormal' );
  }
  else {
    parentContainer.addClass( 'fullScreen' );
    $( 'h1' ).hide();
    parentContainer.siblings( '.viewContainer' ).hide();
    
    parentContainer.height( $( window ).height() );
    parentContainer.width( $( window ).width() );
    
    var parentHfactor = parentContainer.innerHeight() / resolutionHeight;
    var parentWfactor = parentContainer.innerWidth() / resolutionWidth;
    
    var canvas = parentContainer.children( 'canvas' );
    n3DRender.resize($( window ).width(), $( window ).height());
    
    if( parentHfactor < parentWfactor ) {
      canvas.height( parentContainer.innerHeight() );
      canvas.width( resolutionWidth * parentHfactor );
    }
    else {
      canvas.height( resolutionHeight * parentWfactor );
      canvas.width( parentContainer.innerWidth() );
    }
    
    button.css( 'position', 'fixed' );
    
    $('html, body').css( {
      overflow: 'hidden',
      height: '100%'
    });
    
    button.addClass( 'toNormal' );
  }
}
