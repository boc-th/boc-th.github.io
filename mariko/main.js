//キー関連
const SPACE_KEY = 32;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const UP_KEY = 38;
var g_spacePush = false;
var g_leftPush = false;
var g_rightPush = false;
var g_downPush = false;
var g_upPush = false;


var game;
var play;
var canvasH; //canvas高さ y
var canvasW; //canvas幅
var ctx; 

/**
 * 最初に呼ばれる
 */
window.onload = function(){

    // キーの登録
    window.addEventListener('keydown',keyDown,true);
    window.addEventListener('keyup',keyUp,true);

    game = new GameController();
    game.run();

    canvasH = game.canvasHeight;
    canvasW = game.canvasWidth;
    ctx =game.context;

    play = new Play();


    main(); //loop開始
}


function main(){
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