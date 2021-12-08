import * as fs from 'fs';
import * as path from 'path';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let lines : Array<string> = input.split("\n");

// numberOfSegments : digit
const digitMap = {
    2: 1,
    4: 4,
    3: 7,
    7: 8
};


let t0 = Date.now();

// exercise 1
let count = 0;
lines.forEach((line) => {

    let elements : Array<string> = line.split(" | ");
    let map : Array<string> = elements[0].split(" ");
    let output : Array<string> = elements[1].split(" ").map((digit) => {
        let ret = digitMap[digit.length];
        if (ret === undefined)
            return null;
        else
            return digitMap[digit.length];
    }).filter(v => v !== null);


    count += output.length;

});

let t1 = Date.now();
console.log('Solution 1: '+count);

// exercise 2
// find the mapping of the 8 number

/*

   my original mapping is

     aaaa
    b    c
    b    c
     dddd
    e    f
    e    f
     gggg

     1 - 4 - 7 - 8 have segments in common

     8 has all segments abcdefg -> 7 char
     1 has cf -> 2 char
     7 has acf -> 3 char
     4 has bcdf -> 4 char

     -----

     0 abcefg -> 6 char
     6 abdefg -> 6 char

     2 acdeg -> 5  char
     3 acdfg -> 5 char
     5 abdfg -> 5 char
     9 abcfg -> 5 char

    ----

    Mapping between chars and numbers
    2 char -> 1
    3 char -> 7
    4 char -> 4
    5 char -> can be 2, 3, 5, 9
    6 char -> can be 0 or 6
    7 char -> 8

    So I find 1, 4, 7, 8 first
    then I find 0 and 6:
        0 has segments in common with 1 (2 segments), 4 (3 segments), 7 (3 segments), 8 (6 segments)
        6 has segments in common with 1 (1 segment), 4 (3 segments), 7 (2 segments)

        to distinguish between 0 and 6, I have to count the number of segments in common with 1. If 1 segment, result is
        6. If 2 segments, result is 0

    then I find 2,3,5,9
        3 has segments in common with 1 (2 segment), 4 (3 segment), 7 (3 segment), 8 (5 segment)
        9 has segments in common with 1 (2 segment), 4 (4 segment) ...
        5 has segments in common with 1 (1 segment), 4 (2 segment), 7 (2 segment), 8 (5 segment)*
        2 has segments in common with 1 (1 segment), 4 (2 segment), 7 (2 segment), 8 (5 segment)*

        I find who has 3 segment in common with 4 -> it's 3
        I find who has 4 segment in common with 4 -> it's 9

        then I have to distinguish between 5 and 2
        5 has 5 segments in common with 9 while 2 has only 4

 */

// find mapping

function numberOfSegmentsInCommon(a,b) {
    let common = 0;

    for (let i = 0; i < a.length; i++) {
        if (b.search(a[i]) !== -1 ) {
            common += 1;
        }
    }

    return common;
}

function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach(key => {
        ret[obj[key]] = key;
    });
    return ret;
}

let sum = 0;
lines.forEach((line) => {

    let elements : Array<string> = line.split(" | ");
    let map : Array<string> = elements[0].split(" ");
    let mapAlphabetical = map.map(v => v.split('').sort().join(''));

    let transcodingMap = {};

    transcodingMap[1] = mapAlphabetical.find(v => v.length === 2);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[1]); // remove

    transcodingMap[4] = mapAlphabetical.find(v => v.length === 4);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[4]);

    transcodingMap[7] = mapAlphabetical.find(v => v.length === 3);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[7]);

    transcodingMap[8] = mapAlphabetical.find(v => v.length === 7);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[8]);


    // 6 chars
    // 0 has segments in common with 1 (2 segments), 4 (3 segments), 7 (3 segments), 8 (6 segments)
    transcodingMap[0] = mapAlphabetical.filter(v => v.length === 6).find(v => {
        return (numberOfSegmentsInCommon(v, transcodingMap[1]) === 2) && (numberOfSegmentsInCommon(v, transcodingMap[4]) === 3) && (numberOfSegmentsInCommon(v, transcodingMap[7]) === 3);
    });
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[0]);

    // 6 has segments in common with 1 (1 segment), 4 (3 segments), 7 (2 segments)
    transcodingMap[6] = mapAlphabetical.filter(v => v.length === 6).find(v => {
        return (numberOfSegmentsInCommon(v, transcodingMap[1]) === 1) && (numberOfSegmentsInCommon(v, transcodingMap[4]) === 3) && (numberOfSegmentsInCommon(v, transcodingMap[7]) === 2);
    });
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[6]);



    // 3 has segments in common with 1 (2 segment), 4 (3 segment), 7 (3 segment), 8 (5 segment)
    transcodingMap[3] = mapAlphabetical.find(v => {
        return  (numberOfSegmentsInCommon(v, transcodingMap[1]) === 2) &&
                (numberOfSegmentsInCommon(v, transcodingMap[4]) === 3) &&
                (numberOfSegmentsInCommon(v, transcodingMap[7]) === 3);
    });
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[3]);

    transcodingMap[9] = mapAlphabetical.find(v => numberOfSegmentsInCommon(v, transcodingMap[4]) === 4);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[9]);

    transcodingMap[5] = mapAlphabetical.find(v => numberOfSegmentsInCommon(v, transcodingMap[9]) === 5);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[5]);

    transcodingMap[2] = mapAlphabetical.find(v => numberOfSegmentsInCommon(v, transcodingMap[9]) === 4);
    mapAlphabetical = mapAlphabetical.filter(v => v !== transcodingMap[2]);


    let mapFlipped = objectFlip(transcodingMap);
    //
    let digitsAlphabetical : Array<string> = elements[1].split(" ").map(v => v.split('').sort().join(''));
    let output : Array<string> = digitsAlphabetical.map((digit) => {
        return mapFlipped[digit];
    });

    let digits = parseInt(output.join(''));
    sum += digits;

});



let t2 = Date.now();
console.log('Solution 2: '+sum);

console.log(`Time 1 ${t1-t0} - Time 2 ${t2-t1}`);

