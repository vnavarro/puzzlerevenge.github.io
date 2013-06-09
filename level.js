(function(){	

    var Level = function(player) {
      this.initialize(player);
    }

    var p = Level.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function(player) { 
        this.Container_initialize();

        this.y = 64;
        this.player = player;
        this.shouldUpdatePlayer = false;

        this.timeToNextBlock = 4;
        this.speedNextBlock = 1000;
        this.timeConsumed = 0;
        this.timeSinceLastUpdate = createjs.Ticker.getTime(false)/this.speedNextBlock;

        this.movementTime = 1;        
        this.speed = 1000;
        this.timeConsumedSpeed = 0;
        this.timeSinceLastUpdateSpeed = createjs.Ticker.getTime(false)/this.speed;

        this.itemTime = 45;        
        this.itemTimeSpeed = 1000;
        this.timeConsumedItem = 0;
        this.timeSinceLastUpdateItem = createjs.Ticker.getTime(false)/this.itemTimeSpeed;

        this.clock = 0;
        this.timeSinceLastUpdateClock = createjs.Ticker.getTime(false)/1000;


        this.gridLines = 13;
        this.gridColumns = 10;
        this.gridSize = 32;
        this.levelGrid = new Array();
        for (var line = 0; line < this.gridLines ; line++) {
            this.levelGrid[line] = new Array(this.gridColumns);
        	for (var column = 0; column < this.gridColumns ; column++) {
        		this.levelGrid[line][column] = {status:GridStatusEnum.FREE,element:null};
        	}
        };

        this.newPlayerPosition();

        this.image = new createjs.Bitmap("assets/images/FLOOR.png");          
        this.addChild(this.image);

        //test grid
        // this.showGrid();

        // this.generateBlock();s
    }

    Level.prototype.updatePlayerPosition = function(oldline,oldcolumn) {
        // this.levelGrid[oldline][oldcolumn] = {status:GridStatusEnum.FREE,element:null};
        // this.levelGrid[oldline+1][oldcolumn] = {status:GridStatusEnum.FREE,element:null};
        // this.levelGrid[oldline+2][oldcolumn] = {status:GridStatusEnum.FREE,element:null};
        // this.levelGrid[oldline][oldcolumn+1] = {status:GridStatusEnum.FREE,element:null};
        // this.levelGrid[oldline+1][oldcolumn+1] = {status:GridStatusEnum.FREE,element:null};
        // this.levelGrid[oldline+2][oldcolumn+1] = {status:GridStatusEnum.FREE,element:null};

        this.player.cleanLeft(this.levelGrid);
        this.player.cleanRight(this.levelGrid);

        this.newPlayerPosition();
    };

    Level.prototype.newPlayerPosition = function() {
        console.log(this.player.line,this.player.column);
        this.levelGrid[this.player.line][this.player.column] = {status:GridStatusEnum.PLAYER,element:this.player};
        this.levelGrid[this.player.line+1][this.player.column] = {status:GridStatusEnum.PLAYER,element:this.player};
        this.levelGrid[this.player.line+2][this.player.column] = {status:GridStatusEnum.PLAYER,element:this.player};
        this.levelGrid[this.player.line][this.player.column+1] = {status:GridStatusEnum.PLAYER,element:this.player};
        this.levelGrid[this.player.line+1][this.player.column+1] = {status:GridStatusEnum.PLAYER,element:this.player};
        this.levelGrid[this.player.line+2][this.player.column+1] = {status:GridStatusEnum.PLAYER,element:this.player};
    };

    Level.prototype.generateBlockType = function() {        
        var blockTypeCode = Math.floor(Math.random()*7);
        if (blockTypeCode ==  BlockTypeEnum.SQUARE.code){
            return BlockTypeEnum.SQUARE;
        }
        else if (blockTypeCode ==  BlockTypeEnum.LINE.code){
            return BlockTypeEnum.LINE;
        }
        else if (blockTypeCode ==  BlockTypeEnum.T.code){
            return BlockTypeEnum.T;
        }
        else if (blockTypeCode ==  BlockTypeEnum.S.code){
            return BlockTypeEnum.S;
        }
        else if (blockTypeCode ==  BlockTypeEnum.Z.code){
            return BlockTypeEnum.Z;
        }
        else if (blockTypeCode ==  BlockTypeEnum.L.code){
            return BlockTypeEnum.L;
        }
        else if (blockTypeCode ==  BlockTypeEnum.RL.code){
            return BlockTypeEnum.RL;
        }
    };

    Level.prototype.generateBlock = function() {
        var blockType = this.generateBlockType();
        var column = Math.floor(Math.random()*this.gridColumns);

        var piece = new Piece(blockType);

        column = piece.getMaxColumnForBlock(column,this.gridColumns);

        if(piece.canCreate(column,this.levelGrid)){            
            piece.create(column,this.levelGrid);
            this.addChild(piece);
        }
    };

    Level.prototype.placeItem = function() {
        if(Math.floor(Math.random()*2)==1) return;
        var column = Math.floor(Math.random()*this.gridColumns);
        if(this.levelGrid[1][column].status != GridStatusEnum.FREE && 
            this.levelGrid[0][column].status != GridStatusEnum.FREE){
            return;
        }
        this.item = new Item();        
        this.item.create(0,column,this.levelGrid);        
        this.addChild(this.item);
    };


    Level.prototype.moveBlocks = function() {        
        for (var line = 11; line >= 0 ; line--) {
            for (var column = 0; column < this.gridColumns ; column++) {
                var block = this.levelGrid[line][column].element;                
                if(block == null){
                    continue;
                }
                else if(!block.isMoving && !block.isItem){                    
                    if(block.line > this.player.line+2){
                        stage.levelHud.lowerCombo();
                    }
                    continue;
                }
                if(block.isItem && block.line<=this.player.line+2 && this.levelGrid[block.line+2][column].status == GridStatusEnum.FREE){
                    block.moveOnGrid(this.levelGrid);
                }
                else if(block.isItem && (block.line> this.player.line+2 || 
                    (this.levelGrid[block.line+2][column].status != GridStatusEnum.FREE && this.levelGrid[block.line+2][column].status != GridStatusEnum.PLAYER))) {
                    block.spend(this.levelGrid);
                }
                else if(this.levelGrid[block.line+1][column].status == GridStatusEnum.FREE){                    
                    this.levelGrid[line+1][column] = {status:(block.isItem)?GridStatusEnum.ITEM:GridStatusEnum.BLOCK,element:block};
                    block.move();                    
                    this.levelGrid[line][column] = {status:GridStatusEnum.FREE,element:null};
                }
                else if(this.levelGrid[block.line+1][column].status == GridStatusEnum.PLAYER && !block.isItem){
                    block.parent.shouldRemove = true;                
                    block.isMoving = false;                    
                    this.player.attack();                      
                }                
                else if(block.isItem && block.line+2 < this.gridLines && this.levelGrid[block.line+2][column].status == GridStatusEnum.PLAYER){         
                    block.isMoving = false;                    
                    block.use();
                }
                else{                    
                    if(block.isItem) continue;
                    block.isMoving = false;
                }

            }
        };
    };

    Level.prototype.removeBlocks = function() {
        for (var i = 0; i < this.children.length; i++) {
            if(this.children[i].shouldRemove){
                stage.levelHud.updateScore(this.children[i].points);                
                stage.levelHud.updateCombo(1);    
                this.children[i].removeBlocks(this.levelGrid);
                this.removeChild(this.children[i]);                                
                gSound.playSound("sfxe");
                // i--;
            }
        };
    };

    Level.prototype.update = function(){        

        if(currentGameState != GameStatesEnum.PLAYING) return;
        
        this.timeConsumed += (createjs.Ticker.getTime(false)/this.speedNextBlock)-this.timeSinceLastUpdate;        
        this.timeSinceLastUpdate = createjs.Ticker.getTime(false)/this.speedNextBlock;              


        this.timeConsumedSpeed += (createjs.Ticker.getTime(false)/this.speed)-this.timeSinceLastUpdateSpeed;      
        this.timeSinceLastUpdateSpeed = createjs.Ticker.getTime(false)/this.speed;  

        this.timeConsumedItem += (createjs.Ticker.getTime(false)/this.itemTimeSpeed)-this.timeSinceLastUpdateItem;      
        this.timeSinceLastUpdateItem = createjs.Ticker.getTime(false)/this.itemTimeSpeed; 

        this.clock += (createjs.Ticker.getTime(false)/1000)-this.timeSinceLastUpdateClock; 
        this.timeSinceLastUpdateClock = createjs.Ticker.getTime(false)/1000;                      

        if(this.timeConsumedItem >= this.itemTime){
            this.timeConsumedItem = 0;            
            this.placeItem();
        }         

        if(this.timeConsumed >= this.timeToNextBlock){            
            this.timeConsumed = 0;     
            this.generateBlock();
        }
        

        if(this.timeConsumedSpeed >= this.movementTime){
            this.timeConsumedSpeed = 0;
            if(this.shouldUpdatePlayer){
               this.shouldUpdatePlayer = false; 
               stage.level.updatePlayerPosition(this.player.line,this.player.oldColumn);
            }
            this.removeBlocks();
            this.moveBlocks();  
            this.removeBlocks();
        }

        if(Math.floor(this.clock)>60){
            this.clock = 0;

            if(this.timeToNextBlock - 0.2 > 1)
                this.timeToNextBlock -= 0.2;   
            if(this.speedNextBlock - 25 > 25) 
                this.speedNextBlock -= 25;

            if(this.speedNextBlock - 5 > 5) 
                this.speedNextBlock -= 5;
        }
        
        if(this.isGameOver()){ 
            currentGameState = GameStatesEnum.ENDED;
            if(stage.gameOver==null){
                var popOver = new GameOverOverlay();
                stage.gameOver = popOver;
                stage.addChild(stage.gameOver);
            }
            stage.gameOver.open(true);               
        }

    };

    Level.prototype.go = function() {
         window.setTimeout(function(){
            currentGameState = GameStatesEnum.PLAYING;
         },4000);        

         animateText("3",false,"#009FC7",onCompleteSeq1);
         animateText("3",true,"#03c",onCompleteSeq1);
        function onCompleteSeq1() {

            animateText("2",false,"#009FC7",onCompleteSeq2);
            animateText("2",true,"#03c",onCompleteSeq2);
        };
        function onCompleteSeq2() {
            animateText("1",false,"#009FC7",onCompleteSeq3);
            animateText("1",true,"#03c",onCompleteSeq3);
        };
        function onCompleteSeq3() {
            animateText("CUT!",false,"#FA0016",function(){});
            animateText("CUT!",true,"#000",function(){});
        };
    };

    function animateText (text,outline,color,onComplete) {        
        var txtCount = new createjs.Text(text,"150px Oval Single",color);
        txtCount.regX = txtCount.getMeasuredWidth()/2;
        txtCount.regY = txtCount.getMeasuredHeight()/2;
        txtCount.x = screen_width/2;
        txtCount.y = screen_height/2;        
        txtCount.alpha = 0;
        txtCount.scaleX = 0.1;
        txtCount.scaleY = 0.1;
        txtCount.outline = outline;
        stage.addChild(txtCount);
        createjs.Tween.get(txtCount).to({alpha:1, scaleX:1,scaleY:1}, 500).call(function () {
            createjs.Tween.get(txtCount).to({alpha:0, scaleX:1.5,scaleY:1.5}, 500).call(onComplete);
        });        
    }


    Level.prototype.isGameOver = function() {
        var line = 0;
        for (var column = 0; column < this.gridColumns; column++) {
            if (this.levelGrid[line+1][column].element == null) continue;
            else if(this.levelGrid[line][column].element == null) continue;
            if(this.levelGrid[line+1][column].element.isMoving) continue;  
            if(this.levelGrid[line+1][column].element.isItem) continue;
            // else if(this.levelGrid[line-1][column].element.isMoving) continue;
            // if((this.levelGrid[line+1][column].status == GridStatusEnum.BLOCK && this.levelGrid[line+1][column].element.isMoving == false)||
            //     (this.levelGrid[line][column].status == GridStatusEnum.BLOCK && this.levelGrid[line][column].element.isMoving == false)){
            return true;
            // }
        }
        return false;
    };

    Level.prototype.restart = function() {
        this.shouldUpdatePlayer = false;

        this.timeLimit = 120;
        this.levelTime  = 0;

        this.timeToNextBlock = 4;
        this.speedNextBlock = 1000;
        this.timeConsumed = 0;
        this.timeSinceLastUpdate = createjs.Ticker.getTime(false)/this.speedNextBlock;

        this.movementTime = 1;        
        this.speed = 1000;
        this.timeConsumedSpeed = 0;
        this.timeSinceLastUpdateSpeed = createjs.Ticker.getTime(false)/this.speed;

        this.clock = 0;
        this.timeSinceLastUpdateClock = createjs.Ticker.getTime(false)/1000;

        this.timeSinceLastUpdateItem = createjs.Ticker.getTime(false)/this.itemTimeSpeed;  

        for (var line = 0; line < this.gridLines ; line++) {
            for (var column = 0; column < this.gridColumns ; column++) {
                var piece = this.levelGrid[line][column];
                if(piece == null || piece.element == null || piece.element.parent.removeBlocks == null) continue;
                piece = piece.element.parent;
                piece.removeBlocks(this.levelGrid);                
                this.removeChild(piece);     
                this.levelGrid[line][column] = {status:GridStatusEnum.FREE,element:null};                
            }
        };

        this.newPlayerPosition();
    };

    Level.prototype.clearGrid = function() {
        for (var line = 0; line < this.gridLines ; line++) {
            for (var column = 0; column < this.gridColumns ; column++) {
                var piece = this.levelGrid[line][column];
                if(piece == null) continue;
                if(piece.element == null){
                    stage.levelHud.updateScore(2);
                    continue;
                }
                if(piece.element.parent.removeBlocks == null){
                  continue;  
                } 
                piece = piece.element.parent;
                piece.removeBlocks(this.levelGrid);                
                this.removeChild(piece);     
                this.levelGrid[line][column] = {status:GridStatusEnum.FREE,element:null};                
            }
        };        
    };


    Level.prototype.showGrid = function() {
        for (var line = 0; line < this.gridLines ; line++) {
            for (var column = 0; column < this.gridColumns ; column++) {
                var shape = new createjs.Shape();
                var pad = (line%2 || column%2)?50:0;
                var red = 200-pad;
                var green= 200-pad;
                var blue = 200-pad;
                shape.graphics.beginFill("rgba("+red+","+green+","+blue+",1)")
                    .drawRect(32*column, 32*line, 32, 32);
                this.addChild(shape);   
            }
        }
    };

    window.Level = Level;
}());

//
//
//
//
//Game Over Overlay Pop Over Class
//
(function(){
    var GameOverOverlay = function() {
      this.initialize();
    }

    var p = GameOverOverlay.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();

        this.alpha = 0;

        var shape = new createjs.Shape();
        shape.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, screen_width, screen_height);
        this.addChild(shape); 

        this.logo = new createjs.Bitmap("assets/images/game_over.png");
        this.logo.x = screen_width/2-239/2;
        this.logo.y = screen_height/4-207/2;
        this.addChild(this.logo);

        this.btnHome = new createjs.Bitmap("assets/images/btn_home.png");
        this.btnHome.x = screen_width/4-75/2;
        this.btnHome.y = screen_height/2+screen_height/4-74/2;
        this.btnRetry = new createjs.Bitmap("assets/images/btn_retry.png");
        this.btnRetry.x = screen_width/2 + screen_width/4-75/2;
        this.btnRetry.y = this.btnHome.y;

        this.btnHome.onPress = function (event) {
            this.parent.close(true,goBackToMenu());
        }

        this.btnRetry.onPress = function (event) {
             this.parent.close(true,retryGame());
        }

        this.addChild(this.btnHome);
        this.addChild(this.btnRetry);
    }

    GameOverOverlay.prototype.open  = function(animated,onComplete) {                
        gSound.stopSound("bgmin",true)
        gSound.playSound("bgmgo",true);
        gSound.playSound("sfxd");
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

    GameOverOverlay.prototype.close = function(animated,onComplete) {
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

    window.GameOverOverlay = GameOverOverlay;
}());