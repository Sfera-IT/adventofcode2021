import 'jest';
import * as fs from 'fs';
import { ParseData, AnalyzeData, CountUnique, DifferentCharInString, DecodeData } from '../08';
describe('Helpers', () => {
    
    const testFileData: string[] = fs
        .readFileSync("input1.txt")
        .toString()
        .split("\n");

    const realFileData: string[] = fs
        .readFileSync("input.txt")
        .toString()
        .split("\n");

    it('basic parsing', async () => {
       
        const parsed = ParseData(testFileData);
        expect(parsed[0].digits).toStrictEqual(['be', 'cfbegad','cbdgef','fgaecd','cgeb','fdcge','agebfd','fecdb','fabcd','edb']);
        expect(parsed[0].display).toStrictEqual(['fdgacbe', 'cefdb', 'cefbgd', 'gcbe']);  
    });

    it('with test data', async () => {
       
        const parsed = ParseData(testFileData);
        const result = CountUnique(parsed);
        expect(result).toBe(26);
    });

    it('with real input', async () => {
       
        const parsed = ParseData(realFileData);
        const result = CountUnique(parsed);
        console.log(result);
    });

    it('string difference', async () => {
       
        const result = DifferentCharInString("abcde", "bcef");
        expect(result).toStrictEqual(['a', 'd']);
    });

    it('string difference complete', async () => {
       
        const result = DifferentCharInString("ab", "abcef");
        expect(result).toStrictEqual([]);
    });

    it('Verify decode with test string', async () => {
       
        const parsed = ParseData(["acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |cdfeb fcadb cdfeb cdbaf"])[0];
        const analyzed = AnalyzeData(parsed);
   
        expect(analyzed["abcdeg"]).toBe(0);
        expect(analyzed["ab"]).toBe(1);
        expect(analyzed["acdfg"]).toBe(2);
        expect(analyzed["abcdf"]).toBe(3);
        expect(analyzed["abef"]).toBe(4);
        expect(analyzed["bcdef"]).toBe(5);
        expect(analyzed["bcdefg"]).toBe(6);
        expect(analyzed["abd"]).toBe(7);
        expect(analyzed["abcdefg"]).toBe(8);
        expect(analyzed["abcdef"]).toBe(9);
    });

    it('Verify being able to sum', async () => {
       
        const parsed = ParseData(["acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |cdfeb fcadb cdfeb cdbaf"])[0];
        const analyzed = AnalyzeData(parsed);
        const result = DecodeData(parsed, analyzed);
        expect(result).toBe(5353);
    });

    it('second part of the puzzle', async () => {
       
        let result = 0;
        const parsed = ParseData(realFileData);
        parsed.forEach(element => {
            const decoded = AnalyzeData(element);
            const displayContent = DecodeData(element, decoded);
            result += displayContent;
        });
        expect(result).toBe(978171);
        console.log('second part of the puzzle', result);
    });
});
