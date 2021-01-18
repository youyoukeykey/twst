import * as phaser from 'phaser';
import * as sys from './const';
import * as gamescene from './GameScene';
export var ifBloaded=false;
export class controlescene extends phaser.Scene{
    private games:gamescene.GameScene;
    constructor(){
        super({key:'controlescene',active:false});
    }
    preload(){
        this.load.atlasXML('buttons','images/sprites.png','images/sprites.xml');
    }
    create(){
        var up=this.add.sprite(80,400,'buttons','up.png');
        up.setOrigin(0.5);
        up.setScale(0.7);
        up.setInteractive().on('pointerdown',(pointer)=>this.press(pointer,0));
        var right = this.add.sprite(130, 450, 'buttons', 'right.png');
        right.setOrigin(0.5);
        right.setScale(0.7);
        right.setInteractive().on('pointerdown', (pointer) => this.press(pointer, 1));
        var left = this.add.sprite(30, 450, 'buttons', 'left.png');
        left.setOrigin(0.5);
        left.setScale(0.7);
        left.setInteractive().on('pointerdown', (pointer) => this.press(pointer, 3));
        var down = this.add.sprite(80, 500, 'buttons', 'down.png');
        down.setOrigin(0.5);
        down.setScale(0.7);
        down.setInteractive().on('pointerdown', (pointer) => this.press(pointer, 2));
        //console.log("done");
        ifBloaded=true;
    }
    press(pointer,num:number){
        this.games=this.scene.get('GameScene')as gamescene.GameScene;
        ////console.log("aa");
        this.games.buttonpushed(num);
    }
}