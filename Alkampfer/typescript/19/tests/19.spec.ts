import 'jest';
import {
    LoadScanners,
    Point, Scanner,
    RepositionScanner
} from '../19';
import * as fs from 'fs';
import {forEach} from "lodash";
const each = require("jest-each").default;

describe('Day 19', () => {

    it ("Basic Read", () => {
        const scanners = LoadScanners("input1.txt");
        expect(scanners.length).toBe(5);
        forEach(scanners, (scanner: Scanner) => {
            expect(scanners[0].points.length).toBe(25);
        });
    });

    it ("Intersect Read", () => {
        const scanner1 = new Scanner("a");
        scanner1.points.push(new Point(0, 1, 2), new Point(1, 3, 4));
        const scanner2 = new Scanner("b");
        scanner2.points.push(new Point(0, 1, 2), new Point(1, -3, 4));
        const intersection = scanner1.intersect(scanner2);
        expect(intersection.length).toBe(1);
        expect(intersection[0]).toBe(scanner1.points[0]);
    });

    it ("Part 1", () => {
        const scanners = LoadScanners("input.txt");
        const result = RepositionScanner(scanners);
        const finalArray: Array<Point> = [];
        forEach(result, (scanner: Scanner) => {
            forEach(scanner.points, (point: Point) => {
                if (!finalArray.some(n2  => point.equals(n2))) {
                    finalArray.push(point);
                }
            });
        });
        expect(finalArray.length).toBe(454);
    });

    it ("Taxicab", () => {

        // Thanks god I've dumped all the relative position ... it took one and an half hour to calculate everything.
        const point: Array<Point> = new Array<Point>();
        point.push(new Point(4, 47, -1267));
        point.push(new Point(1074, 32, -1341));
        point.push(new Point(-1258, 49, -1267));
        point.push(new Point(1110, 51, -2440));
        point.push(new Point(2398, -33, -2485));
        point.push(new Point(3535, 58, -2506));
        point.push(new Point(3614, -37, -3709));
        point.push(new Point(4650, -71, -3704));
        point.push(new Point(3450, 70, -1337));
        point.push(new Point(2306, -92, -3602));
        point.push(new Point(2277, 1100, -3708));
        point.push(new Point(3450, -1269, -1281));
        point.push(new Point(4808, -1260, -1223));
        point.push(new Point(3601, -2448, -1175));
        point.push(new Point(3614, -1233, -84));
        point.push(new Point(2295, -2518, -1152));
        point.push(new Point(2284, -3607, -1157));
        point.push(new Point(3591, -1195, -3613));
        point.push(new Point(3521, 45, -4834));
        point.push(new Point(2258, 18, -1189));
        point.push(new Point(1027, -1288, -1269));
        point.push(new Point(2359, -2524, -2370));
        point.push(new Point(2233, -2346, -3656));
        point.push(new Point(1064, -2455, -3581));
        point.push(new Point(2414, -2378, -4758));
        point.push(new Point(2348, -1129, -4890));
        point.push(new Point(2416, -1143, -5988));
        point.push(new Point(1045, -1158, -3701));
        point.push(new Point(1152, -2397, -4904));
        point.push(new Point(2379, -1273, -3685));
        point.push(new Point(3466, 1266, -1242));
        point.push(new Point(4639, -28, -1265));
        point.push(new Point(5892, -6, -1222));
        point.push(new Point(5965, 49, -2516));
        point.push(new Point(1201, -1241, 8));
        point.push(new Point(1089, -2498, -141));
        point.push(new Point(-16, -2343, -81));

        let maxDistance = 0;
        for (let i = 0; i < point.length; i++) {
            for (let j = i + 1; j < point.length; j++) {
                const distance = point[i].taxicab(point[j]);
                if (distance > maxDistance) {
                    maxDistance = distance;
                }
            }
        }
        expect(maxDistance).toBe(10813);
    });
});
