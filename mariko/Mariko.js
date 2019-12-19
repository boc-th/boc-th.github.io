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
         this.img.src = 'img/main.png'; //キャラの画像
         this.size = canvasH/12; //キャラのサイズ
         this.offsetY = canvasH-(this.size*3); //キャラの位置Y
         this.offsetX = this.size; //キャラの位置X
         this.spead = 8; //移動スピード
         this.direction = 32; //32が右,0が左向き
         this.action=0; //アクション
         this.actionCnt = 0; //この値が一定数を超えたらアクションする
         this.actionCntSpead;
         this.movement = this.offsetX; //x方向の移動量
         this.mapScroll = 0; //マップスクロール量
     }

     draw(){
        this.img.src = 'img/main.png';
        ctx.drawImage(this.img, this.action, this.direction, 32, 32, this.offsetX, this.offsetY, this.size, this.size);
     }

     move(){
        if(g_spacePush || game.flg['b']){
            this.spead = 20; 
            this.actionCntSpead = 2;
        }
        else{
           this.spead = 8; 
           this.actionCntSpead = 1;
        } 

        if(g_rightPush || game.flg['right']){
            this.direction=32; //方向

            if(this.movement > canvasW/2) this.mapScroll = this.spead; //マップ移動
            else this.offsetX += this.spead; //キャラ移動  

            this.movement +=this.spead; //移動量
            if(this.actionCnt >= 12){
                if(this.action==32) this.action=0;
                else if(this.action==0) this.action=32;   
                this.actionCnt = 0;             
            }else{
                this.actionCnt+=this.actionCntSpead;
            }
        }
        else if(g_leftPush || game.flg['left']){
            this.direction=0; //方向

            if(this.movement > canvasW/2) this.mapScroll = -this.spead; // マップ移動
            else this.offsetX -= this.spead; //キャラ移動

            this.movement -= this.spead; //移動量
            if(this.actionCnt >= 12){
                if(this.action==32) this.action=0;
                else if(this.action==0) this.action=32;   
                this.actionCnt = 0;             
            }else{
                this.actionCnt+=this.actionCntSpead;
            }
        }
        else{
            this.mapScroll = 0;
        }
     }
 }