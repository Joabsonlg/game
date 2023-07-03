import {Scene} from 'phaser';
import {Score} from '../../classes/Score.js';

export class UIScene extends Scene {
    score = 0;

    constructor() {
        super('ui-scene');
    }

    create() {
        this.score = new Score(this, 15, 15, 0);
    }
}