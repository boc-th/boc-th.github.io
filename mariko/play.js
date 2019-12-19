/**
 * ゲームのプレイ処理
 */
class Play{
    constructor(){
        this.mariko = new Mariko();
        this.map = new Map();
    }

    run(){
        this.draw();
        this.move();
    }

    draw(){
        ctx.clearRect(0,0,game.canvasWidth,game.canvasHeight); //canvas初期化.
        this.map.draw(this.mariko.mapScroll);
        this.mariko.draw();
    }

    move(){
        this.mariko.move();
    }
}