import * as fs from 'fs';
import {uniqBy, maxBy, forEach} from 'lodash';

const lines = fs.readFileSync('input1.txt', 'utf8').split('\n');
let line: string = lines[0].trim();
const map = new Map<string, string>();

for (let i = 2; i < lines.length; i++) {
    map.set(lines[i][0] + lines[i][1], lines[i][6]);
}

for (let i = 0; i < 40; i++) {
    // simply create the new polymer map
    let newLine = "";
    for (let j = 0; j < line.length - 1; j++) {
       const token = line[j] + line[j + 1];
       newLine += line[j] + map.get(token);
    }
    line = newLine + line[line.length - 1];
    console.log("iteration " + i);
}

//now count of each char in string
const counts = new Map<string, number>();
for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (counts.has(char)) {
        counts.set(char, counts.get(char) as number + 1);
    } else {
        counts.set(char, 1);
    }
}
const values =  Array.from( counts.values() );
const max = Math.max.apply(null, values);
const min = Math.min.apply(null, values);
console.log("max - min: " + (max - min), max, min);


