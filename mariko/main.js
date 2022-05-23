/**
 * 定数，グローバル変数，ファイル，オブジェクトの用意
 */

//キー関連
const SHIFT_KEY = 16;
const A_KEY = 65;
const D_KEY = 68;
const DOWN_KEY = 40;
const ENTER_KEY = 13;
var g_shiftPush = false;
var g_aPush = false;
var g_dPush = false;
var g_downPush = false;
var g_enterPush = false;

var g_gameOverFlg = false;


var controller;
var play;
var ctx; 
var map;
var characters; //各キャラのインスタンスを配列で保存
var g_canvasH; //canvas高さ y
var g_canvasW; //canvas幅
var g_chipSize; //マップチップ１個の大きさ
var g_cameraMapOffsetX; //カメラのマップX座標
var g_cameraMapOffsetY; //カメラのマップY座標 


/**
 * 最初に呼ばれる
 */
window.onload = function(){

    // キーの登録
    window.addEventListener('keydown',keyDown,true);
    window.addEventListener('keyup',keyUp,true);

    controller = new GameController();
    controller.run();

    g_canvasH = controller.canvasHeight;
    g_canvasW = controller.canvasWidth;
    g_chipSize = Math.floor(g_canvasH/20);
    ctx =controller.context;

    // g_cameraMapOffsetX = this.g_chipSize*-1; //カメラのマップX座標
    // g_cameraMapOffsetY = this.g_chipSize*1; //カメラのマップY座標 

    characters = [
        new Character('img/bou.PNG',[1,1],"player"),
    ];
    map = new Map();
    play = new Play();
    
    main(); //loop開始
}


/**
 * メインループ
 */
function main(){
    // メニューを表示する場合は，ここに追加
    if(g_gameOverFlg){
        console.log('out');
        return;
    }
    requestAnimationFrame(main);
    play.run();
}


/**
 * キーを押したときの操作
 */
function keyDown(event){
    var code = event.keyCode; //どのキーが押されたか
    switch(code){
        //スペース
        case SHIFT_KEY:
            //スクロール禁止
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_shiftPush = true;
            break;
        //左
        case A_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_aPush = true;
            break;
        //右
        case D_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_dPush = true;
            break;
        //下
        case DOWN_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_downPush = true;
            break
        //上
        case ENTER_KEY:
            event.returnValue = false; //ie
            event.preventDefault(); //firefox
            g_enterPush = true;
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
	    case SHIFT_KEY:
            g_shiftPush = false;
	        break;
	    // ←キー
	    case A_KEY:
	        g_aPush = false;
            break;
        // →キー
	    case D_KEY:
	        g_dPush = false;
            break;
        // ↓キー
	    case DOWN_KEY:
		    g_downPush = false;
            break;
        //上
	    case ENTER_KEY:
		    g_enterPush = false;
	        break;
	}
}