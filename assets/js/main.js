const OCEAN_S  = 'ocean';
const CLOUDS_S = 'clouds';
const RAIN_S   = 'rain';
const FOREST_S = 'forest';

var scene_s = OCEAN_S;

function mainLoop() {
  switch(scene_s) {
    case OCEAN_S:
      OCEAN.update();
    break;
    case CLOUDS_S:
      clouds_animate();
    break;
    case RAIN_S:
    break;
    case FOREST_S:
    break;
  }
  requestAnimationFrame(mainLoop);
}

function onDocumentMouseDown(event) {
  switch(scene_s) {
    case OCEAN_S:
      event.preventDefault();
      
      var vector = new THREE.Vector3( 
          ( event.clientX / window.innerWidth ) * 2 - 1, 
          - ( event.clientY / window.innerHeight ) * 2 + 1, 
          0.5 );
      
      OCEAN.ms_Projector.unprojectVector( vector, OCEAN.ms_Camera );
      
      var ray = new THREE.Raycaster( OCEAN.ms_Camera.position, vector.sub( OCEAN.ms_Camera.position ).normalize() );
      var intersects = ray.intersectObjects( OCEAN.ms_Clickable );    

      if (intersects.length > 0) {  
          intersects[0].object.callback();
      }  
      break;
  }
}

$(function() {
  WINDOW.initialize();

  document.addEventListener('click', onDocumentMouseDown, false);

  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  
  // default, start with ocean scene
  loadOcean();
  mainLoop();
});