import {GameObjects} from 'phaser';

export class Text extends GameObjects.Text {
    constructor(scene, x, y, text) {
        super(scene, x, y, text, {
            fontSize: '24px',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 4,
        });
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }
}