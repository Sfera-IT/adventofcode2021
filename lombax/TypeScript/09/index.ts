import * as fs from 'fs';
import * as path from 'path';

let t0 = Date.now();

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let lines : Array<string> = input.split("\n");

class Point {
    private _height: number;
    private _x: number;
    private _y: number;
    private _matrix: Array<Array<string>>;

    constructor(    height: number,
                    x: number,
                    y: number,
                    matrix: Array<Array<string>>
    ) {
        this._height = height;
        this._x = x;
        this._y = y;
        this._matrix = matrix;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    public linkedNodes() {
        let linkedNodes = [];
        linkedNodes.push((this._x > 0) ? new Point(parseInt(this._matrix[this._x-1][this._y]), this._x-1, this._y, this._matrix) : null);
        linkedNodes.push((this._x < this._matrix.length-1) ? new Point(parseInt(this._matrix[this._x+1][this._y]), this._x+1, this._y ,this._matrix) : null);
        linkedNodes.push((this._y < this._matrix[this._x].length-1) ? new Point(parseInt(this._matrix[this._x][this._y+1]), this._x , this._y+1, this._matrix) : null);
        linkedNodes.push((this._y > 0) ? new Point(parseInt(this._matrix[this._x][this._y-1]), this._x , this._y-1, this._matrix) : null)

        linkedNodes = linkedNodes.filter((v) => v !== null);

        return linkedNodes;
    }

    public isLowest() : boolean {
        let lowestNodes = this.linkedNodes().filter(v => this._height >= v.height);

        return lowestNodes.length == 0;
    }

    public getRiskLevel() : number {
        return 1+this._height;
    }

    public getBasin(basinPoints = {}) {

        if (this.height == 9)
            return;

        // start pushing this to the basin points
        if (basinPoints[`${this.x}-${this.y}`] !== undefined)
            return

        basinPoints[`${this.x}-${this.y}`] = this;

        let higherNodes = this.linkedNodes().filter(v => (v.height !== 9));

        higherNodes.forEach((p) => {
            p.getBasin(basinPoints);
        })
    }
}

let pointMatrix = lines.map(v => v.split(''));

let points = [];
let lowestPoints = [];
let risk = 0;

// create points
for (let i = 0; i < pointMatrix.length; i++) {
    for (let j = 0; j < pointMatrix[i].length; j++) {
        const pointHeight = pointMatrix[i][j];

        const point = new Point(parseInt(pointHeight), i, j, pointMatrix);
        points.push(point);

        if (point.isLowest()) {
            lowestPoints.push(point);
            risk += point.getRiskLevel();
        }
    }
}


let t1 = Date.now();
console.log('Solution 1: '+risk);

let sizes = [];
let allBasins = [];
lowestPoints.forEach((p) => {
    let basins = [];
    p.getBasin(basins);
    basins = Object.values(basins);
    allBasins.push(basins);

    sizes.push(basins.length);

});

sizes.sort((a,b) => b - a);

// get first 3 and multiply
let res = sizes.slice(0, 3).reduce((a, b)=> a*b, 1);

let t2 = Date.now();
console.log('Solution 2: '+res);

console.log(`Time 1 ${t1-t0} - Time 2 ${t2-t1}`);

