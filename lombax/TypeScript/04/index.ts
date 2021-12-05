import * as fs from 'fs';
import * as path from 'path';

const currentPath : String = path.join(__dirname);
const input : String= fs.readFileSync(currentPath+'/input.txt','utf8');
const lines : Array<String> = input.split("\n");

// exercise

class Board {

    private matrix : Array<Array<String>> = [];
    public won : boolean = false;

    addLine(line : String) {
        line = line + " "; // add a space to the end of the line
        let lineArray : Array<String> = line.match(/.{3}/g); // every 3 characters
        lineArray = lineArray.map((v) => v.replace(/\s/g, "")); //remove extra spaces
        this.matrix.push(lineArray);
    }

    extract(number : String) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.matrix[i][j] == number) {
                    this.matrix[i][j] = "X";
                }
            }
        }
    }

    hasWon() : Boolean {
        let lineA = "";
        let lineB = "";
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                lineA += this.matrix[i][j];
                lineB += this.matrix[j][i];
            }
            if (lineA === "XXXXX" || lineB === "XXXXX") {
                return true;
            }

            lineA = lineB = "";
        }

        return false;
    }

    getSum() : number {
        let sum : number = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.matrix[i][j] !== "X") {
                    sum += parseInt(this.matrix[i][j].toString());
                }
            }
        }
        return sum;
    }

}

const numbers = lines.shift().split(",");

let boards : Array<Board> = [];
let board = new Board();
lines.shift(); //remove first empty line

lines.forEach((line : String) => {
    if (line === "") {
        boards.push(board);
        board = new Board();
    } else {
        board.addLine(line);
    }
});

boards.push(board); // last board

let winners = [];

numbers.forEach((n) => {
    boards.forEach((v) => {
        v.extract(n);
        if (v.hasWon() && v.won == false) {
            winners.push(v.getSum()*parseInt(n))
            v.won = true;
        }
    });
});

console.log('First result: '+winners[0]);
console.log('Last result: '+winners[winners.length-1]);


