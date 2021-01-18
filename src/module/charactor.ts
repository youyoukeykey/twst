import  * as phaser from 'phaser';
import * as rotjs from "rot-js";
import { JsxEmit, parseJsonSourceFileConfigFileContent } from 'typescript';
import * as sys from './const';
import{door, gmap} from './map';
import { addmes } from './UIscene';
import {battle} from './system';
export class charactor {
    public jinei=0;//１で敵対０は中立-1はプレイヤー自身
    public chara:phaser.GameObjects.Sprite;
    public tilex:number;
    public tiley:number;
    public arrownext:boolean=false;
    public state:sys.status;
    public addtilex: number;
    public addtiley: number;
    public movetilex:number;//アニメ
    public movetiley:number;//アニメ
    public targetc:charactor;
    public tagetdoor:door;
    public actpush: number;//アニメーションの番号（-1:空欄0:移動なし1:移動2:攻撃3:ドア開け）
    public pc: number;//全体のカウント
    public pac: number;//決められた部分のカウント
    public sinialpha=360;
    constructor(chara:phaser.GameObjects.Sprite,tilex:number,tiley:number,){
        this.chara=chara;
        this.tilex=tilex;
        this.tiley=tiley;
        var ww = tilex;
        ////console.log(i * ww + ww / 2, k * ww + ww / 2, 'chips', this.dungeonmap[i][k]);
        chara.setScale(ww/4, ww/4);
        //chara.setOrigin(0.5);
        this.state = new sys.status("noname", 10, 10, 10, 10, 10, 10, 10, 10);
        this.chara.setX(sys.systemconstant.maptoglX(this.tilex) );
        this.chara.setY(sys.systemconstant.maptoglY(this.tiley) );
        this.actpush=-1;
        this.pac=0;
        this.pc=0;
    }
    public setpos(){
        this.chara.setX(sys.systemconstant.maptoglX(this.tilex));
        this.chara.setY(sys.systemconstant.maptoglY(this.tiley));
    }
    public requestmove(m:gmap){
        this.move(phaser.Math.Between(-1,1),phaser.Math.Between(-1,1));
        this.actpush=1;
    }
    public act(m:gmap){
        this.pc++;
        if (this.arrownext) {
            this.arrownext = false;
        }
        if (this.actpush == -1) {
            this.requestmove(m);
            if(this.pc>sys.systemconstant.waitflame*10){
            this.chara.setY((this.tiley) * sys.systemconstant.tilex - Math.abs(Math.sin(this.pc * 20 / 1080 * 3.14)) * sys.systemconstant.tilex * 0.3 + sys.systemconstant.tilex * 0.5);
            }
        }
        if (this.actpush == 0) {
            this.finishmove();
        }
        if (this.actpush == 1) {
            var newwf:number;
            newwf=m.genwf(this);
            if (this.pac == 0) {
                if(!this.trytomove(m, this.addtilex, this.addtiley)){
                    this.finishmove();
                    return;
                }
            }
            this.pac++;
            this.chara.setX(sys.systemconstant.maptoglX(this.tilex - this.addtilex) + ((this.addtilex) * sys.systemconstant.tilex) * (this.pac / newwf));
            this.chara.setY(sys.systemconstant.maptoglY(this.tiley - this.addtiley) + ((this.addtiley) * sys.systemconstant.tilex) * (this.pac / newwf));//ヌルっと動く
            if (this.pac >= sys.systemconstant.waitflame) {
                this.finishmove();
            }
        }
        if(this.actpush==2){
            if(this.pac==0){
                if(this.targetc!=null){  
                this.atack(this.targetc);
                }   
            }
            this.pac++;
            if(this.pac*2<sys.systemconstant.waitflame){
                this.chara.setX(sys.systemconstant.maptoglX(this.tilex+this.movetilex * (this.pac*2 / sys.systemconstant.waitflame)));
                this.chara.setY(sys.systemconstant.maptoglY(this.tiley + this.movetiley * (this.pac * 2 / sys.systemconstant.waitflame)));
                //console.log(this.tiley + this.movetiley * (this.pac * 2 / sys.systemconstant.waitflame));
            }else{
                this.chara.setX(sys.systemconstant.maptoglX(this.tilex + this.movetilex * (1-((this.pac*2-sys.systemconstant.waitflame) / sys.systemconstant.waitflame))));
                this.chara.setY(sys.systemconstant.maptoglY(this.tiley + this.movetiley * (1 - ((this.pac * 2 - sys.systemconstant.waitflame) / sys.systemconstant.waitflame))));
            }
            if (this.pac >= sys.systemconstant.waitflame) {
                this.finishmove();
            }
        }
        if(this.actpush==3){
            if (this.pac == 0) {
                if (this.tagetdoor == null) {
                    addmes("そこにはドアはない");
                    this.finishmove();
                    return;
                }else{
                    this.tagetdoor.open();
                }
            }
            this.pac++;
            if (this.pac >= sys.systemconstant.waitflame) {
                this.finishmove();
            }
        }
    }
    move(x: number, y: number) {
        this.actpush = 1;
        this.addtilex = x;
        this.addtiley = y;
    }
    public trytomove(m:gmap,x:number,y:number):boolean{
        if(m.canwalk(this.tilex+x,this.tiley+y)){
            this.tilex+=x;
            this.tiley+=y;
            return true;
        }else{
            return false;
        }
    }
    public finishmove(){
        this.arrownext = true;
        this.actpush = -1;
        this.pc = 0;
        this.pac = 0;
        this.setpos();
    }
    public atack(cj:charactor){
        this.targetc=cj;
        battle.attack(this, this.targetc);  
        this.movetilex=cj.tilex-this.tilex;
        this.movetiley=cj.tiley-this.tiley;
        this.actpush=2;
        //console.info(this.movetilex,this.movetiley);
    }
}
