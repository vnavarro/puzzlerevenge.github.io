(function(){
    var Block = function(column,line,imgName) {
      this.initialize(column,line,imgName);
    }

    var p = Block.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function(column,line,imgName) { 
        this.Container_initialize();

        this.line = line;
       	this.column = column;
       	this.width = 32;//blockType.w;
       	this.height = 32;//blockType.h;       	
       	this.x = 32*this.column;
       	this.y = 32*this.line;

       	this.isMoving = true;
       	this.shouldRemove = false;
       	this.rotation = 0;

		this.image = new createjs.Bitmap(imgName);  		
  		this.addChild(this.image);

		// var shape = new createjs.Shape();
  //       var red = Math.floor(Math.random()*255);
  //       var green= Math.floor(Math.random()*255);
  //       var blue = Math.floor(Math.random()*255);
  //       shape.graphics.beginFill("rgba("+red+","+green+","+blue+",0.5)")
	 //        .drawRect(0,0, this.width, this.height);
  //       	//.drawRect(this.width*this.column, this.height*this.line, this.width, this.height);
  //       this.addChild(shape);     		
    }

    Block.prototype.move = function() {
    	this.line++;    	    
    	this.y = this.line*this.height;  
    	// this.isMoving = true;  	
    };

    Block.prototype.moveBack = function() {
    	this.line--;    	    
    	this.y = this.line*this.height;  
    	// this.isMoving = true;  	
    };

    window.Block = Block;
}());