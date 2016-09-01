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

function addBoxToScene(box) {

    box.position.x = Math.random() * 1000 - 500;
    box.position.y = Math.random() * 600 - 300;
    box.position.z = Math.random() * 800 - 400;

    box.rotation.x = Math.random() * 2 * Math.PI;
    box.rotation.y = Math.random() * 2 * Math.PI;
    box.rotation.z = Math.random() * 2 * Math.PI;

    box.scale.x = Math.random() * 2 + 1;
    box.scale.y = Math.random() * 2 + 1;
    box.scale.z = Math.random() * 2 + 1;

    box.castShadow = true;
    box.receiveShadow = true;

    scene.add( box );

    objects.push( box );
}

function addBoxWithTexture(texture) {
    texture.minFilter = THREE.NearestFilter;
    material = new THREE.MeshBasicMaterial( { map: texture } );
    addBox(material);
}

function addBox(material) {
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var box = new THREE.Mesh( geometry, material );
    addBoxToScene(box);
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
    // addExistingBoxesFromServer();
    addStaticBoxes();

    window.addEventListener( 'resize', onWindowResize, false );
}

function addFillerBoxes() {
    // add some filler boxes
    var texture = THREE.ImageUtils.loadTexture( 'static/assets/filler.jpg' );
    texture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    for ( var i = 0; i < numFillerPhotos; i++ ) {
        addBox(material);
    }
}

function addStaticBoxes() {
    for (var i = 1; i <= 55; i++) {
        paddedNumString = pad(i, 4)
        var photoFileName = 'photo_' + paddedNumString + '.jpg'
        var texture = THREE.ImageUtils.loadTexture( 'static/assets/photos/' + photoFileName );

        texture.minFilter = THREE.NearestFilter;
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        addBox(material);
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

