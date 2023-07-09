import {Scene} from 'phaser';
import {Score} from '../../classes/Score.js';

export default class UIScene extends Scene {
    score = 0;
    lives = 3;

    constructor() {
        super('ui-scene');
    }

    create() {
        this.score = new Score(this, 5, 5, 0);
    }

    setLife(value) {
        this.score.setValue(value);
    }

    update() {
        console.log('update ui');
        this.score.update();
    }
}

export const uiScene = new UIScene();