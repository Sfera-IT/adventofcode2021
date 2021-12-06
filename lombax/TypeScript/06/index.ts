import * as fs from 'fs';
import * as path from 'path';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let fishes : Array<number> = input.split(",").map(v => parseInt(v));


// SUBOPTIMAL SOLUTION

function fishesForDays(startFish, days) {
    let fishes = [startFish];
    for (let i = 0; i < days; i++) {
        let newFishes : Array<number> = [];
        fishes = fishes.map((fish) => {
            fish -= 1;

            if (fish == -1) {
                fish = 6;
                newFishes.push(8);
            }

            return fish;
        });

        fishes = fishes.concat(newFishes);
    }
    return fishes;
}


let days = 80;
let tot = fishes.map(v => fishesForDays(v, days).length).reduce((a,b) => a+b);

console.log('Suboptimal solution 1: ' + tot);


// divide & conquer
days = 256;
days = days / 2;

let partialResults = [];
let partialMap = [];
let partialCounts = [];
for (let i = 0; i <=8; i++) {
    let r = fishesForDays(i, days);
    partialResults.push(r);
    partialCounts.push(r.length);
    partialMap.push(BigInt(r.length));
}

let finalMap = [];

partialResults.forEach((arr) => {
    let partialSum = arr.map((a) =>
        partialMap[a]
    );
    let bigSum = partialSum.reduce((a,b) => {
            return a+b;
    });
    finalMap.push(bigSum);
});

let sum = fishes.map((v) => finalMap[v]).reduce((a,b) => a+b);

console.log('Suboptimal solution 2: ' + sum);


// OPTIMAL SOLUTION BELOW

function occurrences(fishes) {
    let occurrences = fishes.reduce(function (acc, curr) {
        // return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc // rewrite in a more readable way
        if (acc[curr]) {
            acc[curr]++;
        } else {
            acc[curr] = 1;
        }
        return acc;
    }, {});
    return occurrences
}

function increment(count) {
    let tmp = [0,0,0,0,0,0,0,0,0];
    for (let i = 1; i < 9; i++) {
        tmp[i-1] = (count[i] === undefined) ? 0 : count[i];
    }

    tmp[8] += (count[0] === undefined) ? 0 : count[0]; // new lanternfishes with internal timer of 8
    tmp[6] += (count[0] === undefined) ? 0 : count[0]; // old lanternfishes after creating the new ones

    return tmp;
}

days = 80;
let count = occurrences(fishes);
for (let i = 0; i < days; i++) {
    count = increment(count);
}

console.log("Optimal solution: "+count.reduce((a,b) => a+b));

days = 256;
count = occurrences(fishes);
for (let i = 0; i < days; i++) {
    count = increment(count);
}

console.log("Optimal solution: "+count.reduce((a,b) => a+b));
