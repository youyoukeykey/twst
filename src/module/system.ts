import {charactor}from'./charactor';
import { addmes } from "./UIscene";
export namespace battle{
    export function attack(cn:charactor,cj:charactor){
        if(Math.random()*100>8){
        var damage = Math.round(cn.state.atk * (Math.pow(0.9375,cj.state.def)));
        cj.state.nowhp-=damage;
        if(cn.jinei==-1){
            addmes(cj.state.name+"に"+damage+"のダメージを与えた");
        }else{
            if(cj.jinei==-1){
                addmes(cn.state.name + "から" + damage + "のダメージを受けた");
            }
        }
    }else{
            addmes("攻撃が空を切った");
    }
    }
    export function magichit(){
    }
}