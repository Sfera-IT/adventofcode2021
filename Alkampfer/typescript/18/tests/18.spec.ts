import 'jest';
import {
    SnailFish
} from '../18';
import * as fs from 'fs';
const each = require("jest-each").default;

describe('Snailfish', () => {

    each([
        ["[9,1]", 29],
        ["[1,9]", 21],
        ["[[9,1],[1,9]]", 129],
        ["[[1,2],[[3,4],5]]", 143],
        ["[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", 1384],
        ["[[[[1,1],[2,2]],[3,3]],[4,4]]", 445],
        ["[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]", 3488]
    ])
    .it ("Magnitude", (snailfish: string, expected: number) => {
        const sf = new SnailFish(snailfish);
        expect(sf.magnitude()).toBe(expected);
    });

    each([
        ["[[[[[9,8],1],2],3],4]", "[0,9,2,3,4]"],
        ["[7,[6,[5,[4,[3,2]]]]]", "[7,6,5,7,0]"],
        ["[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]", "[3,2,8,0,9,5,7,0]"],
        ["[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]", "[0,7,4,7,8,6,0,8,1]"],
        ["[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]", "[3,2,8,0,9,5,7,0]"],
    ])
    .it ("Normalize", (snailfish: string, expected: number) => {
        const sf = new SnailFish(snailfish);
        expect(sf.print()).toBe(expected);
    });

    it ("Single Normalize", () => {
        const sf = new SnailFish("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]");
        expect(sf.print()).toBe("[0,7,4,7,8,6,0,8,1]");
    });

    it ("exercise 1 test", () => {
        const lines = fs.readFileSync("input.txt", "utf8").split("\n");
        const snailFish = new SnailFish(lines[0]);
        for (let i = 1; i < lines.length; i++) {
            snailFish.add(lines[i]);
        }
        console.log(snailFish.magnitude());
    });

    it ("exercise 2 test", () => {
        const lines = fs.readFileSync("input.txt", "utf8").split("\n");
        let max = 0;

        function AddSnailfish(i: number, j: number) {
            const snailFish = new SnailFish(lines[i]);
            snailFish.add(lines[j]);
            if (snailFish.magnitude() > max) {
                max = snailFish.magnitude();
            }
        }

        for (let i = 0; i < lines.length; i++) {

            for (let j = i + 1; j < lines.length; j++) {
                console.log("i: " + i + " j: " + j);
                AddSnailfish(i, j);
                AddSnailfish(j, i);
            }
        }
        console.log(max);
    });

});
