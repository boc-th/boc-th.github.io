var g_gameSection='play';

/**
 * 最初に呼ばれる
 */
window.onload = function(){

    //キーの登録
    window.addEventListener('keydown',keyDown,true);
    window.addEventListener('keyup',keyUp,true);


    main(); //loop開始
}


function main(){
    requestAnimationFrame(main);
    if(g_gameSection == "play") play();
    else if(g_gameSection == "gameOver") gameOver();
}