import * as fs from 'fs';
import * as path from 'path';

import Cuboid from "./Cuboid";
import Utils from "./Utils";

const currentPath : string = path.join(__dirname);
let input : string = fs.readFileSync(currentPath+'/input1.txt','utf8');
let lines1 : Array<string> = input.split("\n");

input = fs.readFileSync(currentPath+'/input2.txt','utf8');
let lines2 : Array<string> = input.split("\n");

// functions

let parseFunction = (line) => {
    const split1 = line.split(' ');
    const isOn = (split1[0] == 'on');
    const cuboidCoordinates = split1[1].split(',').map((v) => {
        const coordinate = v.split('=')[0];
        const from = v.split('=')[1].split('..')[0];
        const to = v.split('=')[1].split('..')[1];

        let obj = {};
        obj[coordinate] = [from,to];

        return obj;
    });

    return new Cuboid(
        isOn,
        parseInt(cuboidCoordinates[0]['x'][0]),
        parseInt(cuboidCoordinates[0]['x'][1]),
        parseInt(cuboidCoordinates[1]['y'][0]),
        parseInt(cuboidCoordinates[1]['y'][1]),
        parseInt(cuboidCoordinates[2]['z'][0]),
        parseInt(cuboidCoordinates[2]['z'][1]),
    )
};


function getVolumeRecursive(cuboid : Cuboid, nextCuboids : Array<Cuboid>) : number {
    let volume = 0;

    volume += cuboid.getVolume();

    let conflicts = [];

    for (let i = 0; i < nextCuboids.length; i++) {
        let c = nextCuboids[i];

        if (Utils.cuboidOverlaps(cuboid, c)) {
            let overlap = Utils.getOverlappingCuboid(cuboid, c);
            conflicts.push(overlap);
        }
    }

    for (let i = 0; i < conflicts.length; i++) {
        let c = conflicts[i];
        let rest = conflicts.slice(i+1, conflicts.length);
        volume -= getVolumeRecursive(c, rest);
    }

    return volume;
}



// parse
const cuboids1 = lines1.map(parseFunction);
const cuboids2 = lines2.map(parseFunction);

let t0 = Date.now();

let volume = 0;

for (let i = 0; i < cuboids1.length; i++) {
    let cuboid = cuboids1[i];
    if (cuboid.isOn === false)
        continue;

    let nextCuboids = cuboids1.slice(i+1, cuboids1.length);

    volume += getVolumeRecursive(cuboid, nextCuboids);
}

console.log('Solution 1: '+volume);


let t1 = Date.now();

volume = 0;

for (let i = 0; i < cuboids2.length; i++) {
    let cuboid = cuboids2[i];
    if (cuboid.isOn === false)
        continue;

    let nextCuboids = cuboids2.slice(i+1, cuboids2.length);

    volume += getVolumeRecursive(cuboid, nextCuboids);
}

let t2 = Date.now();


console.log('Solution 2: '+volume);

console.log(`Time 1 ${t1-t0} - Time 2 ${t2-t1}`);

