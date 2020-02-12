//プレイヤー座標からマップチップのキーを算出する

/**
 * 4 | 1
 * -----
 * 3 | 2
 * 
 * 1(終Nxe，始Nys)
 * 2(終Nxe，終Nye)
 * 3(始Nxs，終Nye)
 * 4(始Nxs，始Nys)
 * 
 * 始点＝プレイヤー座標
 * 終点＝プレイヤー座標＋チップサイズ
 * 
 */

var playerX = 7;
var playerY = 5;
var chipSize = 10;

var Nxs,Nxe,Nys,Nye; //四隅のブロック番号

// Nxe = Math.ceil(((playerX + chipSize)/chipSize)-1);
// Nye = Math.ceil(((playerY + chipSize)/chipSize)-1);
// Nxs = Math.floor(playerX/chipSize);
// Nys = Math.floor(playerY/chipSize);

// console.log('xe:'+Nxe);
// console.log('ye:'+Nye);
// console.log('xs:'+Nxs);
// console.log('ys:'+Nys);

var print=0;
for(var i=59;i<=65;i++){
    // var y = (-30/(60*60))*(i-60)*(i-60)+30;
    // var pre_y=(-30/(60*60))*(i-1-60)*(i-1-60)+30;
    var y = (-30/(60*60))*i*i+30;
    var pre_y = (-30/(60*60))*(i-1)*(i-1)+30;
    print=pre_y-y;
    if(pre_y-y<0) print=(pre_y-y)*-1;
    console.log(i,':',print);
}