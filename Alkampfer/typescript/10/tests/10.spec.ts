import 'jest';
import * as fs from 'fs';
import { GetScore, SyntaxChecker } from '../10';

describe('Helpers', () => {
    
    const testFileData: string[] = fs
        .readFileSync("input1.txt")
        .toString()
        .split("\n");

    const realFileData: string[] = fs
        .readFileSync("input.txt")
        .toString()
        .split("\n");

    it('exercise 01', async () => {

        const result = Array<string>();
        realFileData.forEach(line => {
            const sut = new SyntaxChecker();
            for (var i = 0; i < line.length; i++) {
                const char = line.charAt(i);
                if (!sut.Parse(char)) { 
                    result.push(char);
                    break;
                }
            }
        });
        const score = GetScore(result);
        expect(score).toBe(0);

        // expect(result.length).toBe(5); // 7 lines expected
        // expect(result).toStrictEqual(['}',')',']',')','>']); // 7 lines expected
    });

    it('exercise 02', async () => {

        const scores = new Array<number>();
        realFileData.forEach(line => {
            const sut = new SyntaxChecker();
            if (sut.ParseLine(line)) { 
                scores.push(sut.GetScoreToCompleteLine());
            } 
        });
        
        scores.sort((a,b) => a - b);
        expect(scores[(scores.length - 1) / 2]).toBe(0); // 7 lines expected
    });
});
