import * as fs from 'fs';
import * as path from 'path';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
const lines : Array<string> = input.split("\n");

// exercise

class Line {
    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;
    
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    isVertical() : boolean {
        return (this.x1 == this.x2);
    }

    isHorizontal() : boolean {
        return (this.y1 == this.y2);
    }


    getPoints() {

        let points : Array<Array<number>> = [];

        if (this.isHorizontal()) {
            let from = (this.x1 < this.x2) ? this.x1 : this.x2;
            let to = (this.x1 < this.x2) ? this.x2 : this.x1;

            points = [];
            for (let i = from; i <= to; i++) {
                points.push([i, this.y1]);
            }
            return points;
        }

        if (this.isVertical()) {
            let from = (this.y1 < this.y2) ? this.y1 : this.y2;
            let to = (this.y1 < this.y2) ? this.y2 : this.y1;

            points = [];
            for (let i = from; i <= to; i++) {
                points.push([this.x1, i]);
            }
            return points;
        }

        // if not horizontal nor vertical, is 45° by specifications
        // not working for different angles
        let incrementX = (this.x1 < this.x2) ? +1 : -1;
        let incrementY = (this.y1 < this.y2) ? +1 : -1;

        let x = this.x1;
        let y = this.y1;
        points = [];
        while (true) {
            points.push([x,y]);
            if (x == this.x2)
                break;

            x = x+incrementX;
            y = y+incrementY;
        }

        return points;
    }


}

const regex = /([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/;

let linesArray : Array<Line> = [];

lines.forEach((v) => {

    let result = v.match(regex);
    let newLine = new Line(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]), parseInt(result[4]));
    linesArray.push(newLine);
});



// exercise 1

let hvLines = linesArray.filter(v => v.isHorizontal() || v.isVertical());

let pointsMap = {};

hvLines.forEach((v) => {
    v.getPoints().forEach(singlePoint => {
        let pointKey = singlePoint.join('-');

        if (!(pointKey in pointsMap)) {
            pointsMap[pointKey] = 1;
        } else {
            pointsMap[pointKey]++;
        }
    });

});

let cnt : number = 0;
for(let key in pointsMap) {
    let value = pointsMap[key];
    cnt += ((value >= 2) ? 1 : 0);
}
console.log(cnt);

// exercise 2
pointsMap = {};
linesArray.forEach((v) => {
    v.getPoints().forEach(singlePoint => {
        let pointKey = singlePoint.join('-');

        if (!(pointKey in pointsMap)) {
            pointsMap[pointKey] = 1;
        } else {
            pointsMap[pointKey]++;
        }
    });
});

cnt = 0;
for(let key in pointsMap) {
    let value = pointsMap[key];
    cnt += ((value >= 2) ? 1 : 0);
}
console.log(cnt);



console.log('end');


