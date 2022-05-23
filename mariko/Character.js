/**
 * １．移動前後の座標を保持するように修正．今はMapのex_x,ex_yに保存している
 */

class Character{
    constructor(img_src,InitialMapOffset,status){
        this.status = status; //player,enemy,friend,death     
        
        this.img = new Image();
        this.img.src = img_src; //キャラの画像
        this.size = g_chipSize; //キャラのサイズ
        this.pixel = 128; //キャラの一枚のピクセル数
        this.actionPoints={
            jump:this.pixel*4,
            walk:this.pixel*1,
            fall:this.pixel*5,
            stay:0,
        }

        this.InitialMapOffsetY = this.size*InitialMapOffset[1]; //キャラの初期マップ座標Y (画面左上が原点)
        this.InitialMapOffsetX = this.size*InitialMapOffset[0]; //キャラの初期マップ座標X
        this.mapOffsetX_ex = this.InitialMapOffsetX; //プレーヤーのマップx座標（保存用）
        this.mapOffsetY_ex = this.InitialMapOffsetY; //プレーヤーのマップy座標（保存用）
        this.mapOffsetX = this.InitialMapOffsetX; //プレーヤーのマップx座標
        this.mapOffsetY = this.InitialMapOffsetY; //プレーヤーのマップy座標
        this.canvasOffsetX; //プレイヤーキャンバス座標X
        this.canvasOffsetY; //プレイヤーキャンバス座標Y

        this.movement; //移動量
        this.normalSpead = this.size/10; //ノーマルスピード
        this.dashSpead = this.normalSpead*2; //ダッシュスピード
        this.fallSpead = this.size/10; //落下スピード
        this.direction = this.pixel*0; //0が右,1が左向き
        this.actionPoint = 0; //画像のアクションの切り抜き位置
        this.actionCnt = 0; //この値が一定数を超えたらアクションする
        this.actionCntSpead;
        this.walkSpead = 8;
        this.stayFlg=true;

        this.y = 0;  //y変化量
        this.pre_y=0; 
        this.t = 0; //フレームカウンタ
        this.y_max = this.size*3.5; //ジャンプの最大到達点
        this.t_max = 20; //ジャンプ時間 60f=1s
        this.a = -this.y_max/(this.t_max*this.t_max); //係数
        this.addY=0; //Y座標加算値

        this.jumpFlg = true; //ジャンプフラグ
        this.fallFlg = true; //落下フラグ
    }

    move(){
        this.moveY();
        this.adjustmentPlayserY();

        this.moveX();
        if(!this.stayFlg) this.adjustmentPlayserX();
        this.selectAction();
    }

    adjustmentPlayserX(){
        //マップの衝突判定
        //水平
        var offset = map.horizontalCollision(this.mapOffsetX,this.mapOffsetY,this.mapOffsetX_ex);
        this.mapOffsetX = offset.x;
        this.mapOffsetX_ex = offset.x;
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
         *   |-ジャンプが最高点に達した ...jump()で管理 =>同上
         * ・ジャンプ開始...キーが押されたら  =>j=0,f=0
         * ・接地...offset.y<mapOffsetY    =>j=1,f=1
         * 
         * offset.y==mapOffsetの時，空中(ジャンプ中か落下中)にいる 
         */

        var offset = map.verticalCollision(this.mapOffsetX,this.mapOffsetY,this.mapOffsetY_ex);
        var j=this.jumpFlg;
        var f=this.fallFlg;
        var mapOffsetY = this.mapOffsetY;
        //プレイヤーの状態
        if(j&&f){
            //地上
            //->落下
            this.t=0;
            if(mapOffsetY == offset.y){
                this.jumpFlg=0;
            } 
            //->ジャンプ...キー操作で遷移
        }
        else if(!j&&f){
            //落下中
            // console.log(9);
            //->地上...接地
            if(offset.y<mapOffsetY){
                this.jumpFlg=1;
                this.t=0;
            }
            //->ジャンプ中...無し
        }
        else if(!j&&!f){
            //ジャンプ中
            //->落下...頭ぶつけるor最高点(別で処理)
            if(offset.y>mapOffsetY){
                this.fallFlg=1;
                this.t=0;
            }
            //->地上...無し
        }

        //座標更新
        this.mapOffsetY = offset.y;
        this.mapOffsetY_ex = offset.y;
    }

    moveX(){
        this.stayFlg=false;
        //ダッシュ処理
        if(g_shiftPush || controller.flg['c']){
            this.movement = this.dashSpead; 
            this.actionCntSpead = 2;
        }
        else{
           this.movement = this.normalSpead; 
           this.actionCntSpead = 1;
        }

        
        //移動方向
        if(g_dPush || controller.flg['right']){
            this.direction=this.pixel*0; //方向
        }
        else if(g_aPush || controller.flg['left']){
            this.direction=this.pixel*1; //方向
            this.movement = -this.movement; //移動量
        }
        else{
            if(this.fallFlg&&this.jumpFlg) this.stayFlg=true;
            return; //押されてなかったら離脱
        }

        //マップ座標更新
        this.mapOffsetX += this.movement;

        //アクションカウンタ
        this.actionCnt+=this.actionCntSpead;

     }

     moveY(){
        
        //ジャンプ発火
        if((g_enterPush || controller.flg['b']) && this.jumpFlg){
            //フラグ状態変化（ジャンプ中）
            this.jumpFlg = false;
            this.fallFlg = false;
            this.t = 0;
        }
        
        //ジャンプ処理
        if(!this.jumpFlg && !this.fallFlg){
            this.t++;
            this.y = this.a*(this.t-this.t_max)*(this.t-this.t_max)+this.y_max;
            this.pre_y=this.a*((this.t-1)-this.t_max)*((this.t-1)-this.t_max)+this.y_max;
            this.addY = this.y-this.pre_y;
            this.mapOffsetY -= this.addY;
            if(this.mapOffsetY<0) this.mapOffsetY=0;

            if((this.t>=this.t_max)||(this.mapOffsetY<=0)){
                this.fallFlg = true;
                this.t=0; 
            }
        }

        //落下処理
        if(this.fallFlg){
            if(this.t<=this.t_max) this.t++;
            this.y=this.a*this.t*this.t+this.y_max;
            this.pre_y=this.a*(this.t-1)*(this.t-1)+this.y_max; 
            this.addY=this.pre_y-this.y;
            this.mapOffsetY += this.addY;
        }
     }

     selectAction(){
        //ステイ
        if(this.stayFlg){
            this.actionPoint =this.actionPoints.stay;
            this.actionCnt = this.walkSpead;
            return;
        }
        
         //ジャンプ中
         if(!this.jumpFlg&&!this.fallFlg){
            this.actionPoint = this.actionPoints.jump;
            this.actionCnt = this.walkSpead;
            return;
         }

         //落下
         if(!this.jumpFlg&&this.fallFlg){
             this.actionPoint = this.actionPoints.fall;
             this.actionCnt = this.walkSpead;
             return;
         }

         //地上
         if(this.actionCnt>=this.walkSpead*3) this.actionCnt=0; //walkSpead*画像枚数
         this.actionPoint = this.actionPoints.walk+(Math.floor(this.actionCnt/this.walkSpead))*this.pixel;
     }

     draw(cameraOffsetX,cameraOffsetY){
        //キャンバスにおけるプレイヤーの描画X座標
        this.canvasOffsetX = this.mapOffsetX - cameraOffsetX;
        //キャンバスにおけるプレイヤーの描画Y座標
        this.canvasOffsetY = this.mapOffsetY - cameraOffsetY;

        ctx.drawImage(this.img, this.actionPoint, this.direction, this.pixel, this.pixel, this.canvasOffsetX, this.canvasOffsetY, this.size, this.size);
     }
}