/**
 * touch 
 * https://kudox.jp/java-script/javascript-touch-event
 * 
 * event.target
 * https://developer.mozilla.org/ja/docs/Web/API/Event/target
 * 
 * addEvent class名
 * https://naruhodo.repop.jp/javascript-addeventlistener-on-class/
 * 
 * element.className
 * https://developer.mozilla.org/ja/docs/Web/API/Element/className
 */


class GameController{
    
    constructor(){
        //フラグ
        this._flgs={
            a:false,
            b:false,
            c:false,
            d:false,
            up:false,
            down:false,
            left:false,
            right:false,
        }

        //canvas
        this._canvasWidth=0;
        this._canvasHeight=0;

        //要素作成
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');
        this.controller_box = document.createElement('div');
        this.cross_key_box = document.createElement('div');
        this.command_key_box = document.createElement('div');
        this.left = document.createElement('div');
        this.right = document.createElement('div');
        this.up = document.createElement('div');
        this.down = document.createElement('div');
        this.a= document.createElement('div');
        this.b= document.createElement('div');
        this.c= document.createElement('div');
        this.d= document.createElement('div');

        //値追加
        this._canvas.id='_canvas';
        this.controller_box.id='_controller_box';
        this.cross_key_box.id='_cross_key_box';
        this.command_key_box.id='_command_key_box';
        this.left.id='_left';
        this.right.id='_right';
        this.up.id='_up';
        this.down.id='_down';
        this.a.id='_a';
        this.b.id='_b';
        this.c.id='_c';
        this.d.id='_d';

        this.controller_box.className='_key';
        this.cross_key_box.className='_key';
        this.command_key_box.className='_key';
        this.left.className='_key';
        this.right.className='_key';
        this.up.className='_key';
        this.down.className='_key';
        this.a.className='_key';
        this.b.className='_key';
        this.c.className='_key';
        this.d.className='_key';
    }

    run(){
        //要素追加
        document.body.appendChild(this._canvas);
        this.cross_key_box.appendChild(this.left);
        this.cross_key_box.appendChild(this.right);
        this.cross_key_box.appendChild(this.up);
        this.cross_key_box.appendChild(this.down);
        this.command_key_box.appendChild(this.a);
        this.command_key_box.appendChild(this.b);
        this.command_key_box.appendChild(this.c);
        this.command_key_box.appendChild(this.d);
        this.controller_box.appendChild(this.cross_key_box); //先に子要素を追加
        this.controller_box.appendChild(this.command_key_box);
        document.body.appendChild(this.controller_box); //親は後

        this._canvas.width = this._canvas.clientWidth*3;
        this._canvas.height = this._canvas.clientHeight*3;


        this.setEvent();

    }

    setEvent(){
        //event登録
        var target = document.getElementsByClassName('_key');
        for(var i=0;i<target.length;i++){
            target[i].addEventListener('touchstart',this.touchStartHandler.bind(this),false);
            target[i].addEventListener('touchend',this.touchEndHandler.bind(this),false);
        }
    }

    touchStartHandler(e){
        switch(e.target.id){
            case '_a':
                this._flgs.a=true;
                break;
            case '_b':
                this._flgs.b=true;
                break;
            case '_c':
                this._flgs.c=true;   
                break;
            case '_d':
                this._flgs.d=true;
                break;
            case '_down':
                this._flgs.down=true;
                break;
            case '_up':
                this._flgs.up=true;
                break;
            case '_right':
                this._flgs.right=true;
                break;
            case '_left':
                this._flgs.left=true;
                break;
        }  
    }
    touchEndHandler(e){
        switch(e.target.id){
            case '_a':
                this._flgs.a=false; 
                break;
            case '_b':
                this._flgs.b=false;
                break;
            case '_c':
                this._flgs.c=false;    
                break;
            case '_d':
                this._flgs.d=false;
                break;
            case '_down':
                this._flgs.down=false;
                break;
            case '_up':
                this._flgs.up=false;
                break;
            case '_right':
                this._flgs.right=false;
                break;
            case '_left':
                this._flgs.left=false;
                break;
        }  
    }

    get flg(){
        return this._flgs;
    }

    get canvasWidth(){
        return document.getElementById('_canvas').width;
    }

    get canvasHeight(){
        return document.getElementById('_canvas').height;
    }

    get context(){
        return this._ctx;
    }

    get canvas(){
        return this._canvas;
    }

}
