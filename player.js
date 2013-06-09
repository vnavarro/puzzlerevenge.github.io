(function(){
    var Player = function() {
      this.initialize();
    }

    var p = Player.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function() { 
        this.Container_initialize();

        this.width = 64;
        this.height = 96;

        this.line = 6;
        this.column = 4;

        this.x = 32*this.column;
        this.y = 32*this.line + 64;         

        var spriteSheet = new createjs.SpriteSheet({
        "animations": {
            "standing": [16, 22,"standing",6],
            "left": [8, 13,"standing"],
            "right": [0, 5,"standing"],
            "attack": [24, 31,"standing",2],
        }, 
        "images": ["assets/images/sprite_sheet_01.png"],
         "frames": { "width": 108, "height": 107, "count": 32}
        });
        this.bitmap = new createjs.BitmapAnimation(spriteSheet);
        this.bitmap.x -= 22.5;
        this.bitmap.y -= 12;
    
        this.bitmap.gotoAndPlay("standing");
        this.addChild(this.bitmap);


        // var shape = new createjs.Shape();
        // var red = Math.floor(Math.random()*255);
        // var green= Math.floor(Math.random()*255);
        // var blue = Math.floor(Math.random()*255);
        // // console.log("rgba("+red+","+green+","+blue+",1)");
        // shape.graphics.beginFill("rgba("+red+","+green+","+blue+",0.5)").drawRect(0, 0, 64, 96);
        // this.addChild(shape); 
    }

    Player.prototype.moveLeft = function(levelGrid) {
        console.log("LEFT");
        if(this.column == 0) return false;
        if(!this.canMoveLeft(levelGrid)) return false;
        this.column--;
        this.x = 32*this.column;
        // this.column--;
        // this.x = 32*this.column;

        this.oldColumn = stage.player.column+1;

        this.bitmap.gotoAndPlay("left");
        return true;
    };

    Player.prototype.moveRight = function(levelGrid) {
        console.log("RIGHT");
        if(this.column == 8) return false;
        if(!this.canMoveRight(levelGrid)) return false;
        this.column++;
        this.x = 32*this.column;
        // this.column++;
        // this.x = 32*this.column;

        this.oldColumn = stage.player.column-1;

        this.bitmap.gotoAndPlay("right");
        return true;
    };

    Player.prototype.canMoveLeft = function (levelGrid) {
        return (levelGrid[this.line][this.column-1].status == GridStatusEnum.FREE && 
            levelGrid[this.line+1][this.column-1].status == GridStatusEnum.FREE && 
            levelGrid[this.line+2][this.column-1].status == GridStatusEnum.FREE) ||
            (levelGrid[this.line][this.column-1].status == GridStatusEnum.ITEM || 
            levelGrid[this.line+1][this.column-1].status == GridStatusEnum.ITEM ||
            levelGrid[this.line+2][this.column-1].status == GridStatusEnum.ITEM);
    }

    Player.prototype.canMoveRight = function (levelGrid) {

        return (levelGrid[this.line][this.column+2].status == GridStatusEnum.FREE &&              
            levelGrid[this.line+1][this.column+2].status == GridStatusEnum.FREE && 
            levelGrid[this.line+2][this.column+2].status == GridStatusEnum.FREE) ||
                        (levelGrid[this.line+1][this.column+2].status == GridStatusEnum.ITEM ||
                        levelGrid[this.line][this.column+2].status == GridStatusEnum.ITEM ||
            levelGrid[this.line+2][this.column+2].status == GridStatusEnum.ITEM);
    }

    Player.prototype.attack = function() {
        this.bitmap.gotoAndPlay("attack");
        gSound.playSound("sfxa");
    };

    Player.prototype.cleanRight = function(levelGrid) {
        if(this.column+2 < levelGrid[this.line].length){
            if(levelGrid[this.line][this.column+2].status== GridStatusEnum.PLAYER){
                levelGrid[this.line][this.column+2] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+1][this.column+2] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+2][this.column+2] = {status:GridStatusEnum.FREE,element:null};
            }
        }
        if(this.column+3 < levelGrid[this.line].length){
            if(levelGrid[this.line][this.column+3].status== GridStatusEnum.PLAYER){
                levelGrid[this.line][this.column+3] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+1][this.column+3] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+2][this.column+3] = {status:GridStatusEnum.FREE,element:null};
            }
        }
    };

    Player.prototype.cleanLeft = function(levelGrid) {
        if(this.column-1 > 0){
            if(levelGrid[this.line][this.column-1].status== GridStatusEnum.PLAYER){
                levelGrid[this.line][this.column-1] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+1][this.column-1] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+2][this.column-1] = {status:GridStatusEnum.FREE,element:null};
            }
        }
        if(this.column-2 > 0){
            if(levelGrid[this.line][this.column-2].status== GridStatusEnum.PLAYER){
                levelGrid[this.line][this.column-2] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+1][this.column-2] = {status:GridStatusEnum.FREE,element:null};
                levelGrid[this.line+2][this.column-2] = {status:GridStatusEnum.FREE,element:null};
            }
        }
    };

    Player.prototype.restart = function() {
        this.line = 6;
        this.column = 4;

        this.x = 32*this.column;
        this.y = 32*this.line + 64;         
    };

    window.Player = Player;
}());