

// Variables
// resolution height and width
var resolutionHeight = 288;
var resolutionWidth = 352;

var animationDT = 666;

// On document loaded

$( document ).ready(function() {
  
  // connect clicks
  $( 'button.toggleFullScreen' ).click( function() { toggleFullScreen( $( this ) ) });
  $( 'button#globalSettingsButton' ).click( function() { toggleGlobalSettings() });
  $( 'button#showInfoButton' ).click( function() { toggleTopInfos() });
  
});

function toggleGlobalSettings() {
  $( '#globalSettingsContainer' ).slideToggle( animationDT );
}

function toggleTopInfos() {
  $( '#infoContainer' ).slideToggle( animationDT );
}

function toggleFullScreen( button ) {
  var parentContainer = button.parent( '.viewContainer' )
  if( parentContainer.hasClass( 'fullScreen' ) ) {
    parentContainer.removeClass( 'fullScreen' );
    $( 'h1' ).show();
    parentContainer.siblings( '.viewContainer' ).show();
    
    parentContainer.height( resolutionHeight );
    parentContainer.width( resolutionWidth );
    
    var canvas = parentContainer.children( 'canvas' );
    canvas.height( resolutionHeight );
    canvas.width( resolutionWidth );
    
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
