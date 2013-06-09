// <audio id="bgm_gameover" src="./assets/sounds/songs/game_over.ogg" preload loop></audio>
//     <audio id="sfx_atk" src="./assets/sounds/effects/attack.wav" preload></audio>
//     <audio id="sfx_exp" src="./assets/sounds/effects/explosion.wav" preload></audio>
//     <audio id="sfx_die" src="./assets/sounds/effects/morte.wav" preload></audio>
//     <audio id="bgm_game1" src="./assets/sounds/songs/game_play01.ogg" preload loop></audio>
//     <audio id="bgm_game2" src="./assets/sounds/songs/gameplay_02.ogg" preload loop></audio>	
//     <audio id="bgm_start" src="./assets/sounds/songs/start_screen.ogg" preload loop></audio>	

//Vars and Enums
var canvas;
var stage;
var screen_width;
var screen_height;
var gSound;
window.GameStatesEnum = {
	LOADING:0,
	ENDED:1,
	PREPLAYING:2,
    PLAYING:3,
    PAUSED:4
};
window.GridStatusEnum = {
	FREE:0,
	BLOCK:1,
	PLAYER:2,
    ITEM:3
};
window.BlockTypeEnum = {
	SQUARE:{code:0,img:"assets/images/orange.png",points:25},
	LINE:{code:1,img:"assets/images/green.png",points:75},
	T:{code:2,img:"assets/images/ice_blue.png",points:40},
    S:{code:3,img:"assets/images/purple.png",points:40},
    Z:{code:4,img:"assets/images/yellow.png",points:40},
    L:{code:5,img:"assets/images/blue.png",points:55},
    RL:{code:6,img:"assets/images/red.png",points:55}
};



function init(){
	currentGameState = GameStatesEnum.LOADING;
	canvas = document.getElementById("canvas");

	// grab canvas width and height for later calculations:
	screen_width = canvas.width;
	screen_height = canvas.height;

	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);

	addSwipeEventsToStage();

	stage.loading = new createjs.Bitmap("assets/images/loading.jpg");
	stage.addChild(stage.loading);

	stage.update();
	
	gSound = new GameSound();
	gSound.loadGameSounds();
	
	doneLoading();
}

//Game Functions

function doneLoading(){
	window.setTimeout(function(){		
        startGame();
	 },1500);        	
}

function startGame() {		
	// we want to do some work before we update the canvas,
	// otherwise we could use Ticker.addListener(stage);
	createjs.Ticker.addListener(window);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	loadStartScreen();
	stage.removeChild(stage.loading);
}

function loadStartScreen(){
	stage.startScreen = new StartScreen();
	stage.addChild(stage.startScreen);
	gSound.playSound("bgmst",true);

}

function loadLevel(){
	unloadStartScreen();

	gSound.playSound("bgmin",true);

	stage.player = new Player();	
	stage.level = new Level(stage.player);
	stage.levelHud = new LevelHUD();

	stage.addChild(stage.level);
	stage.addChild(stage.player);

	stage.addChild(stage.levelHud);

	currentGameState = GameStatesEnum.PREPLAYING;
	stage.level.go();
}
function retryGame () {
	currentGameState = GameStatesEnum.PREPLAYING;
	stage.player.restart();
	stage.level.restart();
	stage.levelHud.restart();
	stage.removeChild(stage.gameOver);
	stage.gameOver = null;
	stage.level.go();	
}

function goBackToMenu(){
	currentGameState = GameStatesEnum.PREPLAYING;
	stage.player.restart();
	stage.level.restart();
	stage.levelHud.restart();	
	stage.removeChild(stage.gameOver);
	stage.gameOver = null;
	gSound.stopSound("bgmgo");
	loadStartScreen();
}

function unloadStartScreen(){
	gSound.stopSound("bgmst");
	createjs.Tween.removeAllTweens();
	stage.removeChild(stage.startScreen);
	stage.startScreen = null;
	stage.removeChild(stage.credits);
	stage.credits = null;	
}

//Itens usage
function usedClearPowerUp(){
	stage.level.clearGrid();
}

//Stage Events
function tick(event){	

	if(stage.level){ 
		stage.level.update(); 
	}
	stage.update(event);
}

function addSwipeEventsToStage(){
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas	

	var element = document.getElementById('canvas');
    var hammertime = Hammer(element,{
	        drag: false,
	        swipe_velocity: 0.5
    	}).on("swipeleft swiperight", function(event) {
    	event.gesture.preventDefault();
        console.log(event.type);
        if(event.type=="swipeleft"){        	
        	if(stage.player.moveLeft(stage.level.levelGrid)){        		
        		stage.level.shouldUpdatePlayer = true;        		
        	}
        	event.gesture.stopDetect();
        }
    	else if(event.type=="swiperight"){
			if(stage.player.moveRight(stage.level.levelGrid)){
				stage.level.shouldUpdatePlayer = true;
			}
			event.gesture.stopDetect();
    	}    	    	
    });

	// stage.addEventListener("stagemousedown", touchDown);
	// stage.addEventListener("stagemouseup", touchUp);

	// function stop() {}
	// function touchDown(event) {
	// 	stage.addEventListener("stagemousemove" , touchMove);
	// }
	// function touchMove(event) {

	// }
	// function touchUp(event) {
	// 	stage.removeEventListener("stagemousemove" , touchMove);
	// } 
}