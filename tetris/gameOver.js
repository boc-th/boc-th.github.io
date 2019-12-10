/**
 * ゲームオーバー画面
 */
var c=1;
var cursol=0;
function gameOver(){

    gameOverDraw();
    select();

}

function gameOverDraw(){
    //後ろのステージ
    g_ctx.clearRect(0,0,game.canvasWidth,game.canvasHeight); //canvas初期化.
    draw(g_activeMinoPoints.concat(g_notActiveMinoPoints)); //描画

    //半透明のフィルター
    g_ctx.beginPath();
    g_ctx.rect(0,0,game.canvasWidth,game.canvasHeight);
    g_ctx.fillStyle="rgba(" + [0, 0, 0, 0.6] + ")";
    g_ctx.fill();
    g_ctx.closePath(); 
    
    //文字
    var text= "GAME OVER";
    var textWidth;
    var textSize = game.canvasHeight*(3/20);
    g_ctx.fillStyle='#ffffff';
    g_ctx.font = textSize+"px sans-serif";
    textWidth = g_ctx.measureText(text).width ;
    g_ctx.fillText(text,(game.canvasWidth-textWidth)/2,textSize*1.5,game.canvasWidth);

    //選択
    var text2 = "もう一度";
    var text3 = "終わる";
    var textWidth2,textWidth3;
    var textSize2 = game.canvasHeight*(2/20);
    g_ctx.font = textSize2+"px sans-serif";
    textWidth2 = g_ctx.measureText(text2).width;
    textWidth3 = g_ctx.measureText(text3).width;
    if(cursol==0) g_ctx.fillStyle='#dc143c';
    else g_ctx.fillStyle='#90ee90';
    g_ctx.fillText(text2,(game.canvasWidth-textWidth2)/2,game.canvasHeight-textSize2*1.5*2,game.canvasWidth);
    if(cursol==1) g_ctx.fillStyle='#dc143c';
    else g_ctx.fillStyle='#90ee90';
    g_ctx.fillText(text3,(game.canvasWidth-textWidth3)/2,game.canvasHeight-textSize2*1.5,game.canvasWidth);
    
}

function select(){

    if(g_upPush || game.flg['up']){
        if(g_upCount == 0){
            if(cursol == 0) cursol=1;
            else if(cursol == 1) cursol=0;  
            g_upCount = 1;          
        }
    }else{
        g_upCount = 0;
    }

    if(g_downPush || game.flg['down']){
        if(g_downCount == 0){
            if(cursol == 0) cursol=1;
            else if(cursol == 1) cursol=0;  
            g_downCount = 1;          
        }
    }else{
        g_downCount = 0;
    }

    if(g_spacePush || game.flg['a']){
        if(cursol == 0) restart();
        else if(cursol == 1) var a; 
    }
}