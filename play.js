/**
 * ゲームのプレイ処理
 */
class Play{
    constructor(){
        this.mariko = new Mariko();
        this.map = new Map();
    }

    //メイン処理
    run(){
        this.move();
        g_cameraMapOffsetX = this.getCameraMapOffsetX(this.map.width,this.mariko.mapOffsetX);
        g_cameraMapOffsetY = this.getCameraMapOffsetY(this.map.height,this.mariko.mapOffsetY);
        this.draw();
    }

    draw(){
        ctx.clearRect(0,0,game.canvasWidth,game.canvasHeight); //canvas初期化.
        this.map.draw(g_cameraMapOffsetX,g_cameraMapOffsetY);
        this.mariko.draw(g_cameraMapOffsetX,g_cameraMapOffsetY);
    }

    move(){
        this.mariko.moveY();
        this.adjustmentPlayserY();
        this.mariko.moveX(this.map.mapSizeWidth);
        if(!this.mariko.stayFlg) this.adjustmentPlayserX();
        this.mariko.selectAction();
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

    //プレイヤーの座標からマップの衝突判定し，x座標を調整
    adjustmentPlayserX(){
        //マップの衝突判定
        //水平
        var offset = this.map.horizontalCollision(this.mariko.mapOffsetX,this.mariko.mapOffsetY);
        this.mariko.mapOffsetX = offset.x;
    }

    //y座標を調整，ジャンプ・落下フラグの確認
    adjustmentPlayserY(){

        /**
         * フラグ状態
         * 
         *     ↑
         * ・地上........j:1,f:1
         *   ↓ ↑
         * ・落下........j:0,f:1
         *     ↑
         * ・ジャンプ中...j:0,f:0
         * 
         * フラグ変更点
         * ・落下開始...offset.y==mapOffsetY =>j=0,f=1
         *   |-ブロックに頭上衝突...j=0&&f==0 offset.y>mapOffsetY =>同上
         *   |-ジャンプが最高点に達した ...Mariko.jump()で管理 =>同上
         * ・ジャンプ開始...キーが押されたら  =>j=0,f=0
         * ・接地...offset.y<mapOffsetY    =>j=1,f=1
         * 
         * offset.y==mapOffsetの時，空中(ジャンプ中か落下中)にいる 
         */

        var offset = this.map.verticalCollision(this.mariko.mapOffsetX,this.mariko.mapOffsetY);
        var j=this.mariko.jumpFlg;
        var f=this.mariko.fallFlg;
        var mapOffsetY = this.mariko.mapOffsetY;
        //プレイヤーの状態
        if(j&&f){
            //地上
            //->落下
            this.mariko.t=0;
            if(mapOffsetY == offset.y){
                console.log('t-f');
                this.mariko.jumpFlg=0;
            } 
            //->ジャンプ...キー操作で遷移
        }
        else if(!j&&f){
            //落下中
            // console.log(9);
            //->地上...接地
            if(offset.y<mapOffsetY){
                console.log('f-t');
                this.mariko.jumpFlg=1;
                this.mariko.t=0;
            }
            //->ジャンプ中...無し
        }
        else if(!j&&!f){
            //ジャンプ中
            //->落下...頭ぶつけるor最高点(別で処理)
            if(offset.y>mapOffsetY){
                console.log('j-f');
                this.mariko.fallFlg=1;
                this.mariko.t=0;
            }
            //->地上...無し
        }

        //座標更新
        this.mariko.mapOffsetY = offset.y;
    }
}