import * as fs from 'fs';
import {uniqBy, maxBy, forEach} from 'lodash';

const lines = fs.readFileSync('input.txt', 'utf8').split('\n');
let line: string = lines[0].trim();
const map = new Map<string, string>();

for (let i = 2; i < lines.length; i++) {
    map.set(lines[i][0] + lines[i][1], lines[i][6]);
}

// modification we need to count the couples
let counts = new Map<string, number>();

// build the very first map, it will map occurrence of each couple
// ex NN = 1 NC = 1 CB = 1
for (let i = 0; i < line.length - 1; i++) {
    const key = line[i] + line[i + 1];
    counts.set(key, (counts.get(key) || 0) + 1);
}

// now iterate, the secret is counting only the couples, we are interested in
// number of chars, not the exact sequence of the polymer
for (let i = 0; i < 40; i++) {
    // copy the polymer map in another map to avoid confusion
    const newMap = new Map<string, number>();

    counts.forEach((value: number, key: string) => {
        const insertionChar = map.get(key);
        const leftKey = key[0] + insertionChar;
        const rightKey = insertionChar + key[1];
        newMap.set(leftKey, (newMap.get(leftKey) || 0) + value);
        newMap.set(rightKey, (newMap.get(rightKey) || 0) + value);
    });

    counts = newMap;
}
console.log(counts)

let charCount = new Map<string, number>();
counts.forEach((value: number, key: string) => {
    if (charCount.has(key[0])) {
        charCount.set(key[0], (charCount.get(key[0]) || 0) + value);
    } else {
        charCount.set(key[0],(value|| 0));
    }
});

// stupid, do not forget last char....
const lastChar = line[line.length - 1];
charCount.set(lastChar, charCount.get(lastChar) as number + 1);
console.log(charCount);

const values =  Array.from( charCount.values() );
const max = Math.max.apply(null, values);
const min = Math.min.apply(null, values);
console.log("max - min: " + (max - min), max, min);


