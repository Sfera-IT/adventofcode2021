import 'jest';
import * as fs from 'fs';
import {Octopus, ReadData, Iterate, DoCycle, AllPulsed} from '../11';

describe('Helpers', () => {
    
    it('exercise 01', async () => {

        const board = ReadData("input1.txt");
        let pulseCount: number = 0;
        for (let i = 0; i < 100; i++) {
            DoCycle(board);
            let s: string = "";
            let k = 0;
            Iterate(board, o => {
                s += o.value;
                if (++k % 10 == 0) {
                    s += "\n";
                }
            });
            console.log("Iteration " + i + ": " + s);
            Iterate(board, octopus => {
                if (octopus.pulsed) {
                    pulseCount += 1;
                }
                octopus.ResetPulse();
            });
        }
        expect(pulseCount).toBe(1656); // control data
    });

    it('exercise 02', async () => {

        const board = ReadData("input1.txt");

        for (let i = 0; i < 10000000; i++) {
            DoCycle(board);
            if (AllPulsed(board)) {
                console.log("Pulsed after " + i + " iterations");
                expect(i + 1).toBe(195); // control data
                return;
            }
            Iterate(board, octopus => {
                octopus.ResetPulse();
            });
        }

    });
});
