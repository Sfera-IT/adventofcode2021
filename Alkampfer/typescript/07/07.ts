import {sum} from 'lodash';
import * as fs from 'fs';

function fuelCost(
    seriesOfNumbers: number[], 
    target: number, 
    fn: (a: number, b:number) => number): number {
    return sum(seriesOfNumbers.map(x => fn(x, target)));
}

function crabSingleFuelCost(n1: number, n2: number): number {
    const difference = Math.abs(n1 - n2);
    return (Math.pow(difference, 2) + difference) / 2;
}

function stringListToNumberList(strings: string[]): number[] {
    return strings.map(Number);
}

function search(
    input: number[], 
    fuelCostFunction: (a: number, b:number) => number) : number {

    let min: number = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
        const fuel = fuelCost(input, i, fuelCostFunction);
        if (fuel < min) {
            min = fuel;
        }
        else {
            return min;
        }
    }

    return 0;
}

const fileData: string[] = fs
    .readFileSync("input.txt")
    .toString()
    .split(",");

const numbers: number[] = stringListToNumberList(fileData);

console.log(`Minimum fuel cost standard is ${search(numbers, (x, y) => Math.abs(x -y))}`);
console.log(`Minimum fuel cost crab fuel is ${search(numbers, crabSingleFuelCost)}`);


