var container;
var camera, controls, scene, renderer;
var objects = [], plane;
var scene = new THREE.Scene();

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;

var numFillerPhotos = 10; // number of filler boxes to begin with
var numPhotos = 0;        // number of non-filler boxes
var numFiles = 0;         // number of files in photos directory

init();
animate();

function addPhoto(material) {
        var geometry = new THREE.BoxGeometry( 50, 50, 50 );
        var object = new THREE.Mesh( geometry, material );

        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600 - 300;
        object.position.z = Math.random() * 800 - 400;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;

        object.castShadow = true;
        object.receiveShadow = true;

        scene.add( object );

        objects.push( object );
}

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;


    scene.add( new THREE.AmbientLight( 0x505050 ) );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    scene.add( light );

    plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
            );
    plane.visible = false;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xd6efe7 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

    // Picture boxes
    addFillerBoxes();
    addExistingBoxesFromServer();

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //

    raycaster.setFromCamera( mouse, camera );

    if ( SELECTED ) {

        var intersects = raycaster.intersectObject( plane );
        SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
        return;

    }

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

            plane.position.copy( INTERSECTED.position );
            plane.lookAt( camera.position );

        }

        container.style.cursor = 'pointer';

    } else {

        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

        container.style.cursor = 'auto';

    }

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
        controls.enabled = false;

        SELECTED = intersects[ 0 ].object;

        var intersects = raycaster.intersectObject( plane );
        offset.copy( intersects[ 0 ].point ).sub( plane.position );

        container.style.cursor = 'move';
    }
}

function onDocumentMouseUp( event ) {
    event.preventDefault();
    controls.enabled = true;
    if ( INTERSECTED ) {
        plane.position.copy( INTERSECTED.position );
        SELECTED = null;
    }
    container.style.cursor = 'auto';
}

function addFillerBoxes() {
    // add some filler boxes
    var texture = THREE.ImageUtils.loadTexture( 'static/assets/filler.jpg' );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    for ( var i = 0; i < numFillerPhotos; i++ ) {
        addPhoto(material);
    }
}

function addExistingBoxes() {
    var numFilesFormatted, textureFile, texture, material;
    
    for ( var i = 1; i <= numFiles; i++ ) {
        // add new box
        numFilesFormatted = pad(i, 4);
        textureFile = 'static/photos/photo_'.concat(numFilesFormatted).concat('.jpg');
        texture = THREE.ImageUtils.loadTexture( textureFile );
        material = new THREE.MeshBasicMaterial( { map: texture } );
        
        addPhoto(material);
        console.log('added existing photo: ' + i);

        // "refresh" directory
        numPhotos = numFiles;
    }
}

//

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function checkNumPhotos(numFiles) {

    // if new photo has been sent to Twilio and added to our directory
    if (numFiles > numPhotos) {
        console.log('adding new photo...');

        // add new box
        var numFilesFormatted = pad(numFiles, 4);
        var textureFile = 'static/photos/photo_'.concat(numFilesFormatted).concat('.jpg');
        var texture = THREE.ImageUtils.loadTexture( textureFile );
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        
        addPhoto(material);
        console.log('new photo added');

        // "refresh" directory
        numPhotos = numFiles;
        render();
    }
}

// Get number of existing photos from server, set variable
function addExistingBoxesFromServer() {
    setTimeout(function() {
        $.ajax({
            url: "/fileCount",
            type: "GET",
            success: function(data) {
                console.log('Num photos init: ' + data);
                numFiles = parseInt(data);
                addExistingBoxes();
            },
            dataType: "json",
            timeout: 2000
        })
    }, 10);
};

console.log('polling server...');
function poll() {
    setTimeout(function() {
        $.ajax({
            url: "/fileCount",
            type: "GET",
            success: function(data) {
                numFiles = parseInt(data);
                checkNumPhotos(numFiles);
            },
            dataType: "json",
            complete: poll,
            timeout: 2000
        })
    }, 5000);
};
poll();
