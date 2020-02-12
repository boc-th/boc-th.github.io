/**
 * 操作キャラクタークラス
 * 
 * ステージ：高さ12マス，横適当
 * 
 * キャラの位置が，キャンバスの幅の半分を超えたら，マップスクロールに切り替え
 */

 class Mariko{
     constructor(){
         this.img = new Image();
         this.img.src = 'img/bou.PNG'; //キャラの画像
         this.size = g_chipSize; //キャラのサイズ
         this.pixel = 128; //キャラの一枚のピクセル数
         this.actions={
             jump:this.pixel*4,
             walk:this.pixel*1,
             fall:this.pixel*5,
             stay:0,
         }

         this.InitialMapOffsetY = this.size*10; //キャラの初期マップ座標Y
         this.InitialMapOffsetX = this.size*1; //キャラの初期マップ座標X
         this.mapOffsetX = this.InitialMapOffsetX; //プレーヤーのマップx座標
         this.mapOffsetY = this.InitialMapOffsetY //プレーヤーのマップy座標
         this.canvasOffsetX; //プレイヤーキャンバス座標X
         this.canvasOffsetY; //プレイヤーキャンバス座標Y

         this.movement; //移動量
         this.normalSpead = this.size/10; //ノーマルスピード
         this.dashSpead = this.normalSpead*2; //ダッシュスピード
         this.fallSpead = this.size/10; //落下スピード
         this.direction = this.pixel*0; //0が右,1が左向き
         this.action=0; //アクション
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

     draw(cameraOffsetX,cameraOffsetY){
        //キャンバスにおけるプレイヤーの描画X座標
        this.canvasOffsetX = this.mapOffsetX - cameraOffsetX;
        //キャンバスにおけるプレイヤーの描画Y座標
        this.canvasOffsetY = this.mapOffsetY - cameraOffsetY;

        ctx.drawImage(this.img, this.action, this.direction, this.pixel, this.pixel, this.canvasOffsetX, this.canvasOffsetY, this.size, this.size);
     }


     moveX(){
        this.stayFlg=false;
        //ダッシュ処理
        if(g_shiftPush || game.flg['c']){
            this.movement = this.dashSpead; 
            this.actionCntSpead = 2;
        }
        else{
           this.movement = this.normalSpead; 
           this.actionCntSpead = 1;
        }

        
        //移動方向
        if(g_dPush || game.flg['right']){
            this.direction=this.pixel*0; //方向
        }
        else if(g_aPush || game.flg['left']){
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
        if((g_enterPush || game.flg['b']) && this.jumpFlg){
            //フラグ状態変化（ジャンプ中）
            this.jumpFlg = false;
            this.fallFlg = false;
            this.t = 0;
            console.log('t-j');
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
                console.log('j-f');
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
            this.action=this.actions.stay;
            this.actionCnt = this.walkSpead;
            return;
        }
        
         //ジャンプ中
         if(!this.jumpFlg&&!this.fallFlg){
            this.action=this.actions.jump;
            this.actionCnt = this.walkSpead;
            return;
         }

         //落下
         if(!this.jumpFlg&&this.fallFlg){
             this.action=this.actions.fall;
             this.actionCnt=this.walkSpead;
             return;
         }

         //地上
         if(this.actionCnt>=this.walkSpead*3) this.actionCnt=0; //walkSpead*画像枚数
         this.action = this.actions.walk+(Math.floor(this.actionCnt/this.walkSpead))*this.pixel;
     }
 }