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

function toggleGlobalSettings() {
  $( '#globalSettingsContainer' ).slideToggle( animationDT );
}

function toggleAutoExposure() {
  nimbusRPC.getExposureMode().then( ExposureMode => {
    if(ExposureMode == 2)
        nimbusRPC.setExposureMode(0);
    else if(ExposureMode == 3)
        nimbusRPC.setExposureMode(1);
    else if(ExposureMode == 0)
      nimbusRPC.setExposureMode(2);
    else if(ExposureMode == 1)
      nimbusRPC.setExposureMode(3);

  })
}

function toggleHDR() {
  nimbusRPC.getExposureMode().then( ExposureMode => {
    if(ExposureMode == 1)
        nimbusRPC.setExposureMode(0);
    else if(ExposureMode == 2)
        nimbusRPC.setExposureMode(3);
    else if(ExposureMode == 0)
      nimbusRPC.setExposureMode(1);
    else if(ExposureMode == 3)
      nimbusRPC.setExposureMode(2);
  })
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
