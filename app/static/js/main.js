// Helpers
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// Main
THREE.ImageUtils.crossOrigin = '';

init();
animate();

// poll();
