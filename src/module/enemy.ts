import {charactor} from './charactor';
import * as phaser from 'phaser';
import{gmap} from './map';
import * as rotjs from 'rot-js';
import { addmes } from './UIscene';
import {status}from './const';
class direction{
    public x:number;
    public y:number;
    constructor(x: number,y: number){
        this.x=x;
        this.y=y;
    }
}
export class enemy extends charactor{
    private turncount = 0;
    private movelist: direction[];
    private passableCallback = function (x: any, y: any) {
    return 1;
    }
    constructor(chara: phaser.GameObjects.Sprite, tilex: number, tiley: number){
        super(chara, tilex, tiley);
        this.actpush = -1;
        this.pc = 0;
        this.pac = 0;
        this.jinei = 1;
        this.movelist=new Array();
        this.state=new status("ななし",10,10,10,10,1,2,2,2);
    }
    refleashastar(x: number,y: number,m:gmap){
        this.movelist=new Array();
        var as = new rotjs.Path.AStar(x, y, (x, y) => {
        return m.canwwalkforAstar(x, y);
        });
        var count=0;
        var lastpos=new direction(0,0);
        console.info(count);
        as.compute(this.tilex,this.tiley,(x,y)=>{
            if(count==0){
               this.movelist.push(new direction(this.tilex-x,this.tiley-y));
            }else{
                this.movelist.push(new direction(lastpos.x - x, lastpos.y - y));
            }
            lastpos = new direction(x, y);
            count++;
            return;
        });
    }
    requestmove(m:gmap){
        this.turncount++;
        //console.log(this.state.name,"だよ");
        var p = m.getpl();
        if (Math.abs(p.tilex - this.tilex) <= 1 && Math.abs(p.tiley - this.tiley) <= 1){
            this.actpush=2;
            this.targetc=p;
            return;
        }
        if(this.movelist.length==0||this.turncount>=10){
            this.turncount=0;
            if(p!=null){
            console.log("aaa");
            this.refleashastar(p.tilex,p.tiley,m);
            }
        }else{
            var a=this.movelist[0];
            console.log(this.state.name+a.x,a.y);
            this.actpush=1;
            this.addtilex=-a.x;
            this.addtiley=-a.y;
            this.movelist.shift();
        }
    }
}