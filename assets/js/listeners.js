var isMute = false;
var oldSrc = "";

var $player = $('#sounds-player');
var $sounds = $('#sounds');

var instruct = 'click and drag to look around<br>arrow keys to pan<br>'

var toggleMute = function () {
  var $player = document.getElementById('sounds-player');
  var $instructions = $('#instructions');

  if (isMute) {
    // unmute
    $player.play();
    $instructions.html('m to mute<br><br>' + instruct);
  } else {
    // mute sounds
    $player.pause();
    $instructions.html('m to ummute<br><br>' + instruct);
  }
  isMute = !isMute;
}

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   // 'm'
   if (key == 77) {
      console.log('m key pressed');
      toggleMute();
   }
}

var update = function () {
  // sorry
  toggleMute();
  toggleMute();
}

// on-click buttons
var toOcean = function () {
  instruct = 'click and drag to look around<br>arrow keys to pan<br>'
  update();

  if(scene_s !== OCEAN_S) {
    if(scene_s == CLOUDS_S) {
      var clouds = document.getElementById('clouds-container');
      clouds.parentNode.removeChild(clouds);
    }

    $('#canvas-3d').show();

    $sounds.attr("src", 'assets/mp3s/ocean.mp3');
    $player.load();

    loadOcean();
    scene_s = OCEAN_S;
  }
}

var toClouds = function () {
  if(scene_s !== CLOUDS_S) {
    instruct = 'move mouse to pan<br>';
    update();

    $('#canvas-3d').hide();

    $sounds.attr("src", 'assets/mp3s/wind.wav');
    $player.load();
    
    clouds_init();
    scene_s = CLOUDS_S;
  }
  
}
