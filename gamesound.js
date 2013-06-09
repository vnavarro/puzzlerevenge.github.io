(function(){
	var soundAssets;
    var GameSound = function() {
      
    }


	GameSound.prototype.loadGameSounds = function(){		
		var bgm_gameover = this.loadSound("assets/sounds/songs/game_over.ogg");
		var bgm_game1 = this.loadSound("assets/sounds/songs/pixel_peeker_polka_slower.ogg");
		var bgm_game2 = this.loadSound("assets/sounds/songs/gameplay_02.ogg");
		var bgm_start = this.loadSound("assets/sounds/songs/abertura_final.ogg");
		var sfx_atk = this.loadSound("assets/sounds/effects/attack.wav");
		var sfx_die = this.loadSound("assets/sounds/effects/morte.wav");
		var sfx_exp = this.loadSound("assets/sounds/effects/explosion.wav");	
		this.soundAssets = {bgmgo:bgm_gameover,
						bgmin:bgm_game1,
						bgmst:bgm_start,
						sfxa:sfx_atk,
						sfxd:sfx_die,
						sfxe:sfx_exp}
	}

	GameSound.prototype.loadSound = function(file){
		var placeholder = new Audio(file);
		return placeholder;
	}

	GameSound.prototype.playSound = function(name,loop){
		this.soundAssets[name].play();	
		this.soundAssets[name].loop = loop;
	}

	GameSound.prototype.stopSound = function(name){
		this.soundAssets[name].pause();
		this.soundAssets[name].currentTime = 0;
	}

    window.GameSound = GameSound;
}());


// /*
// play a sound
// audioElement is an audio DOM element
// */
// function playAudio(audioElement){
//   audioElement.play();
// }

// function stopAudio(audioElement){
//   audioElement.pause();
// }

// function onDomReady() {
//   //assign DOM elements
//   console.log("dom ready");

//   bgm_gameover = document.getElementById('bgm_gameover');
//   bgm_game1 = document.getElementById('bgm_game1');
//   bgm_game2 = document.getElementById('bgm_game2');
//   bgm_start = document.getElementById('bgm_start');
//   sfx_atk = document.getElementById('sfx_atk');
//   sfx_die = document.getElementById('sfx_die');
//   sfx_exp = document.getElementById('sfx_exp');
// }

// document.addEventListener('readystatechange', function() {
//   if (document.readyState == 'interactive') {
//     // onDomReady();
//   }
// }, false);
