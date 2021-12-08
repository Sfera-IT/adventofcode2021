import {compact, sumBy, map} from 'lodash';
import * as fs from 'fs';

export interface ILineOfData {
    pre: string[];
    post: string[];
}

export function ParseData(data: string[]) : ILineOfData[]
{
    let lines: ILineOfData[] = [];
    data.forEach(element => {
        const parts = element.split('|');
        lines.push({   
            pre: compact(parts[0].trim().split(' ')),
            post: compact(parts[1].trim().split(' '))
        });
    });
    return lines;
} 

function sortStringChars(s: string): string
{
    return s.split('').sort().join('');
}

export function DifferentCharInString(s1: string, s2: string): string[]
{
    return s1.split('').filter(item => s2.indexOf(item) < 0);
}

export function AnalyzeData(data: ILineOfData) : {[key: string]: number}
{
    // first step, we need to have all the string sorted
    // and put into a dictionary where we start to assign
    // the digit to each combination
    let display = {} as {[key: string]: number};
    const digits =  new Array<string>(10);
    const sorted = map(data.pre, sortStringChars);

    // ok now for the first round, combination we know each time we found something
    // we remove that element from the search collection.
    sorted.forEach(element => {
        if (element.length == 2)
        {
            display[element] = 1;
            digits[1] = element;
        } 
        else if (element.length == 3)
        {
            display[element] = 7;
            digits[7] = element;
        } 
        else if (element.length == 4)
        {
            display[element] = 4;
            digits[4] = element;
        }
        else if (element.length == 7)
        {
            display[element] = 8;
            digits[8] = element;
        }
    });

    sorted.splice(sorted.indexOf(digits[1]), 1);
    sorted.splice(sorted.indexOf(digits[7]), 1);
    sorted.splice(sorted.indexOf(digits[4]), 1);
    sorted.splice(sorted.indexOf(digits[8]), 1);

    // some segments are known, A is the segment removing 1 from 7
    const segmentA = DifferentCharInString(digits[7], digits[1])[0];

    // for all element that have 6 segments, 6 is the only one that does not have the two segment of 1
    // this allows me to find element and then segment c
    digits[6] = sorted.filter(e => e.length == 6 && DifferentCharInString(digits[1], e).length == 1)[0];
    display[digits[6]] = 6;
    sorted.splice(sorted.indexOf(digits[6]), 1);

    const segmentC = DifferentCharInString(digits[1], digits[6])[0];
    const segmentF = DifferentCharInString(digits[1], segmentC)[0];

    // digit 2 is the only one that does not have segment F
    digits[2] = sorted.filter(e => DifferentCharInString(segmentF, e).length == 1)[0];
    display[digits[2]] = 2;
    sorted.splice(sorted.indexOf(digits[2]), 1);

    // digit 5 is does not have segment C with 6 but we know 6
    digits[5] = sorted.filter(e => e !== digits[6] && DifferentCharInString(segmentC, e).length == 1)[0];
    display[digits[5]] = 5;
    sorted.splice(sorted.indexOf(digits[5]), 1);

    digits[3] = sorted.filter(e => e.length == 5)[0];
    display[digits[3]] = 3;
    sorted.splice(sorted.indexOf(digits[3]), 1);
     
    const segmentE = DifferentCharInString(digits[6], digits[5])[0];

    digits[9] = sorted.filter(e => DifferentCharInString(segmentE, e).length == 1)[0];
    display[digits[9]] = 9;
    sorted.splice(sorted.indexOf(digits[9]), 1);

    digits[0] = sorted[0];
    display[digits[0]] = 0;
    sorted.splice(sorted.indexOf(digits[0]), 1);

    return display;
}

export function DecodeData(data: ILineOfData, display: {[key: string]: number}) : number
{
    var sortedPost = map(data.post, sortStringChars);

    return display[sortedPost[0]] * 1000 + 
        display[sortedPost[1]] * 100 +
        display[sortedPost[2]] * 10 +
        display[sortedPost[3]];
}

/**
 * Quick and dirty solution to the first part of the puzzle
 * @param data 
 * @returns 
 */
export function CountUnique(data: ILineOfData[]) : number
{
    let count = 0;
    data.forEach(element => {
        count += sumBy(element.post, (item) => Number(
            item.length == 2 || 
            item.length == 3 || 
            item.length == 7 || 
            item.length == 4));
    });
    return count;
}




