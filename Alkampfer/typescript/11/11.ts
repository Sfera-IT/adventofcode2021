import {forEach} from "lodash";
import * as fs from 'fs';

/**
 * Lets try to build a simple class that represent an octopus and all
 * adjacent octopuses
 */
export class Octopus {
    public value: number;
    public pulsed: boolean;

    public adjacent: Array<Octopus>;

    public constructor(value: number) {
        this.value = value;
        this.pulsed = false;
        this.adjacent = new Array<Octopus>();
    }

    public ResetPulse() {
        this.pulsed = false;
    }

    public AddAdjacent(octopus: Octopus) {
        if (!this.adjacent.includes(octopus)) {
            this.adjacent.push(octopus);
        }
        if (!octopus.adjacent.includes(this)) {
            octopus.adjacent.push(this);
        }
    }
}

export function ReadData(filename: string): Array<Array<Octopus>> {
    const fileDataLines: string[] = fs
        .readFileSync(filename)
        .toString()
        .split("\n");

    const data: Array<Array<Octopus>> = new Array<Array<Octopus>>();
    for (let i = 0; i < fileDataLines.length; i++) {
        const line: string = fileDataLines[i];
        const octopuses: Array<Octopus> = new Array<Octopus>();
        for (let j = 0; j < line.length; j++) {
            const octopus: Octopus = new Octopus(parseInt(line[j]));
            octopuses.push(octopus);
            // now create adjacency connections, this code is not beautiful but is extremely simple to understand
            // remember that AddAjacent is bidirectional, this is why I can add only previously seen octopuses
            if (i > 0) {
                octopus.AddAdjacent(data[i - 1][j]); //top octopus
                if (j > 0) {
                    octopus.AddAdjacent(data[i - 1][j - 1]); // top left
                }
                if (j < line.length - 1) {
                    octopus.AddAdjacent(data[i - 1][j + 1]); // top right
                }
            }
            if (j > 0) {
                octopus.AddAdjacent(octopuses[j - 1]); // left octopus
            }
        }
        data.push(octopuses);
    }

    return data;
}

export function DoCycle(board: Array<Array<Octopus>>): void {

    // Correct algorithm is, increment value for all octopuses as step 1
    Iterate(board, (octopus: Octopus) => {
        octopus.value += 1;
    });

    //then we need to continuously propagate pulses until we have no more pulses
    let pulsePropagated: boolean;
    do {
        pulsePropagated = false;
        Iterate(board, (octopus: Octopus) => {
            if (!octopus.pulsed && octopus.value > 9) {
                // this octopus don't pulses in the past, but it should pulse now
                octopus.pulsed = true;
                pulsePropagated = true; // mark that we have a new pulse, this can generate other pulses
                // increment the value of all adjacent octopuses FOR THE SAKE OF GODS, THIS WILL NOT IMMEDIATELY
                // TRIGGER NEW PULSES
                forEach(octopus.adjacent, (adjacentOctopus: Octopus) => {
                    adjacentOctopus.value += 1;
                });
            }
        });
    } while (pulsePropagated);

    // change all value, we do not reset the pulsed values for octopus becaue we need to check count of pulses
    Iterate(board, (octopus: Octopus) => {
        if (octopus.value > 9) {
            octopus.value = 0;
        }
    });
}

export function Iterate(board: Array<Array<Octopus>>, fn: (o: Octopus) => void): void {
    for (let i = 0; i < board.length; i++) {
        const row: Array<Octopus> = board[i];
        for (let j = 0; j < row.length; j++) {
            const octopus: Octopus = row[j];
            fn(octopus);
        }
    }
}

export function AllPulsed(board: Array<Array<Octopus>>): boolean {
    for (let i = 0; i < board.length; i++) {
        const row: Array<Octopus> = board[i];
        for (let j = 0; j < row.length; j++) {
            const octopus: Octopus = row[j];
            if (!octopus.pulsed) {
                return false;
            }
        }
    }

    return true;
}
