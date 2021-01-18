import * as phaser from 'phaser';
export class content{
    public text:string;
    public select:()=>void;
}
export class window{
    public an:phaser.GameObjects.Sprite;
    public tex=new Array<phaser.GameObjects.Text>();
    public contents:content[];
    public nowselexted:number;
    constructor(pp:phaser.GameObjects.Sprite){
        this.an=pp;
    }
    public down(){
        this.nowselexted++;
    }
    public up(){
        this.nowselexted--;
    }
    public hyoujiupdate(){
        for(var i=0;i<this.tex.length;i++){
            var a=this.tex[i];
            a.setText(this.contents[i].text);
            if(i==this.nowselexted){
                a.setColor("#ff1100");
            }
        }
    }
    public draw(){
        this.an.setVisible(true);
        this.tex.forEach(element=>{
            element.setVisible(true);
        });
    }
    public invisible() {
        this.an.setVisible(false);
        this.tex.forEach(element => {
            element.setVisible(false);
        });
    }
}