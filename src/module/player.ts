import * as phaser from 'phaser';
import {charactor}from './charactor';
import {gmap} from './map';
import {status, systemconstant} from './const';
export class player extends charactor{
    constructor(chara: phaser.GameObjects.Sprite, tilex: number, tiley: number,){
        super(chara,tilex,tiley);
        this.actpush=-1;
        this.pc=0;
        this.pac=0;
        this.jinei=-1;
        this.state=new status("player",10,10,10,10,10,10,10,10);
    }
    requestmove(m:gmap){
        
    }
    public ptrywalk(m: gmap, x: number, y: number) {
        if(this.actpush==-1){
        var ad = m.getdoor(this.tilex + x, this.tiley + y);
        var ac = m.getchara(this.tilex + x, this.tiley + y);
        ////console.log(ad);
        if (ad != null && !ad.state) {
            this.actpush=3;
            this.tagetdoor=ad;
        } else if(ac!=null){
            this.actpush=2;
            this.targetc=ac;
        }else{
            this.move(x, y);
        }
    }
    }
}