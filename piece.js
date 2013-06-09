(function(){
    var Piece = function(blockType) {
      this.initialize(blockType);
    }

    var p = Piece.prototype = new createjs.Container();
     
    p.Container_initialize = p.initialize;
    p.initialize = function(blockType) { 
        this.Container_initialize();

        this.blockType = blockType;
        this.points = blockType.points;
        this.shouldRemove = false;
    }

    Piece.prototype.getMaxColumnForBlock = function(column,gridColumns) {
        if(this.blockType == BlockTypeEnum.SQUARE){
            if(column==gridColumns-1){
                return column-1;
            }
        }
        else if(this.blockType == BlockTypeEnum.T){
            if(column==gridColumns-1){
                return column-2;
            }
        }
        else if(this.blockType == BlockTypeEnum.S){
            if(column==gridColumns-1){
                return column-2;
            }
        }
        else if(this.blockType == BlockTypeEnum.Z){
            if(column==gridColumns-1){
                return column-2;
            }
        }
        else if(this.blockType == BlockTypeEnum.L){
            if(column==gridColumns-1){
                return column-1;
            }
        }
        else if(this.blockType == BlockTypeEnum.RL){
            if(column==gridColumns-1){
                return column-1;
            }
        }
        return column;
    };

    Piece.prototype.create = function(column,levelGrid) {
    	if(this.blockType == BlockTypeEnum.SQUARE){

            this.createBlock(0,column,levelGrid);    
            this.createBlock(0,column+1,levelGrid);    
            this.createBlock(1,column,levelGrid);
            this.createBlock(1,column+1,levelGrid);
    	}
        else if(this.blockType == BlockTypeEnum.LINE){
            for (var i = 0; i < 4; i++) {
                this.createBlock(i,column,levelGrid);    
            };
        }
        else if(this.blockType == BlockTypeEnum.T){

            this.createBlock(0,column+1,levelGrid);
            this.createBlock(1,column,levelGrid);    
            this.createBlock(1,column+1,levelGrid);
            this.createBlock(1,column+2,levelGrid);            
        }
        else if(this.blockType == BlockTypeEnum.S){

            this.createBlock(0,column+1,levelGrid);
            this.createBlock(0,column+2,levelGrid);    
            this.createBlock(1,column,levelGrid);
            this.createBlock(1,column+1,levelGrid);            
        }
        else if(this.blockType == BlockTypeEnum.Z){

            this.createBlock(1,column+1,levelGrid);
            this.createBlock(1,column+2,levelGrid);    
            this.createBlock(0,column,levelGrid);
            this.createBlock(0,column+1,levelGrid);            
        }
        else if(this.blockType == BlockTypeEnum.L){

            this.createBlock(2,column,levelGrid);
            this.createBlock(1,column,levelGrid);    
            this.createBlock(0,column,levelGrid);
            this.createBlock(0,column+1,levelGrid);            
        }
        else if(this.blockType == BlockTypeEnum.RL){

            this.createBlock(0,column,levelGrid);
            this.createBlock(0,column+1,levelGrid);    
            this.createBlock(1,column+1,levelGrid);
            this.createBlock(2,column+1,levelGrid);            
        }
    };

    Piece.prototype.canCreate = function(column,levelGrid) {
        if(this.blockType == BlockTypeEnum.SQUARE){
            return levelGrid[1][column].status == GridStatusEnum.FREE && levelGrid[1][column].status == GridStatusEnum.FREE &&
                levelGrid[0][column].status == GridStatusEnum.FREE && levelGrid[0][column].status == GridStatusEnum.FREE;
        }
        else if(this.blockType == BlockTypeEnum.LINE){
            var canCreate = true;
            for (var line = 0; line < 4; line++) {
                canCreate = canCreate && levelGrid[line][column].status == GridStatusEnum.FREE;
            };
            return canCreate;            
        }
        else if(this.blockType == BlockTypeEnum.T){
            if(levelGrid[1][column] == null || levelGrid[1][column+1] == null || levelGrid[0][column+1] == null ||
                levelGrid[1][column+2] == null)
                return false;

            return levelGrid[1][column].status == GridStatusEnum.FREE && levelGrid[1][column+1].status == GridStatusEnum.FREE &&
                levelGrid[1][column+2].status == GridStatusEnum.FREE && levelGrid[0][column+1].status == GridStatusEnum.FREE;
        }
        else if(this.blockType == BlockTypeEnum.S){
            if(levelGrid[1][column] == null || levelGrid[1][column+1] == null || levelGrid[0][column+2]  == null ||
                levelGrid[0][column+1] == null)
                return false;

            return levelGrid[1][column].status == GridStatusEnum.FREE && levelGrid[1][column+1].status == GridStatusEnum.FREE &&
                levelGrid[0][column+1].status == GridStatusEnum.FREE && levelGrid[0][column+2].status == GridStatusEnum.FREE;
        }
        else if(this.blockType == BlockTypeEnum.Z){
            if(levelGrid[0][column] == null || levelGrid[0][column+1] == null || levelGrid[1][column+1] == null ||
                levelGrid[1][column+2] == null)
                return false;

            return levelGrid[0][column].status == GridStatusEnum.FREE && levelGrid[0][column+1].status == GridStatusEnum.FREE &&
                levelGrid[1][column+1].status == GridStatusEnum.FREE && levelGrid[1][column+2].status == GridStatusEnum.FREE;
        }
        else if(this.blockType == BlockTypeEnum.L){
            return levelGrid[2][column].status == GridStatusEnum.FREE && levelGrid[1][column].status == GridStatusEnum.FREE &&
                levelGrid[0][column].status == GridStatusEnum.FREE && levelGrid[0][column+1].status == GridStatusEnum.FREE;
        }
        else if(this.blockType == BlockTypeEnum.RL){
            return levelGrid[0][column].status == GridStatusEnum.FREE && levelGrid[0][column+1].status == GridStatusEnum.FREE &&
                levelGrid[1][column+1].status == GridStatusEnum.FREE && levelGrid[2][column+1].status == GridStatusEnum.FREE;
        }
        return true;
    };

    Piece.prototype.createBlock = function(line,column,levelGrid) {
        var block = new Block(column,line,this.blockType.img);                 
        this.addChild(block);
        levelGrid[line][column] = {status:GridStatusEnum.BLOCK,element:block};
    };

    Piece.prototype.removeBlocks = function(levelGrid) {
        for (var i = 0; i < this.children.length; i++) {
            var block = this.children[i];
            levelGrid[block.line][block.column] = {status:GridStatusEnum.FREE,element:null};
        };        
    };

    Piece.prototype.blink = function() {
        createjs.Tween.get(this).to({alpha:0}, 150);
        createjs.Tween.get(this).wait(150).to({alpha:1}, 150).call(onComplete);
        function onComplete(){
            createjs.Tween.get(this).to({alpha:0}, 150).call();
        }
        
    };



    window.Piece = Piece;
}());