function onDocumentMouseDown(event) {
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
}


var loadOcean = function () {
  var parameters = {
        alea: RAND_MT,
        generator: PN_GENERATOR,
        width: 2000,
        height: 2000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1,
        filter: [ CIRCLE_FILTER ],
        postgen: [ MOUNTAINS_COLORS ],
        effect: [ DESTRUCTURE_EFFECT ]
      };
      
      OCEAN.initialize('canvas-3d', parameters);
      
      WINDOW.resizeCallback = function(inWidth, inHeight) { OCEAN.resize(inWidth, inHeight); };
      OCEAN.resize(WINDOW.ms_Width, WINDOW.ms_Height);
}