(function(){
    var LevelHUD = function() {
      this.initialize();
    }

    var p = LevelHUD.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();

        this.addChild(new createjs.Bitmap("assets/images/hud.png"));

        this.score = 0 ;
    	this.txtScore = new createjs.Text("Score:0","25px Oval Single","#FF0");
		this.txtScore.x = 10;
		this.txtScore.y = 17;
		this.addChild(this.txtScore);

		this.txtScoreO = new createjs.Text("Score:0","25px Oval Single","#03c");
		this.txtScoreO.x = this.txtScore.x;
		this.txtScoreO.y = this.txtScore.y;
		this.txtScoreO.outline = true;

		this.addChild(this.txtScoreO);

		this.combo = 1 ;
		this.comboGroup = 0;
    	this.txtCombo = new createjs.Text("Combo:1x","25px Oval Single","#FF0");
		this.txtCombo.x = screen_width-10;
		this.txtCombo.y = 17;
		this.txtCombo.textAlign = "end";
		this.addChild(this.txtCombo);

		this.txtComboO = new createjs.Text("Combo:1x","25px Oval Single","#03c");
		this.txtComboO.x = this.txtCombo.x;
		this.txtComboO.y = this.txtCombo.y;
		this.txtComboO.textAlign = "end";
		this.txtComboO.outline = true;

		this.addChild(this.txtComboO);
    }

    LevelHUD.prototype.updateScore = function(newScore) {
    	this.score += (newScore*this.combo);
    	this.txtScore.text = "Score:"+this.score;
    	this.txtScoreO.text = "Score:"+this.score;
    };

    LevelHUD.prototype.updateCombo = function(newCombo) {
    	this.comboGroup++;
    	if(this.comboGroup<3)return;
    	this.combo += newCombo;
    	this.comboGroup=0;
    	this.txtCombo.text = "Combo:"+this.combo+"x";
    	this.txtComboO.text = "Combo:"+this.combo+"x";
    };

    LevelHUD.prototype.lowerCombo = function() {
    	this.updateCombo((-this.combo)+1);
    };

    LevelHUD.prototype.restart = function() {
    	this.combo = 1;
    	this.score = 0;
    };

    window.LevelHUD = LevelHUD;
}());