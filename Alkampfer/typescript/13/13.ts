import * as fs from 'fs';
import {uniqBy, maxBy} from 'lodash';

export class Point {
    constructor(public x: number, public y: number) {
    }

    [key: string]: number;
}

export class Game {
    constructor(public points: Array<Point>, public folds: Array<string>) {
    }

    public performFolds() {
        // we need to iterate for each fold and understand what to do
        for (let fold of this.folds) {
            const foldParts = fold.substring(fold.lastIndexOf(' ') + 1, 42).split('=');
            this.fold(foldParts);
        }
    }

    private fold(foldParts: Array<string>) {
        // ok now we need to know which axes we need to fold, this will generate a new array
        // of point because point will shift
        const foldAmount = parseInt(foldParts[1], 10);
        for (let point of this.points) {
            const axis: string = foldParts[0];
            if (point[axis] > foldAmount) {
                // opposite of y
                point[axis] = foldAmount - (point[axis] - foldAmount);
            }
        }

        // ok now we need to remove duplicate
        this.points = uniqBy(this.points, (point: Point) => {
            return point.x + ',' + point.y;
        });
    }

    public Plot() {

        const maxY = maxBy(this.points, (point: Point) => point.y) as Point;
        const maxX = maxBy(this.points, (point: Point) =>  point.x) as Point;

        // plot on screen
        for (let y = 0; y <= maxY.y; y++) {
            for (let x = 0; x <= maxX.x; x++) {
                process.stdout.write(this.points.find((point: Point) => point.x === x && point.y === y) ? '#' : ' ');
            }
            process.stdout.write('\n');
        }
    };
}

export function LoadFile(filename: string): Game {
    const points = new Array<Point>();
    const lines = fs.readFileSync(filename, 'utf8').split('\n');
    const instructions = new Array<string>();

    for (let line of lines) {
        if (line.length > 0) {
            if (line[0] >= '0' && line[1] <= '9') {
                const coord = line.split(',');
                points.push(new Point(parseInt(coord[0], 10), parseInt(coord[1], 10)));
            } else {
                instructions.push(line);
            }
        }
    }
    return new Game(points, instructions);
}

