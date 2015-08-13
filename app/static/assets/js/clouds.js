var clouds_container;
var clouds_camera, clouds_scene, clouds_renderer;
var clouds_mesh, clouds_geometry, clouds_material;

var clouds_mouseX = 0, clouds_mouseY = 0;
var start_time = Date.now();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function clouds_init() {

  clouds_container = document.createElement( 'div' );
  clouds_container.id = 'clouds-container';
  document.body.appendChild( clouds_container );

  // Bg gradient

  var canvas = document.createElement( 'canvas' );
  canvas.width = 32;
  canvas.height = window.innerHeight;

  var context = canvas.getContext( '2d' );

  var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
  gradient.addColorStop(0, "#1e4877");
  gradient.addColorStop(0.5, "#4584b4");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  clouds_container.style.backgroundImage = "url('assets/img/cloud-bg.png')";
  //clouds_container.style.background = "#fff";
  clouds_container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
  clouds_container.style.backgroundSize = '32px 100%';

  clouds_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
  clouds_camera.position.z = 6000;

  clouds_scene = new THREE.Scene();

  clouds_geometry = new THREE.Geometry();

  var texture = THREE.ImageUtils.loadTexture( 'assets/img/cloud.png', null, clouds_animate );
  texture.magFilter = THREE.LinearMipMapLinearFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;

  var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

  clouds_material = new THREE.ShaderMaterial( {

    uniforms: {

      "map": { type: "t", value: texture },
      "fogColor" : { type: "c", value: fog.color },
      "fogNear" : { type: "f", value: fog.near },
      "fogFar" : { type: "f", value: fog.far },

    },
    vertexShader: document.getElementById( 'vs' ).textContent,
    fragmentShader: document.getElementById( 'fs' ).textContent,
    depthWrite: false,
    depthTest: false,
    transparent: true

  } );

  var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

  for ( var i = 0; i < 8000; i++ ) {

    plane.position.x = Math.random() * 1000 - 500;
    plane.position.y = - Math.random() * Math.random() * 200 - 15;
    plane.position.z = i;
    plane.rotation.z = Math.random() * Math.PI;
    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

    THREE.GeometryUtils.merge( clouds_geometry, plane );
  }

  clouds_mesh = new THREE.Mesh( clouds_geometry, clouds_material );
  clouds_scene.add( clouds_mesh );

  clouds_mesh = new THREE.Mesh( clouds_geometry, clouds_material );
  clouds_mesh.position.z = - 8000;
  clouds_scene.add( clouds_mesh );

  clouds_renderer = new THREE.WebGLRenderer( { antialias: false } );
  clouds_renderer.setSize( window.innerWidth, window.innerHeight );
  clouds_container.appendChild( clouds_renderer.domElement );

  document.addEventListener( 'mousemove', clouds_onDocumentMouseMove, false );
  window.addEventListener( 'resize', clouds_onWindowResize, false );

}

function clouds_onDocumentMouseMove( event ) {

  clouds_mouseX = ( event.clientX - windowHalfX ) * 0.25;
  clouds_mouseY = ( event.clientY - windowHalfY ) * 0.15;

}

function clouds_onWindowResize( event ) {

  clouds_camera.aspect = window.innerWidth / window.innerHeight;
  clouds_camera.updateProjectionMatrix();

  clouds_renderer.setSize( window.innerWidth, window.innerHeight );

}

function clouds_animate() {

//  requestAnimationFrame( clouds_animate );

  position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

  clouds_camera.position.x += ( clouds_mouseX - clouds_camera.position.x ) * 0.01;
  clouds_camera.position.y += ( - clouds_mouseY - clouds_camera.position.y ) * 0.01;
  clouds_camera.position.z = - position + 8000;

  clouds_renderer.render( clouds_scene, clouds_camera );

}
