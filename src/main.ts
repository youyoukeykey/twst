import { systemconstant } from './module/const';
import {GameScene} from './module/GameScene';
import{controlescene} from './module/controleScene';
import{UIscene} from './module/UIscene';
const config: Phaser.Types.Core.GameConfig = {
    //画面サイズ
    width: systemconstant.appw,
    height: systemconstant.apph,
    type: Phaser.AUTO,
    //ゲーム画面を描画するcanvasを書き出す先
    parent: 'roguelike',
    //ゲーム画面を伸縮して表示させるための設定
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'roguelike',
    },
    //あとでコメントアウトを解除する
    //必要なシーンを読み込む
   scene: [GameScene,controlescene,UIscene],
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
        this.scene.start('GameScene');
    }
}

//HTMLがロードされた後にインスタンスを生成する
window.addEventListener('load', () => {
    const game = new Game(config);
});
