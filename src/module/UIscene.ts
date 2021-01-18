import * as phaser from 'phaser';
import {charactor }from "./charactor";
export var list: string[];
export function addmes(st: string){
    list.unshift(st);//kk
}
export var ifloaded=false;
export class UIscene extends phaser.Scene{
    public log:phaser.GameObjects.Text;
    public hyouji: phaser.GameObjects.Text;
    public window;
    constructor(){
        super({key:'UIscene',active:false});
        list=new Array();
    }
    preload(){
        //this.load.image('./images/UI');
    }
    create(){
        this.log=this.add.text(10,250,"welcome!!!!");
        this.log.setFontSize(15);
        this.log.setFontFamily('font1');
        //console.log("lou");
        addmes("ダンジョンの1階だ。");
        this.hyouji=this.add.text(10,10,"HP");
        this.hyouji.setFontFamily('font1');
        ifloaded=true;
    }
    turnupdate(c:charactor){
        this.log.setText(list.slice(0,4).join('\n'));
        this.hphyouji(c);
    }
    hphyouji(c:charactor){
        if(ifloaded){
        this.hyouji.setText("階層"+1+"階    "+"HP"+c.state.nowhp+"/"+c.state.hp);
        }
    }
    invhyouji(c:charactor){
        
    }
}