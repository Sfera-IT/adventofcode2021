import {countBy, sum} from 'lodash';
import * as fs from 'fs';

let process = (originalFamily: number[], generation: number): number[] => {

    const family = [...originalFamily];
    for (let i = 0; i < generation; i++) {
        const hatched = family[0]
        for (let j = 1; j < 9; j++) {
            family[j - 1] = family[j]
        }
        // all lanterns previous at 0 will add to 6 and the same
        // number will replace the original number 8
        family[6] += hatched
        family[8] = hatched
    }

    return family;
}

const fileData: string[] = fs
    .readFileSync("input.txt")
    .toString()
    .split(",");
const data = countBy(fileData, (item) => item);
const lanterns = new Array<number>(9);
for (let i = 0; i < 9; i++) {
    lanterns[i] = 0;
}
for (let key in data) {
    lanterns[parseInt(key)] = data[key];
}

const after80Generations = process(lanterns, 80);
console.log("After 80 generations", sum(after80Generations));
const after256Generations = process(lanterns, 256);
console.log("After 256 generations", sum(after256Generations));