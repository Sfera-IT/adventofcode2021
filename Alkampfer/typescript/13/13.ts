import * as fs from 'fs';
import {uniqBy, maxBy, result, fromPairs, forEach} from 'lodash';

export class Point {
    constructor(public x: number, public y: number) {
    }
}

export class Game {
    constructor(public points: Array<Point>, public folds: Array<string>) {
    }

    public performFolds() {
        // ok first of all we need to iterate for each fold and understand what to do
        let iteration = 1;
        for (let fold of this.folds) {
            const foldParts = fold.substring(fold.lastIndexOf(' ') + 1, 42).split('=');
            this.fold(foldParts);
        }
    }

    private fold(foldParts: Array<string>) {
        // ok now we need to know which axes we need to fold, this will generate a new array
        // of point because point will shift
        const foldAmount = parseInt(foldParts[1], 10);
        if (foldParts[0] === 'y') {
            for (let point of this.points) {
                if (point.y > foldAmount) {
                    // folding inyx coordinates meaning that y coordinate will be unchanged, while y will fold.
                    point.y = foldAmount - (point.y - foldAmount);
                }
            }
        } else {
            for (let point of this.points) {
                if (point.x > foldAmount) {
                    // opposite of y
                    point.x = foldAmount - (point.x - foldAmount);
                }
            }
        }

        // ok now we need to remove duplicate
        this.points = uniqBy(this.points, (point: Point) => {
            return point.x + ',' + point.y;
        });
    }

    public Plot(): string {
        const maxY = maxBy(this.points, (point: Point) => {
            return point.y;
        }) as Point;

        const maxX = maxBy(this.points, (point: Point) => {
            return point.x;
        }) as Point;

        // from here on, this is the suggestion of copilot, I'd have done differently
        // but this worked so well that I've left it as is.

        // let result = ""; //here I had copilot solution
        // for (let y = 0; y <= maxY.y; y++) {
        //     for (let x = 0; x <= maxX.x; x++) {
        //         const point = this.points.find((point: Point) => {
        //             return point.x === x && point.y === y;
        //         });
        //         if (point) {
        //             result += '#';
        //         } else {
        //             result += '.';
        //         }
        //     }
        //     result += '\n';
        // }

        //return result;

        // This is solution I've imagined originally, since we have no much points, instead of
        // performing a search in the points array for each dot, better build matrix in memory then plot
        const rows = new Array<Array<number>>();
        for (let y = 0; y <= maxY.y; y++) {
            rows.push(new Array<number>());
        }

        forEach(this.points, (point: Point) => {
            rows[point.y][point.x] = 1;
        });

        // now that I've my matrix I can simply proceed to print it line by line
        let screen: string = "";
        for (let y = 0; y <= rows.length - 1; y++) {
            for (let x = 0; x <= rows[0].length - 1; x++) {
                if (rows[y][x] === 1) {
                    screen += '#';
                } else {
                    screen += '.';
                }
            }
            screen += '\n';
        }

        return screen;
    };
}

export function LoadFile(filename: string): Game {
    const points = new Array<Point>();
    const lines = fs.readFileSync(filename, 'utf8').split('\n');
    const instructions = new Array<string>();
    let pointFinshed = false;
    for (let line of lines) {
        if (line.length == 0) {
            pointFinshed = true;
            continue;
        } else if (!pointFinshed) {
            const coord = line.split(',');
            points.push(new Point(parseInt(coord[0]), parseInt(coord[1])));
        } else {
            instructions.push(line);
        }
    }
    return new Game(points, instructions);
}

