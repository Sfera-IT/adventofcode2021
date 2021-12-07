import * as fs from 'fs';
import * as path from 'path';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let crabs : Array<number> = input.split(",").map(v => parseInt(v));


function summation(to) {
    return (Math.pow(to, 2) + to) / 2;
}


crabs.sort((a,b) => a - b);

const min = crabs[0];
const max = crabs[crabs.length-1];

let solutions = [];
for (let i = min; i <= max; i++) {
    let fuel = crabs.map(v => Math.abs(v-i)).reduce((a,b) => a+b);
    solutions[i] = fuel;
}

solutions.sort((a,b) => a - b);

console.log('Solution 1: '+solutions[0]);


solutions = [];
for (let i = min; i <= max; i++) {
    let fuel = crabs.map(v => summation(Math.abs(v-i))).reduce((a,b) => a+b);
    solutions[i] = fuel;
}

solutions.sort((a,b) => a - b);

console.log('Solution 2: '+solutions[0]);

crabs.sort((a,b) => a - b);

let median = crabs[Math.round(crabs.length/2)];
let fuel = crabs.map(v => Math.abs(v-median)).reduce((a,b) => a+b);
console.log('Optimal Solution 1 - use the median value (is it correct or I am only lucky?): ' + fuel);

// let t = crabs.map(v => summation(Math.abs(v-median)));
// fuel = crabs.map(v => summation(Math.abs(v-median))).reduce((a,b) => a+b);
// console.log('Optimal Solution 2: ' + fuel);


console.log('end');
