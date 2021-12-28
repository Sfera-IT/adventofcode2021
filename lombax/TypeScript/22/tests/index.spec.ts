import 'jest';

import Cuboid from "../Cuboid";
import Utils from "../Utils";
import {json} from "stream/consumers";


describe('Test suite', () => {

    it ("Cuboid Overlaps", () => {

        let cuboid1;
        let cuboid2;

        // test suite: cuboid1, cuboid2, overlaps
        let cuboids = [

            // some tests
            [[10,12,10,12,10,12], [10,12,10,12,10,12], true],
            [[12,14,12,14,12,14], [10,12,10,12,10,12], true],
            [[11,13,11,13,11,13], [10,12,10,12,10,12], true],


            [[10,12,10,12,10,12], [11,13,10,12,10,12], true], // traslate of 1 on x axis -> must overlap
            [[10,12,10,12,10,12], [12,14,10,12,10,12], true], // traslate of 2 on x axis -> must overlap
            [[10,12,10,12,10,12], [13,15,10,12,10,12], false], // traslate of 3 on x axis -> must NOT overlap

            [[10,12,10,12,10,12], [10,12,11,13,10,12], true], // traslate of 1 on y axis -> must overlap
            [[10,12,10,12,10,12], [10,12,12,14,10,12], true], // traslate of 2 on y axis -> must overlap
            [[10,12,10,12,10,12], [10,12,13,15,10,12], false], // traslate of 2 on y axis -> must NOT overlap

            [[10,12,10,12,10,12], [10,12,10,12,11,13], true], // traslate of 1 on z axis -> must overlap
            [[10,12,10,12,10,12], [10,12,10,12,12,14], true], // traslate of 2 on z axis -> must NOT overlap
            [[10,12,10,12,10,12], [10,12,10,12,13,15], false], // traslate of 2 on z axis -> must NOT overlap

            [[9,11,9,11,9,11], [10,12,10,12,10,12], true], // must overlap
            [[10,12,10,12,10,12], [9,11,9,11,9,11], true], // must overlap

            // cuboid with border in common
            [[10,12,10,12,10,12], [12,13,12,13,12,13], true], // must overlap
            [[12,13,12,13,12,13], [10,12,10,12,10,12], true], // must overlap

            // negative values
            [[-10,10,-10,10,-10,10], [0,10,0,10,0,10], true],
            [[-10,10,-10,10,-10,10], [-1,15,-2,15,-3,9], true],
            [[-10,10,-10,10,-10,10], [-12,-10,-12,-10,-12,-10], true],
            [[-10,10,-10,10,-10,10], [-12,-10,-12,-10,-12,-10], true],
            [[-10,10,-10,10,-10,10], [-12,-11,-12,-10,-12,-10], false]

        ];

        cuboids.forEach((c) => {
            cuboid1 = new Cuboid(true, c[0][0],c[0][1],c[0][2],c[0][3],c[0][4],c[0][5]);
            cuboid2 = new Cuboid(true, c[1][0],c[1][1],c[1][2],c[1][3],c[1][4],c[1][5]);
            console.log('Cuboid overlaps? Result: ' + Utils.cuboidOverlaps(cuboid1, cuboid2) + ' - Expected: ' + c[2]);
            expect(Utils.cuboidOverlaps(cuboid1, cuboid2)).toBe(c[2]);
        });


    });

    it ("Get Overlapping Cuboids", () => {

        let cuboid1;
        let cuboid2;

        // test suite: cuboid1, cuboid2, overlaps
        let cuboids = [
            [[10,12,10,12,10,12], [11,13,10,12,10,12], [11,12,10,12,10,12]],
            [[10,12,10,12,10,12], [11,13,11,13,11,13], [11,12,11,12,11,12]],
            [[10,20,10,20,10,20], [11,13,11,13,11,13], [11,13,11,13,11,13]],
            [[-10,10,-10,10,-10,10], [0,10,0,10,0,10], [0,10,0,10,0,10]],
            [[-10,10,-10,10,-10,10], [-1,15,-2,15,-3,9], [-1,10,-2,10,-3,9]]
        ];

        cuboids.forEach((c) => {
            cuboid1 = new Cuboid(true, c[0][0],c[0][1],c[0][2],c[0][3],c[0][4],c[0][5]);
            cuboid2 = new Cuboid(true, c[1][0],c[1][1],c[1][2],c[1][3],c[1][4],c[1][5]);

            let overlappingCuboid = new Cuboid(true, c[2][0],c[2][1],c[2][2],c[2][3],c[2][4],c[2][5]);

            console.log('Overlapping Cuboid is: '+ Utils.getOverlappingCuboid(cuboid1, cuboid2) +' and should be' + JSON.stringify(overlappingCuboid));
            expect(Utils.getOverlappingCuboid(cuboid1, cuboid2)).toStrictEqual(overlappingCuboid);
        });


    });

    it ("Get Cuboid Volume", () => {

        let cuboid1;

        // test suite: cuboid1, cuboid2, overlaps
        let cuboids = [
            [[10,12,10,12,10,12], 27],
            [[1,3,5,8,10,15], 72],
            [[-2,2,-2,2,-2,2], 125],

        ];

        cuboids.forEach((c) => {
            cuboid1 = new Cuboid(true, c[0][0],c[0][1],c[0][2],c[0][3],c[0][4],c[0][5]);

            expect(cuboid1.getVolume()).toStrictEqual(c[1]);
        });


    });

});
