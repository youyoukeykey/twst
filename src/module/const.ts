export var publicjsonobj:JSON;
export class status {
    public name: string;
    public hp: number;
    public nowhp: number;
    public mp: number;
    public nowmp: number;
    public speed: number;
    public atk: number;
    public def: number;
    public mag: number;
    public exp=0;
    public giveexp=100;
    constructor(
        name: string,
        hp: number,
        nowhp: number,
        mp: number,
        nowmp: number,
        speed: number,
        atk: number,
        def: number,
        mag: number,
    ) {
        this.name=name;
        this.hp=hp;
        this.mp=mp;
        this.nowmp=nowmp;
        this.nowhp=nowhp;
        this.speed=speed;
        this.atk=atk;
        this.def=def;
        this.mag=mag;
    }
}
export namespace systemconstant{
    export const appw=320;
    export const apph=680;
    export const tilex=30;
    export const maplength=30;
    export const waitflame=10;
    export function maptoglX(x: number): number {
        if (x >= 0) {
            return tilex * (x+0.5);
        }
        return 1;
    };
    export function maptoglY(y: number): number {
        if (y >= 0) {
            return tilex * (y + 0.5);//正方形の前提
        }
        return 1;
    };
    export const defsts=new status("noname",10,10,10,10,10,10,10,10);
}