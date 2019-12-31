/**
 * tetris
 * onload 画面読み込み後に実行される関数
 * 
 * 命名規則
 * ・グローバル変数・・・g_globalValue
 * ・ローカル変数・・・・localValue
 * ・関数・・・・動詞＋名詞　getPoint
 *              get・・・返り値あり
 *              is・・・・フラグ判定
 * ・定数・・・・CONST_VALUE
 * 
 */

var game = new GameController();
game.run();

const CANVAS_HEIGHT = game.canvasHeight; //ステージ縦 y
const CANVAS_WIDTH = CANVAS_HEIGHT/2; //ステージ横ｘ
const MASS_NUM_Y = 20; //ｙ軸のマス数
const MASS_NUM_X = 10   //x軸のマス数
const MASS_SIZE = (CANVAS_HEIGHT/20)*(30/31);  //マスサイズ
const MASS_SEP = (CANVAS_HEIGHT/20)*(1/31); //マスの隙間
const STAGE_OFFSET_X = ((game.canvasWidth-CANVAS_WIDTH)/2);
//keyナンバー
const SPACE_KEY = 32;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const UP_KEY = 38;

// var g_canvas;
var g_ctx=game.context;
var g_gameOver=false; //ゲームオーバーフラグ
var g_turn=0;  //ターンかウンタ
var g_minoPointOffsetX =4; //ミノの初期マス位置ｘ(中心が基点)
var g_minoPointOffsetY = -1; //ｙ
var g_activeMinoPoints =new Array(4); //現在操作中のミノ座標
var g_notActiveMinoPoints=[]; //設置済みのミノ座標
var g_leftCount = 0;  //押し込みカウンタ
var g_rightCount = 0;
var g_downCount = 0;
var g_spaceCount = 1;
var g_upCount = 0;
var g_updateTurnFlg = true; //ターン更新フラグ
var g_points = 0;
//key
var g_spacePush = false;
var g_leftPush = false;
var g_rightPush = false;
var g_downPush = false;
var g_upPush = false;
/**
 * stage[]・・・消去，設置済みミノのデータ保持
 */
//ステージ配列初期化
var g_stage = new Array(MASS_NUM_Y);
for(var y=0;y<20;y++){
    g_stage[y] = new Array(MASS_NUM_X);
    for(x=0;x<10;x++){
        g_stage[y][x]=0;
    }
}
//ミノデータ
var minoJ = [
    {x: 4, y: -2, c: 0,type: 'J'},
    {x: 4, y: -1, c: 1,type: 'J'},
    {x: 3, y: 0, c: 0,type: 'J'},
    {x: 4, y: 0, c: 0,type: 'J'},
];
var minoO = [
    {x: 3, y: -2, c: 0,type: 'O'},
    {x: 4, y: -2, c: 0,type: 'O'},
    {x: 3, y: -1, c: 0,type: 'O'},
    {x: 4, y: -1, c: 1,type: 'O'},
];
var minoL = [
    {x: 4, y: -2, c: 0,type: 'L'},
    {x: 4, y: -1, c: 1,type: 'L'},
    {x: 4, y: 0, c: 0,type: 'L'},
    {x: 5, y: 0, c: 0,type: 'L'},
];
var minoS = [
    {x: 4, y: -1, c: 1,type: 'S'},
    {x: 5, y: -1, c: 0,type: 'S'},
    {x: 3, y: 0, c: 0,type: 'S'},
    {x: 4, y: 0, c: 0,type: 'S'},
];
var minoI =[
    {x: 4, y: -3, c: 0,type: 'I'},
    {x: 4, y: -2, c: 0,type: 'I'},
    {x: 4, y: -1, c: 1,type: 'I'},
    {x: 4, y: 0, c: 0,type: 'I'},
];
var minoT = [
    {x: 4, y: -2, c: 0,type: 'T'},
    {x: 3, y: -1, c: 0,type: 'T'},
    {x: 4, y: -1, c: 1,type: 'T'},
    {x: 5, y: -1, c: 0,type: 'T'},
];
var minoZ = [
    {x: 3, y: -1, c: 0,type: 'Z'},
    {x: 4, y: -1, c: 1,type: 'Z'},
    {x: 4, y: 0, c: 0,type: 'Z'},
    {x: 5, y: 0, c: 0,type: 'Z'},
];
var minoPoints=[minoJ,minoI,minoO,minoL,minoS,minoT,minoZ];




/**
 * キーを押したときの操作
 */
function keyDown(event){
    var code = event.keyCode; //どのキーが押されたか
    switch(code){
        //スペース
        case SPACE_KEY:
            //スクロール禁止
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_spacePush = true;
            break;
        //左
        case LEFT_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_leftPush = true;
            break;
        //右
        case RIGHT_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_rightPush = true;
            break;
        //下
        case DOWN_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_downPush = true;
            break
        //上
        case UP_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_upPush = true;
            break
    }
}
/**
 * キーを離した時
 */
function keyUp(event) {
	code = event.keyCode;
	switch(code) {
	    // スペースキー
	    case SPACE_KEY:
            g_spacePush = false;
	        break;
	    // ←キー
	    case LEFT_KEY:
	        g_leftPush = false;
            break;
        // →キー
	    case RIGHT_KEY:
	        g_rightPush = false;
            break;
        // ↓キー
	    case DOWN_KEY:
		    g_downPush = false;
            break;
        //上
	    case UP_KEY:
		    g_upPush = false;
	        break;
	}
}

/**
 * メインループ処理
 */
function play(){

    //ターン更新
    if(g_updateTurnFlg){
        g_turn++;
        if(g_turn != 1){
            //activeとnotActiveを結合
            g_notActiveMinoPoints = g_notActiveMinoPoints.concat(g_activeMinoPoints);
            //notActiveを用いて削除処理を行う
            g_notActiveMinoPoints=deleteMino(g_notActiveMinoPoints);
            //stage[]とnot_activeを同期
            for(var y=0;y<20;y++){
                for(var x=0;x<10;x++){
                    g_stage[y][x]=0;
                }
            }
            for(var i=0;i<g_notActiveMinoPoints.length;i++){
                g_stage[g_notActiveMinoPoints[i].y-1][g_notActiveMinoPoints[i].x-1]=1;
            }
        } 
        g_activeMinoPoints = minoPoints[Math.round( Math.random()*6 )]; //初期座標取得
        g_updateTurnFlg = false;             
        
    }

    g_ctx.clearRect(0,0,game.canvasWidth,game.canvasHeight); //canvas初期化.
    move(); //移動処理
    rotate(); //回転処理
    draw(g_activeMinoPoints.concat(g_notActiveMinoPoints)); //描画
}


/**
 * 描画処理
 */
function draw(points){
    var drawPointOffsetY = 0; //描画座標y
    var drawPointOffsetX = 0; //x
    var type; //ミノの種類
    var colorCode;

    //ステージ枠+得点描画
    g_ctx.beginPath();
    g_ctx.rect(STAGE_OFFSET_X,0,MASS_SEP,CANVAS_HEIGHT);
    g_ctx.rect(STAGE_OFFSET_X-MASS_SEP + (MASS_SIZE+MASS_SEP)*(10)+MASS_SEP,0,MASS_SEP,CANVAS_HEIGHT);
    g_ctx.fillStyle='#ffffff';
    g_ctx.fill();
    g_ctx.closePath();  

    g_ctx.font = "50px sans-serif";
    g_ctx.fillText("Points : "+g_points,(STAGE_OFFSET_X-MASS_SEP + (MASS_SIZE+MASS_SEP)*(10)+MASS_SEP)+5,55,game.canvasWidth-(STAGE_OFFSET_X-MASS_SEP + (MASS_SIZE+MASS_SEP)*(10)+MASS_SEP)-10);

    for(var i=0;i<points.length;i++){
        if(points[i].y>=0){
            type=points[i].type;
            if(type=='I') colorCode='#00bfff';
            else if(type=='J') colorCode='#0000cd';
            else if(type=='L') colorCode='#ffa500';
            else if(type=='S') colorCode='#008000';
            else if(type=='Z') colorCode='#c71585';
            else if(type=='T') colorCode='#800080';
            else if(type=='O') colorCode='#ffd700';

            drawPointOffsetX = STAGE_OFFSET_X-MASS_SEP + (MASS_SIZE+MASS_SEP)*(points[i].x-1)+MASS_SEP;
            drawPointOffsetY =((MASS_SIZE+MASS_SEP)*points[i].y)-(MASS_SIZE+MASS_SEP);        
            //描画
            g_ctx.beginPath();
            g_ctx.rect(drawPointOffsetX,drawPointOffsetY,MASS_SIZE,MASS_SIZE);
            g_ctx.fillStyle=colorCode;
            g_ctx.fill();
            g_ctx.closePath();
        }
    }
}

/**
 * 移動値を加算した値を返す
 */
function getAddPoint(points,x,y){
    var addPointsArr =new Array(4);
    for(var i=0;i<addPointsArr.length;i++){
        addPointsArr[i]={
            x:points[i].x+x,
            y:points[i].y+y,
            c:points[i].c,
            type:points[i].type,
        }
    }
    return addPointsArr;
}

/**
 * 移動処理
 */
function move(){
    var moveX = 0; //移動値ｘ
    var moveY = 0; //移動値ｙ
    //左キー押し込み
    if(g_leftPush || game.flg['left']){
        if(g_leftCount > 5 && !detectionCollision(getAddPoint(g_activeMinoPoints,-1,0))){
            moveX--;
            g_leftCount = 0;
        }else{
            g_leftCount++;
        }
    }
    //右キー押し込み
    if(g_rightPush || game.flg['right']){
        if(g_rightCount > 5 && !detectionCollision(getAddPoint(g_activeMinoPoints,1,0))){
            moveX++;
            g_rightCount = 0;
        }else{
            g_rightCount++;
        }
    }
    //下キー押し込み
    if(g_downPush || game.flg['down']){
        g_downCount+=20; //20
    }

    //自由落下
    if(g_downCount >= 60  && !detectionCollision(getAddPoint(g_activeMinoPoints,0,1),true)){
        moveY++;
        g_downCount = 0;
    }else{
        g_downCount++;
    }

    g_activeMinoPoints = getAddPoint(g_activeMinoPoints,moveX,moveY); //座標更新
}

/**
 * 衝突判定
 * 渡した座標に衝突が在るならtrue,無いならfalse
 * 当たりがあったら即関数を抜けるように改良
 */
function detectionCollision(points,isDown=false){
    for(var i=0;i<points.length;i++){
        //y座標内か
        if(points[i].y > 20){
            g_updateTurnFlg = true;
            return true;
        }

        //x座標内か
        if(points[i].x < 1 || points[i].x >10) return true;

        //設置ミノと衝突してないか
        //y座標がステージ上なら判定する必要なし(後stage[y]にエラーがでるから)
        if(points[i].y > 0){
            if(g_stage[points[i].y-1][points[i].x-1] == 1){
                if(isDown) g_updateTurnFlg=true;
                if(isGameOver()) g_gameSection = 'gameOver';
                return true;
            }
        } 
    }
    return false;
}

/**
 * 回転処理
 */
function rotate(){
    var rotatePoints=new Array(4);
    var centerX;
    var centerY;
    var rotateX;
    var rotateY;
    var gap;

    if(g_activeMinoPoints[0].type == 'O') return;

    //スペースキー押し込み
    if(!g_spacePush && !game.flg['a']){
        g_spaceCount = 1;
        return; 
    } 

    //カウンタ確認
    if(!g_spaceCount) return;

    //中心座標
    for(var i=0;i<4;i++){
        if(g_activeMinoPoints[i].c==1){
            centerX=g_activeMinoPoints[i].x;
            centerY=g_activeMinoPoints[i].y;
            break; 
        } 
    }
    //座標を回転
    for(var i=0;i<4;i++){    
        rotateX=-g_activeMinoPoints[i].y+centerY+centerX;
        rotateY=g_activeMinoPoints[i].x-centerX+centerY;
        rotatePoints[i]={
            x:rotateX,
            y:rotateY,
            c:g_activeMinoPoints[i].c,
            type:g_activeMinoPoints[i].type,
        }
    }

    //衝突判定
    gap = detectionCollisionRotate(rotatePoints,centerX,centerY);

    rotatePoints = getAddPoint(rotatePoints,gap.x,gap.y);

    if(!detectionCollision(rotatePoints)){
        //座標更新
        g_activeMinoPoints=rotatePoints;
    }

    g_spaceCount=0;
}

/**
 * 衝突判定for回転
 * 全ブロックを判定して，当たった箇所を配列で返す．
 * 箇所は，中心点から見て左右下を判定
 */
function detectionCollisionRotate(points,centerX,centerY){
    var position={l:0,r:0,d:0,u:0};
    var gap={x:0,y:0};
    //衝突位置確認
    for(var i=0;i<points.length;i++){
        //ステージ右側の衝突
        if(points[i].x > 10){
            position.r++;
        }

        //ステージ左側の衝突
        else if(points[i].x < 1){
            position.l++;
        }

        //ステージ下の衝突
        if(points[i].y > 20){
            position.d++;
        }

        //接地ミノ
        if(points[i].y > 0){
            if(g_stage[points[i].y-1][points[i].x-1] == 1){
                //中心点からみてどの位置か
                if(points[i].y < centerY) position.d++;
                else if(points[i].y > centerY) position.u++;
                if(points[i].x > centerX) position.r++;
                else if(points[i].x < centerX) position.l++; 
            }              
        }
  
    }

    //移動値
    if(position.r==2 || position.l==2 || position.u==2 || position.d==2){
        if(position.r!=1 && position.l!=1 && position.u!=1 && position.d!=1){
            //十字2マス
            if(position.r==2) gap.x-=2;
            else if(position.l==2) gap.x+=2;
            else if(position.d==2) gap.y-=2;
            else if(position.u==2) gap.y+=2;
        }else{
            //十字１＋斜め１
            if(position.r > 0) gap.x--;
            else if(position.l > 0) gap.x++;
            else if(position.d > 0) gap.y--;
            else if(position.u > 0) gap.y++;
        }
    }else if(position.r || position.l || position.u || position.d){
        //十字or斜め1マス
        if(position.l) gap.x++;
        else if(position.r) gap.x--;
        else if(position.d) gap.y--;
        else if(position.u) gap.y++; 
    }

    return gap;
}

/**
 * 削除処理
 * 削除後の座標を返す
 */
function deleteMino(points){
    var y; //探査用
    var result = points; //消去が無かったらそのまま返す
    var serch;
    var count=0;

    for(var y=1;y<=20;y++){
        //y行目のマスの数を探査
        serch = result.filter(function(result){
            return result.y == y;
        });

        //マスの数が10だったら削除
        if(serch.length==10){
            count++;
            g_points+=100;
            //消すy座標を抜いた座標配列を取得
            result = result.filter(function(result){
                return result.y != y;
            });
            //消すy座標より上のミノを全て1マス下げる
            for(var k=0;k<result.length;k++){
                if(result[k].y<y) result[k].y++;
            }

        }
    }

    // console.log(count);
    return result;
}

/**
 * ゲームーバー判定
 */
function isGameOver(){
    for(var i=0;i<g_activeMinoPoints.length;i++){
        if(g_activeMinoPoints[i].y<=0) return true;
    }
    return false;
}

/**
 * リスタート処理
 */
function restart(){
    g_gameSection = 'play';
    g_updateTurnFlg = true; //ターン更新フラグ
    g_points = 0;
    g_gameOver=false; //ゲームオーバーフラグ
    g_turn=0;  //ターンかウンタ
    g_activeMinoPoints =new Array(4); //現在操作中のミノ座標
    g_notActiveMinoPoints=[]; //設置済みのミノ座標
    g_stage = new Array(MASS_NUM_Y);
    for(var y=0;y<20;y++){
        g_stage[y] = new Array(MASS_NUM_X);
        for(x=0;x<10;x++){
            g_stage[y][x]=0;
        }
    }
}