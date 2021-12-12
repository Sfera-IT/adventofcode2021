import * as fs from 'fs';
import * as path from 'path';
import {start} from "repl";
import { v4 as uuidv4 } from 'uuid';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let lines : Array<string> = input.split("\n");

let t0 = Date.now();


class Point {
    public id = '';
    public connectedPoints = [];
    public isBig = true;

    public smallPointMaxVisits = 1;

    constructor(id : string) {
        this.id = id;
        this.isBig = (id === id.toUpperCase());
    }

    addPoint(point : Point) {
        if (point.id !== this.id) {
            this.connectedPoints.push(point);
        }
    }

    goToPoint(last : Point, paths, currentPoint : Point = null, currentPath = new TraversablePath()) {

        // initialization
        if (currentPoint === null) {
            currentPoint = this;
        }

        currentPath.addPoint(currentPoint);

        // stop condition
        if (currentPoint === last) {
            paths.push(currentPath);
            return;
        }

        let nextAvailablePoints = currentPoint.connectedPoints.filter((p) => {

            // exclude all the small points already visited
            if (p.isBig) {
                return true;
            } else {
                return currentPath.getVisit(p) <= p.smallPointMaxVisits-1 && p.id !== 'start';
            }
        });

        if (nextAvailablePoints.length === 0)
            return; // no more points


        for (let i = 0; i < nextAvailablePoints.length; i++) {
            let nextPoint = nextAvailablePoints[i];
            let actualPath = TraversablePath.newFromTraversablePath(currentPath);
            nextPoint.goToPoint(last,paths, nextPoint, currentPath);

            currentPath = TraversablePath.newFromTraversablePath(actualPath);

        }

        return;
    }

}

class PointRepository {
    public static points : Array<Point> = [];

    static pointForId(pointAsString : string) : Point {
        let res = this.points.filter((v) => v.id == pointAsString);
        if (res.length === 0) {
            let newPoint = new Point(pointAsString);
            this.points.push(newPoint);
            return newPoint;
        } else if (res.length > 1) {
            throw new Error("duplicated points");
        } else {
            return res[0];
        }

        throw new Error("should not be here");
    }
}

class TraversablePath {

    public pointVisits = [];
    public points = [];

    static newFromTraversablePath(path : TraversablePath) {
        let n = new TraversablePath();
        n.pointVisits = Object.assign({}, path.pointVisits); // copy object
        n.points = path.points.slice(); // copy array
        return n;
    }

    getVisit(p: Point) : number {
        let pointVisit = this.pointVisits[p.id];

        if (pointVisit === undefined) {
            return 0;
        }

        return pointVisit;
    }

    addPoint(p: Point) {

        if (p.id === 'dc') {
            console.log();
        }

        let pointVisit = this.pointVisits[p.id];

        if (pointVisit === undefined) {
            this.pointVisits[p.id] = 1;
        } else {
            if (!p.isBig && this.pointVisits[p.id] >= p.smallPointMaxVisits) {
                throw new Error('point cannot be visited');
            }
            this.pointVisits[p.id]++;
        }


        this.points.push(p);
    }

}


function createPointsFromString(str : string) {
    const items = str.split('-');
    const p1 = PointRepository.pointForId(items[0]);
    const p2 = PointRepository.pointForId(items[1]);
    p1.addPoint(p2);
    p2.addPoint(p1);
    return;
}

function removeDuplicates(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}


lines.forEach((v) => createPointsFromString(v));
let allPoints = PointRepository.points;
let startingPoint = allPoints.filter((v) => v.id === 'start').shift();
let endingPoint = allPoints.filter((v) => v.id === 'end').shift();

let possiblePaths = [];
startingPoint.goToPoint(endingPoint, possiblePaths);



let t1 = Date.now();
console.log('Solution 1: '+possiblePaths.length);

let smallPoints = allPoints.filter((v) => !v.isBig);


possiblePaths = [];

for (let i = 0; i < smallPoints.length; i++) {
    let p = smallPoints[i];

    allPoints.forEach((v) => {
        if (v === p) {
            if (v.id !== 'start' && v.id !== 'end') {
                v.smallPointMaxVisits = 2;
            }
        }
    })

    startingPoint.goToPoint(endingPoint, possiblePaths);

    allPoints.forEach((v) => {
        if (v === p) {
            v.smallPointMaxVisits = 1;
        }
    });
}


let validPaths = [];
for (const [key, value] of Object.entries(possiblePaths)) {
    if (value.points[value.points.length - 1].id === 'end')
        validPaths.push(value.points.map((p) => p.id).join(','));
}

let uniquePaths = removeDuplicates(validPaths);


let t2 = Date.now();
console.log('Solution 2: '+uniquePaths.length);

console.log(`Time 1 ${t1-t0} - Time 2 ${t2-t1}`);

