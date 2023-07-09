import {Text} from "./Text";

export class Score extends Text {
    lives = 3;

    constructor(scene, x, y, initScore = 0) {
        super(scene, x, y, `Lives: 3`);
        scene.add.existing(this);
        this.scoreValue = initScore;
    }

    update() {
        this.setText(`Lives: ${this.lives}`);
    }

    setValue(value) {
        this.lives = value;
    }

    getValue() {
        return this.lives;
    }
}