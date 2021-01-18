import {systemconstant,status} from './const';
import * as rotjs from 'rot-js';
import {charactor}from './charactor';
import {enemy} from './enemy';
import{GameScene,cdata} from './GameScene';
import digger from 'rot-js/lib/map/digger';
import { addmes } from './UIscene';
import {item} from './item';
export class gmap{
    public sc = new rotjs.Scheduler.Simple;
    private nowup: charactor;
    public dungeonmap: number[][];
    public clist:charactor[];//生きているキャラのリスト
    public dlist=new Array<charactor>();
    public map: digger;
    public doors:door[];
    private gs:GameScene;
    private Ka:Phaser.Input.Keyboard.Key;
    constructor(Gs:GameScene){
        this.gs=Gs;
    }
    mapcreate(floor:number) {
        //rotjs.RNG.setSeed(1234);
        var rows = systemconstant.maplength;
        var cols = systemconstant.maplength;
        this.clist=new Array();
        this.dungeonmap = new Array(rows);
        for (var i = 0; i < this.dungeonmap.length; i++) {
            this.dungeonmap[i] = new Array(cols);
            for (var k = 0; k < this.dungeonmap[i].length; k++) {
                this.dungeonmap[i][k] = 0;
            }
        }
        this.map = new rotjs.Map.Digger(rows, cols, null);
        //var map = new rotjs.Map.Arena(rows, cols);
        var that = this;
        this.map.create(function (x, y, type) {
            that.dungeonmap[x][y] = type;
        });
        this.doors=new Array();
        this.map.getRooms().forEach(element => {
            element.getDoors((x,y)=>{
                this.doors.push(new door(322,321,x,y));//秋、〆
            });
        });
        //今のマップチップ用に調整
        //console.log("mapcreated");
        for (var i = 0; i < this.dungeonmap.length; i++) {
            for (var k = 0; k < this.dungeonmap[i].length; k++) {
                if (this.dungeonmap[i][k] == 1) {
                    if (k + 1 < this.dungeonmap.length) {
                        if (k + 2 < this.dungeonmap.length) {
                            if (this.dungeonmap[i][k + 1] == 1 && this.dungeonmap[i][k + 2] == 1) {
                                this.dungeonmap[i][k] = 255;//かべのなか
                            } else if (this.dungeonmap[i][k + 1] == 1 && this.dungeonmap[i][k + 2] == 0) {
                                this.dungeonmap[i][k] = 285;//かべの側面
                            } else if (this.dungeonmap[i][k + 1] == 0) {
                                this.dungeonmap[i][k] = 316;//かべの側面
                            }
                        } else {
                            if (this.dungeonmap[i][k + 1] == 0) {
                                this.dungeonmap[i][k] = 317;//かべの側面
                            } else {
                                this.dungeonmap[i][k] = 255;//かべのなか
                            }
                        }
                    } else {
                        this.dungeonmap[i][k] = 255;//かべのなか
                    }
                    if (k - 1 >= 0) {
                        if (this.dungeonmap[i][k + 1] == 0 && this.dungeonmap[i][k - 1] == 287) {
                            this.dungeonmap[i][k] = 315;//一枚壁
                        }
                    }
                } else {
                    this.dungeonmap[i][k] = 287;//ゆか
                }
            }
        }
        this.gs.mapdraw(this);
        var rooms = this.map.getRooms();
        this.addsomefromcdatas(this.gs.getcs(floor),5);
        //console.log("cdone");
        //var l = rooms.length;
        //debug
        this.Ka=this.gs.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //kokomade
    }
    mapload(map: number[][]) {
        for (var i = 0; i < this.dungeonmap.length; i++) {
            for (var k = 0; k < this.dungeonmap[i].length; k++) {
                this.dungeonmap[i][k] = map[i][k];
            }
        }
    }
    public getchara(x:number,y:number):charactor{
        var rc:charactor;
        rc=null;
        this.clist.forEach(cc=>{
            if(cc.tilex==x&&cc.tiley==y){
                rc=cc;
            }
        });
        return rc;
    }
    public genwf(c:charactor):number{
        if(c.jinei==-1){
            return systemconstant.waitflame;
        }
        var pl:charactor;
        this.clist.forEach(cccc=>{
            if(cccc.jinei==-1){
                pl=cccc;
            }
        });
        if (10<Math.sqrt(Math.pow(pl.tilex - c.tilex, 2) + Math.pow(pl.tiley - c.tiley, 2))){
            return 1;
        }
        return systemconstant.waitflame;
    }
    public getmap():number[][]{
        return this.dungeonmap;
    }
    add(cc:charactor){
        this.clist.push(cc);
        this.sc.add(this.clist[this.clist.length-1],true);
    }
    addrandom(cc:charactor){
        this.add(cc);
        var l=this.map.getRooms();
        var k=l.length;
        var s=this.map.getRooms()[Phaser.Math.Between(0,k-1)];
        cc.tilex=Phaser.Math.Between(s.getLeft(),s.getRight());
        cc.tiley = Phaser.Math.Between(s.getTop(), s.getBottom());
        cc.setpos();
    }
    addrandomfromcdata(ccc:cdata){
        var cc=new enemy(this.gs.add.sprite(0,0,'chips',ccc.imagenum),10,10);
        cc.state=Object.create(ccc.s);
        console.log("chew" + ccc.imagenum);
        this.addrandom(cc);
    }
    addsomefromcdatas(ccc:cdata[],count:number){
        for(var i=0;i<count;i++){
            this.addrandomfromcdata(ccc[Phaser.Math.Between(0,ccc.length-1)]);
        }
    }
    remove(cc:charactor){
        this.sc.remove(cc);
        this.clist.splice(this.clist.indexOf(cc),1);
        this.dlist.splice(this.dlist.indexOf(cc), 1);
        cc.chara.setVisible(false);
    }
    death(cc:charactor){
        this.dlist.push(cc);
    }
    update(){
        if(this.dlist.length>0){
            this.dlist.forEach(element=>{
            element.chara.setAlpha(element.sinialpha/360);
            element.sinialpha-=5;
            if(element.sinialpha<=0){
                this.remove(element);
            }
            });
        }else{
        if (this.nowup != null) {
            this.nowup.act(this);
            //console.log(this.nowup.state.name);
            var that = this;
            if (this.nowup.arrownext) {
                this.clist.forEach(element => {//死亡チェック
                    if (element.state.nowhp < 0) {
                        addmes(element.state.name + "は力尽きた");
                        that.death(element);
                    }
                });
                var cullent = this.sc.next();
                if (cullent instanceof charactor) {
                    // //console.log(this.nowup.tiley);
                    ////console.log(cullent.state.name);
                    this.nowup = cullent;//TODO:これじゃダメなのでオブジェクトのは家列を作って底と別に管理→できました
                    if(this.nowup.jinei==-1){
                    this.gs.plvision(this.nowup.tilex, this.nowup.tiley, 10);
                    }
                }
                this.gs.updatelog();
            }
        }else{
            this.nowup=this.sc.next();
        }
        if (this.Ka.isDown) {
            this.gs.allvisible();
        }
    }
    }
    cansee(x: number, y: number): boolean {
        if (x >= 0 && y >= 0 && x < this.dungeonmap.length && y < this.dungeonmap[x].length) {
            if (this.dungeonmap[x][y] == 287) {
                var dr = this.getdoor(x, y);
                if (dr == null) {
                    return true;
                } else if (!dr.state) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }
    canwwalkforAstar(x:number,y:number):boolean{
        if (x >= 0 && y >= 0 && x < this.dungeonmap.length && y < this.dungeonmap[x].length) {
            if (this.dungeonmap[x][y] == 287) {
                return true;              
        } else {
            return false;
        }
    }else{
        return false;
    }
}
    canwalk(x:number,y:number):boolean{
        if(x>=0&&y>=0&&x<this.dungeonmap.length&&y<this.dungeonmap[x].length){
        if(this.dungeonmap[x][y]==287){
            var dr=this.getdoor(x,y);
            var ch=this.getchara(x,y);
            if(dr==null){
                if(ch==null){
                    return true;//通行許可
                }else{
                    return false;
                }
            }else{
                if(ch!=null){
                    return false;
                }
            if(!dr.state){
                return false;
            }
                return true;
        }
        }
        }else{
            return false;
        }
    }
    public getpl():charactor{
        return this.gs.player;
    }
    getdoor(ix:number,iy:number):door{
        var rt:door;
        rt=null;
        this.doors.forEach(dor=>{
            ////console.log(dor.x, ix, dor.x==ix);
            if(dor.x==ix&&dor.y==iy){
                rt=dor;                
            }
        });
        return rt;
    }
}
export class door{
    public islocked:boolean;
    public state:boolean;//trueで秋
    public x:number;
    public y:number;
    public oimnum:number;
    public cimnum:number;
    public opimage:Phaser.GameObjects.Sprite;
    public climage:Phaser.GameObjects.Sprite;
 constructor(oim:number,cim:number,x:number,y:number){
     this.x=x;
     this.y=y;
     this.oimnum=oim;
     this.cimnum = cim;
     this.state=false;
 }   
 open(){
     if(this.islocked){
         if(rotjs.RNG.getPercentage()>50){
             this.islocked=false;
             addmes("鍵が外れた");
         }else{
             addmes("鍵がかかっている");
         }
     }else{
         this.state=true;
         this.opimage.setVisible(true);
         this.climage.setVisible(false);
         addmes("ドアが開いた");
     }
 }
}