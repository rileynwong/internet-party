var camera, scene, renderer, geometry, material, mesh, sprite, particles;
var dataSrc = "assets/img/tree-billboard.png"

init();
animate();
var frame = 0;
var center = new THREE.Vector3(0, 0, 0);

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 150;
    scene.add(camera);
    geometry = new THREE.Geometry();
    var image = document.createElement('img');
    image.src = dataSrc;
    sprite = new THREE.Texture(image);
    sprite.needsUpdate = true;
    for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = 2000 * Math.random() - 1000;
        vertex.y = 0;
        vertex.z = 2000 * Math.random() - 1000;
        geometry.vertices.push(vertex);
    }
    material = new THREE.PointCloudMaterial({
        size: 50,
        sizeAttenuation: true,
        map: sprite,
        transparent: true,
        alphaTest: 0.5
    });
    particles = new THREE.PointCloud(geometry, material);
    scene.add(particles);
    renderer = new THREE.WebGLRenderer({
        clearAlpha: 1,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    frame++;
    camera.position.x = 700 * Math.cos(frame / 300);
    camera.position.z = 700 * Math.sin(frame / 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);
}
