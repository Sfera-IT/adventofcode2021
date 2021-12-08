import {compact, sumBy, map} from 'lodash';

export interface ILineOfData {
    digits: string[];
    display: string[];
}

export function ParseData(data: string[]) : ILineOfData[]
{
    let lines: ILineOfData[] = [];
    data.forEach(element => {
        const parts = element.split('|');
        lines.push({   
            digits: compact(parts[0].trim().split(' ')),
            display: compact(parts[1].trim().split(' '))
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
    const sorted = map(data.digits, sortStringChars);

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

    // remove all identified digits from the search collection
    sorted.splice(sorted.indexOf(digits[1]), 1);
    sorted.splice(sorted.indexOf(digits[7]), 1);
    sorted.splice(sorted.indexOf(digits[4]), 1);
    sorted.splice(sorted.indexOf(digits[8]), 1);

    // for all elements that have 6 segments, 6 is the only one that does not have the two segment of 1
    // this allows me to find element 6 and then segment c
    ElementFound(6, sorted.filter(e => e.length == 6 && DifferentCharInString(digits[1], e).length == 1)[0]);

    const segmentC = DifferentCharInString(digits[1], digits[6])[0];
    const segmentF = DifferentCharInString(digits[1], segmentC)[0];

    // digit 2 is the only one that does not have segment F
    ElementFound(2, sorted.filter(e => DifferentCharInString(segmentF, e).length == 1)[0]);

    // digit 5 is does not have segment C with 6 but we know 6
    ElementFound(5, sorted.filter(e => e !== digits[6] && DifferentCharInString(segmentC, e).length == 1)[0]);

    // digit 3 is simple, is the only remaining with 5 segments
    ElementFound(3, sorted.filter(e => e.length == 5)[0]);

    const segmentE = DifferentCharInString(digits[6], digits[5])[0];

    // we have only two element remaining, 9 and 0, 9 is the only one that does not have segment E
    ElementFound(9, sorted.filter(e => DifferentCharInString(segmentE, e).length == 1)[0]);

    // last element is zero.
    ElementFound(0, sorted[0]);

    return display;

    function ElementFound(element: number, segments: string) {
        digits[element] = segments;
        display[digits[element]] = element;
        sorted.splice(sorted.indexOf(digits[element]), 1);
    }
}

export function DecodeData(data: ILineOfData, display: {[key: string]: number}) : number
{
    var sortedPost = map(data.display, sortStringChars);

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
        count += sumBy(element.display, (item) => Number(
            item.length == 2 || 
            item.length == 3 || 
            item.length == 7 || 
            item.length == 4));
    });
    return count;
}




