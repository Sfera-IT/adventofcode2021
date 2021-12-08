import * as fs from 'fs';
import * as path from 'path';

const currentPath : string = path.join(__dirname);
const input : string = fs.readFileSync(currentPath+'/input.txt','utf8');
let lines : Array<string> = input.split("\n");

// Alternative solution from reddit - just to try it

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

// solution from reddit https://www.reddit.com/r/adventofcode/comments/rbj87a/comment/hnqehzg/?utm_source=share&utm_medium=web2x&context=3


let sum = 0;
lines.forEach((line) => {

    let elements : Array<string> = line.split(" | ");
    let map : Array<string> = elements[0].split(" ");
    let mapAlphabetical = map.map(v => v.split('').sort().join(''));

    let counts = {};
    map.forEach((v) => {
        v.split('').forEach((c) => {
            if (counts[c] === undefined) {
                counts[c] = 1;
            } else {
                counts[c]++;
            }
        });
    });

    let newMap = map.map((v) => {
        return v.split('').map((c) => counts[c]).reduce((a,b) => a+b);
    });

    const sumMap = {
        42: 0,
        17: 1,
        34: 2,
        39: 3,
        30: 4,
        37: 5,
        41: 6,
        25: 7,
        49: 8,
        45: 9
    };

    let transcode = newMap.map(v => sumMap[v]);

    let alphabet = [];
    let cnt = 0;
    mapAlphabetical.forEach((n) => {
        alphabet[n] = transcode[cnt];
        cnt++;
    });


    let digitsAlphabetical : Array<string> = elements[1].split(" ").map(v => v.split('').sort().join(''));
    let result = digitsAlphabetical.map((v) => alphabet[v]).join('');

    sum += parseInt(result);

    console.log(''+result);
});



let t2 = Date.now();
console.log('Solution 2: '+sum);

console.log(`Time 1 ${t1-t0} - Time 2 ${t2-t1}`);

