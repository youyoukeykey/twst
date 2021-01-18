import * as Phaser from "phaser";
import * as rotjs from "rot-js";
import {status, systemconstant} from './const';
import {charactor} from './charactor';
import{gmap} from'./map';
import { isConditionalExpression, parseJsonSourceFileConfigFileContent, skipPartiallyEmittedExpressions } from "typescript";
import { player } from "./player";
import {ifloaded, UIscene} from './UIscene';
import { ifBloaded } from "./controleScene";
export var Gamestate=0;//0は普通、1はＵＩ捜査中
export class cdata{
    public s:status;
    public imagenum=0;
    public discription:string;
    public cansp=new Array<number>();
    constructor(){
        this.s = new status("undifined",0,0,0,0,0,0,0,0);
        this.discription="バグですねこれは";
        this.cansp=[0,1,2];
    }
}
export class GameScene extends Phaser.Scene{
    public floornum=0;
    private stext:Phaser.GameObjects.Text;
    private gamemap:gmap;
    public player:player;
    public dark:Phaser.GameObjects.Sprite[][];
    public xmhr=new XMLHttpRequest();
    public cdatas=new Array<cdata>();
    public dungeon=new Array<gmap>();
    constructor(){
    super({key:'GameScene',active:false});
    }
    public getcs(floor: number): cdata[] {
        var c:cdata[];
        c = new Array();
        this.cdatas.forEach(charaa=>{
            charaa.cansp.forEach(canspn=>{
                if(canspn==floor){
                    c.push(charaa);
                }
            });
        });
        return c;
    }
    public loadgamesetting(pass:string){
        this.xmhr.open('GET',pass);
        this.xmhr.responseType = 'json';
        this.xmhr.send();
        this.xmhr.onload = () => {
            console.log(this.xmhr.response);
            var s = this.xmhr.response.enemydata as Array<any>;
            s.forEach((element) => {
                var c=new cdata();
                c.s=new status(
                    element.name,
                    element.status.HP,
                    element.status.nowHP,
                    element.status.MP,
                    element.status.nowMP,
                    element.status.spd,
                    element.status.atk,
                    element.status.def,
                    element.status.mag
                );
                c.discription=element.description;
                c.cansp=element.spawnlevel;
                c.imagenum=element.imagenum;
                console.log(c);
                this.cdatas.push(c);
            });
        }
    }
    preload(){
        this.load.spritesheet('chips', 'images/tileset1.png', { frameWidth: 8, frameHeight: 8 });
        this.loadgamesetting('Data/Datatable.json');
    }
    create() {
        this.stext = this.add.text(0, 0, 'Phr 3');
        this.stext.setFontSize(64);
        this.stext.setColor('#ff0');
        this.stext.setOrigin(0.5);
        this.gamemap=new gmap(this);
        this.gamemap.mapcreate(3);//test
        this.player = new player(this.add.sprite(0, 0, 'chips', 90).setDepth(5), 10, 10);
        this.gamemap.addrandom(this.player);
        this.cameras.main.setSize(systemconstant.appw, systemconstant.appw);
        this.cameras.main.startFollow(this.player.chara,false);
        this.cameras.main.setZoom(1);
        this.scene.launch('controlescene');
        this.scene.launch('UIscene');
        this.allblack();
        }
    update(){
        if(ifBloaded&&ifloaded){
        this.stext.x++;
        this.stext.y=Math.sin((this.stext.x)/45*3.14)*640;
        this.gamemap.update();
        if(this.player.actpush==-1){
            this.cameras.main.stopFollow();
            this.cameras.main.centerOn(systemconstant.maptoglX(this.player.tilex),systemconstant.maptoglY(this.player.tiley));
        }else{
            this.cameras.main.startFollow(this.player.chara, false);
        }
    }
    }
    public plvision(ix:number,iy:number,irange:number){
        //console.log(ix,iy);
        this.allblack();
        var that=this;
        var fov = new rotjs.FOV.PreciseShadowcasting((x,y):boolean=>{
            return this.gamemap.cansee(x,y);
        });
        fov.compute(ix, iy, irange, function (x, y, r, visibility) {
            that.dark[x][y].setVisible(false);
        });
    }
    public allblack(){
        this.dark.forEach(dk=>{
            dk.forEach(ddk=>{
                ddk.setVisible(true);
            });
        });
    }
    public allvisible() {
        this.dark.forEach(dk => {
            dk.forEach(ddk => {
                ddk.setVisible(false);
            });
        });
        };
    public updatelog(){
        var t =this.scene.get('UIscene')as UIscene;
        t.turnupdate(this.player);
    }
    public buttonpushed(key:number){
        if(Gamestate==0){
        switch(key){
            case 0: {
                this.player.ptrywalk(this.gamemap,0,-1);
                break;
            }
            case 1:{
                this.player.ptrywalk(this.gamemap, 1, 0);
                break;
            }
            case 2: {
                this.player.ptrywalk(this.gamemap, 0, 1);
                break;
            }
            case 3: {
                this.player.ptrywalk(this.gamemap, -1, 0);
                break;
            }
            case 4: {

                break;
            }
            case 5: {

                break;
            }
            default: {

                break;
            }
        }
        }
        if(Gamestate==1){
            
        }
    }
    mapdraw(imap:gmap){
        //console.log("mapdrawn");
        var m=imap.getmap();
       for(var i=0;i<m.length;i++){
           for (var k = 0; k < m[i].length; k++){
                var ww=systemconstant.tilex;
                var chip=this.add.sprite(i*ww+ww/2,k*ww+ww/2,'chips',m[i][k]);
                ////console.log(i * ww + ww / 2, k * ww + ww / 2, 'chips', this.dungeonmap[i][k]);
                chip.setScale(ww/8,(ww/8)+0.2);
                chip.setOrigin(0.5);
           }
       }
       imap.doors.forEach(element=>{
           var ww = systemconstant.tilex;
           element.climage = this.add.sprite(element.x*ww+ww/2,element.y*ww+ww/2,'chips',element.cimnum).setScale(ww / 8, (ww / 8) + 0.2).setOrigin(0.5).setVisible(true);
           element.opimage = this.add.sprite(element.x * ww + ww / 2, element.y * ww + ww / 2, 'chips', element.oimnum).setScale(ww / 8, (ww / 8) ).setOrigin(0.5).setVisible(false);
            //console.log(element);
       });
       this.dark=new Array();
        for (var i = 0; i < m.length; i++) {
            this.dark[i]=new Array;
            for (var k = 0; k < m[i].length; k++) {
                var ww = systemconstant.tilex;
                this.dark[i][k] = this.add.sprite(i * ww + ww / 2, k * ww + ww / 2, 'chips', 255).setScale(ww / 8, (ww / 8) + 0.2).setOrigin(0.5).setDepth(19);
            }
        }
    }
    nextfloor(){
        this.floornum++;
        var nowf=this.dungeon.length;
        while(this.dungeon.length<=this.floornum){
            this.dungeon.push(new gmap(this));
            nowf++;
        }
    }
    maefloor(){
    }
    mapgen():gmap{
        return new gmap(this);
    }
}