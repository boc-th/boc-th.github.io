/**
 * ゲームのプレイ処理
 */
class Play{
    constructor(){
        this.player = characters[0];
    }

    //メイン処理
    run(){
        characters.forEach(character => character.move()); //各キャラのマップの移動を行う
        g_cameraMapOffsetX = this.getCameraMapOffsetX(map.width,this.player.mapOffsetX);
        g_cameraMapOffsetY = this.getCameraMapOffsetY(map.height,this.player.mapOffsetY);
        this.draw();
        // console.log(this.player.mapOffsetX+':'+this.player.mapOffsetY);
    }

    draw(){
        ctx.clearRect(0,0,controller.canvasWidth,controller.canvasHeight); //canvas初期化.
        map.draw(g_cameraMapOffsetX,g_cameraMapOffsetY); // マップ描画
        characters.forEach(character => character.draw(g_cameraMapOffsetX,g_cameraMapOffsetY)); //各キャラのマップの描画を行う
    }

    getCameraMapOffsetX(mapWidth,playerOffsetX){
        var x = playerOffsetX+g_chipSize - (g_canvasW/2);
        if(x<0) x = 0;
        if(x>(mapWidth - g_canvasW)) x = mapWidth-g_canvasW;

        return x;
    }

    getCameraMapOffsetY(mapHeight,playerOffsetY){
        var y = playerOffsetY+g_chipSize - (g_canvasH/2);
        if(y<0) y = 0;
        if(y>(mapHeight - g_canvasH)) y = mapHeight-g_canvasH;

        return y;
    }
}