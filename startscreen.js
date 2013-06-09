(function(){
    var StartScreen = function() {
      this.initialize();
    }

    var p = StartScreen.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();

        this.x = 0;
        this.y = 0;

        this.image = new createjs.Bitmap("assets/images/start_screen.jpg");          
        this.addChild(this.image);

        this.btnStart = new createjs.Bitmap("assets/images/touch_start.png");
        this.btnStart.x = (screen_width/2)-223/2;
        this.btnStart.y = (screen_height/2)+(screen_height/4)-37/2;
		this.addChild(this.btnStart); 

		this.btnCredits = new createjs.Bitmap("assets/images/btn_credits.png");
        this.btnCredits.x = 5;
        this.btnCredits.y = 5;
        this.btnCredits.scaleX = this.btnCredits.scaleY = 0.5;
		this.addChild(this.btnCredits); 

        this.btnCredits.onPress = function (event) {
        	this.parent.credits();
        }

		// var touchArea = new createjs.Shape();
  //       touchArea.graphics.beginFill("rgba(0,0,0,0)")
	 //        .drawRect(this.btnStart.x,this.btnStart.y, this.btnStart.image.width, this.btnStart.image.height);
  //       this.addChild(touchArea);  
		this.btnStart.onPress = function (event) {
			this.parent.close();	
		}
		
		this.alphaOut();
    }

    StartScreen.prototype.alphaOut = function(){
    	createjs.Tween.get(this.btnStart).wait(100).to({alpha:0}, 800).call(function(){this.parent.alphaIn();});
    }

    StartScreen.prototype.alphaIn = function(){
	    createjs.Tween.get(this.btnStart).wait(100).to({alpha:1}, 800).call(function(){this.parent.alphaOut();});
    }

    StartScreen.prototype.close = function() {
    	createjs.Tween.removeAllTweens();
    	createjs.Tween.get(this).to({alpha:0}, 400).call(loadLevel);
    };

    StartScreen.prototype.credits = function() {    	
    	if(stage.credits==null){
    		var popOver = new Credits();
	    	stage.credits = popOver;
	    	stage.addChild(stage.credits);
    	}
    	stage.credits.open(true);
    };

    window.StartScreen = StartScreen;
}());

//
//
//
//
//Game Over Overlay Pop Over Class
//
(function(){
    var Credits = function() {
      this.initialize();
    }

    var p = Credits.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();

        this.alpha = 0;

        this.bg = new createjs.Bitmap("assets/images/CREDITS.jpg");
        this.addChild(this.bg);

        this.onPress = function (event) {
            this.close(true);
        }
    }

    Credits.prototype.open  = function(animated,onComplete) {                
        if(animated){            
            function finalComplete () {
                if(onComplete){
                    onComplete();
                }
            }
            createjs.Tween.get(this).to({alpha:1}, 400).call(finalComplete);        
        }
        else{
            this.alpha = 1;
        }
    };

    Credits.prototype.close = function(animated,onComplete) {
        if(animated){            
            createjs.Tween.get(this).to({alpha:0}, 350).call(function () {
                if(onComplete){
                    onComplete();
                }
            });           
        }
        else{
            this.alpha = 0;
        }
    };

    window.Credits = Credits;
}());