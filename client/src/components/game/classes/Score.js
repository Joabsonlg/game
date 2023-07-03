import {Text} from "./Text";

export class Score extends Text {
    const
    scoreValue = 0;

    constructor(scene, x, y, initScore = 0) {
        super(scene, x, y, `Score: ${initScore}`);
        scene.add.existing(this);
        this.scoreValue = initScore;
    }

    scoreOperations = {
        'INCREASE': (value) => this.scoreValue += value,
        'DECREASE': (value) => this.scoreValue -= value,
        'SET_VALUE': (value) => this.scoreValue = value,
    }

    changeValue(operation, value) {
        switch (operation) {
            case 'INCREASE':
                this.scoreOperations[operation](value);
                break;
            case 'DECREASE':
                this.scoreOperations[operation](value);
                break;
            case 'SET_VALUE':
                this.scoreOperations[operation](value);
                break;
            default:
                throw new Error('Invalid operation');
        }
        this.setText(`Score: ${this.scoreValue}`);
    }

    getValue() {
        return this.scoreValue;
    }
}