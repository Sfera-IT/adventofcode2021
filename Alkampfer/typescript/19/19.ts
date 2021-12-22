import * as fs from "fs";
import {forEach, intersection} from "lodash";
import {PSKCallbackNegotation} from "tls";

export class Point {
    constructor(public x: number, public y: number, public z: number) { }

    public toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
    /**
     * Subtracting two points will return another point, needed for translation of the beacon
     */
    public Subtract(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public Permutate(permutation: number) : Point {
        return this._permutations[permutation](this);
    }

    public equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y && this.z === point.z;
    }

    private _permutations:  { [permutation: number]: (point: Point) => Point } = {
        0: (point: Point) => new Point(point.x, point.y, point.z),
        1: (point: Point) => new Point(-point.x, point.y, point.z),
        2: (point: Point) => new Point(point.x, -point.y, point.z),
        3: (point: Point) => new Point(point.x, point.y, -point.z),
        4: (point: Point) => new Point(-point.x, -point.y, point.z),
        5: (point: Point) => new Point(point.x, -point.y, -point.z),
        6: (point: Point) => new Point(-point.x, point.y, -point.z),
        7: (point: Point) => new Point(-point.x,- point.y, -point.z),

        8: (point: Point) => new Point(point.y, point.x, point.z),
        9: (point: Point) => new Point(-point.y, point.x, point.z),
        10: (point: Point) => new Point(point.y, -point.x, point.z),
        11: (point: Point) => new Point(point.y, point.x, -point.z),
        12: (point: Point) => new Point(-point.y, -point.x, point.z),
        13: (point: Point) => new Point(point.y, -point.x, -point.z),
        14: (point: Point) => new Point(-point.y, point.x, -point.z),
        15: (point: Point) => new Point(-point.y,- point.x, -point.z),

        16: (point: Point) => new Point(point.y, point.z, point.x),
        17: (point: Point) => new Point(-point.y, point.z, point.x),
        18: (point: Point) => new Point(point.y, -point.z, point.x),
        19: (point: Point) => new Point(point.y, point.z, -point.x),
        20: (point: Point) => new Point(-point.y, -point.z, point.x),
        21: (point: Point) => new Point(point.y, -point.z, -point.x),
        22: (point: Point) => new Point(-point.y, point.z, -point.x),
        23: (point: Point) => new Point(-point.y,- point.z, -point.x),

        24: (point: Point) => new Point(point.x, point.z, point.y),
        25: (point: Point) => new Point(-point.x, point.z, point.y),
        26: (point: Point) => new Point(point.x, -point.z, point.y),
        27: (point: Point) => new Point(point.x, point.z, -point.y),
        28: (point: Point) => new Point(-point.x, -point.z, point.y),
        29: (point: Point) => new Point(point.x, -point.z, -point.y),
        30: (point: Point) => new Point(-point.x, point.z, -point.y),
        31: (point: Point) => new Point(-point.x,- point.z, -point.y),

        32: (point: Point) => new Point(point.z, point.x, point.y),
        33: (point: Point) => new Point(-point.z, point.x, point.y),
        34: (point: Point) => new Point(point.z, -point.x, point.y),
        35: (point: Point) => new Point(point.z, point.x, -point.y),
        36: (point: Point) => new Point(-point.z, -point.x, point.y),
        37: (point: Point) => new Point(point.z, -point.x, -point.y),
        38: (point: Point) => new Point(-point.z, point.x, -point.y),
        39: (point: Point) => new Point(-point.z,- point.x, -point.y),

        40: (point: Point) => new Point(point.z, point.y, point.x),
        41: (point: Point) => new Point(-point.z, point.y, point.x),
        42: (point: Point) => new Point(point.z, -point.y, point.x),
        43: (point: Point) => new Point(point.z, point.y, -point.x),
        44: (point: Point) => new Point(-point.z, -point.y, point.x),
        45: (point: Point) => new Point(point.z, -point.y, -point.x),
        46: (point: Point) => new Point(-point.z, point.y, -point.x),
        47: (point: Point) => new Point(-point.z,- point.y, -point.x),
    };

    taxicab(point1: Point) {
        return Math.abs(point1.x - this.x) + Math.abs(point1.y - this.y) + Math.abs(point1.z - this.z);
    }
}

export class Scanner {
    constructor(public name: string) {
    }

    public position: Point = new Point(0, 0, 0);
    public points: Array<Point> = [];

    /**
     * Translation operation is needed to reposition a scanner relative to another scanner
     * @param x
     * @param y
     * @param z
     */
    public translate(x: number, y: number, z: number): Scanner {
        const translatedScanner = new Scanner(this.name);
        forEach(this.points, (point: Point) => {
            translatedScanner.points.push(new Point(point.x + x, point.y + y, point.z + z));
        });
        translatedScanner.position = new Point(x,  y, z);
        return translatedScanner;
    }

    public permutate(permutation: number): Scanner {
        const permutatedScanner = new Scanner(this.name);
        forEach(this.points, (point: Point) => {
            permutatedScanner.points.push(point.Permutate(permutation));
        });
        return permutatedScanner;
    }

    public intersect(scanner: Scanner) : Array<Point> {
        return this.points.filter(n => scanner.points.some(n2  => n.equals(n2)));
    }
}

export function LoadScanners(fileName: string): Array<Scanner> {

    const result = new Array<Scanner>();
    let lines = fs.readFileSync(fileName, 'utf8').split('\n');
    let currentScanner: Scanner;
    forEach(lines, (line) => {
        const l = line.trim();
        if (l.length > 0) {
            if (l.startsWith('--- ')) {
                currentScanner = new Scanner(l);
                result.push(currentScanner);
            } else {
                const parts = l.split(',');
                currentScanner.points.push(new Point(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])));
            }
        }
    });
    return result;
}

/**
 * Part one of the exercise, reposition all the scanners.
 * @param scanners
 * @constructor
 */
export function RepositionScanner(scanners: Array<Scanner>): Array<Scanner> {
    // ok we can try bruteforce, we need to reposition all scanners, we start from
    // first scanner then try to reposition all the others
    const result = new Array<Scanner>();
    const remaining =  [...scanners];
    // lets assume the first scanner is ok, both in position and orientation, this is an
    // assumption that is always true, we have no absolute in positions
    result.push(remaining.shift() as Scanner);


    // at least one should match 12 points with one of the result array
    while (remaining.length > 0) {
        const remainingScanners = remaining.length;
        // we do not know which one of the remaining array can match, we need to try all of them
        for (let i = 0; i < remaining.length; i++) {
            const scanner = remaining[i];
            // now we need to check this scanner against all other scanner in result

            const matchedScanner = CheckScanner(scanner);
            if (matchedScanner !== undefined) {
                result.push(matchedScanner);
                remaining.splice(i, 1);
                break;
            }
        }

        if (remainingScanners === remaining.length) {
            // we did not find any match, this is an error
            throw new Error('No more match found, some error in the algorithm. remaining: ' + remaining.length);
        }
    }

    return result;

    /**
     * Check if scanner is a match with matched scanner, if there is a match
     * this function will return the matched scanner translated and permutated
     * @param scanner
     * @constructor
     */
    function CheckScanner(scanner: Scanner): Scanner | undefined {

        for(let i = 0; i < 48; i++) {
            //ok we have to try all permutations, lets permutate.
            const permutatedScanner = scanner.permutate(i);

            // now iterate for all the results that we already found
            for (let j = 0; j < result.length; j++) {
                 const referenceScanner = result[j];
                 // now we need to try all possible translation in the space.
                 for (let k = 0; k < referenceScanner.points.length; k++) {

                     for (let refPoint = 0; refPoint < permutatedScanner.points.length; refPoint++) {
                         const point = referenceScanner.points[k];
                         const translation = permutatedScanner.points[refPoint].Subtract(point);

                         const translatedScanner = permutatedScanner.translate(-translation.x, -translation.y, -translation.z);
                         // ok now we need to find the intersection of all points
                         const intersection = translatedScanner.intersect(referenceScanner);
                         // if (translatedScanner.name.indexOf('4') !== -1 && referenceScanner.name.indexOf('1') !== -1) {
                         //     process.stdout.write(`Checking ${permutatedScanner.name} against ${referenceScanner.name} match ${intersection.length} with permutation ${i} translation ${translatedScanner.position}\n`);
                         // }

                         // if (translatedScanner.position.x === -20) {
                         //     console.log("match")
                         // }

                         if (intersection.length >= 12) {
                             //ok this is a match
                             console.log(`Found match for ${scanner.name} with ${referenceScanner.name} and a translation vector of ${translatedScanner.position.toString()}`);
                             return translatedScanner;
                         }
                     }
                 }
            }
        }
        return undefined;
    }
}