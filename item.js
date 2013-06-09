(function(){
    var Item = function() {
      this.initialize();
    }

    var p = Item.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();        

        this.image = new createjs.Bitmap("assets/images/power_up.png");  		
  		this.addChild(this.image);

  		this.isItem = true;
  		this.isMoving = true;
    }

    Item.prototype.create = function(line,column,levelGrid) {
    	this.line = line;
       	this.column = column;
       	this.width = 32;//blockType.w;
       	this.height = 32;//blockType.h;       	
       	this.x = 32*this.column;
       	this.y = 32*this.line;

        levelGrid[0][column] = {status:GridStatusEnum.ITEM,element:this};
        levelGrid[1][column] = {status:GridStatusEnum.ITEM,element:this};
    };

    Item.prototype.use = function() {
    	createjs.Tween.get(this).to({alpha:0}, 150);
        createjs.Tween.get(this).wait(150).to({alpha:1}, 150).call(onComplete);
        function onComplete(){
            createjs.Tween.get(this).to({alpha:0}, 150).call(usedClearPowerUp);
        }
    };

    Item.prototype.spend = function(levelGrid) {
    	levelGrid[this.line][this.column] = {status:GridStatusEnum.FREE,element:null};
    	levelGrid[this.line+1][this.column] = {status:GridStatusEnum.FREE,element:null};
    	this.parent.removeChild(this);
    	this.parent = null;
    };

    Item.prototype.moveOnGrid = function(levelGrid) {
    	levelGrid[this.line][this.column] = {status:GridStatusEnum.FREE,element:null};
	    levelGrid[this.line][this.column] = {status:GridStatusEnum.FREE,element:null};    	
	    this.move();                    
	    levelGrid[this.line][this.column] = {status:GridStatusEnum.ITEM,element:this};
    	levelGrid[this.line][this.column] = {status:GridStatusEnum.ITEM,element:this};
    };

    Item.prototype.move = function() {
    	this.line++;    	    
    	this.y = this.line*this.height;  
    };

    window.Item = Item;
}());