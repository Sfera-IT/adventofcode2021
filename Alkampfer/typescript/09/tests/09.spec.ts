import 'jest';
import * as fs from 'fs';
import { CreateInputData, GetBasin, Exercise01, Exercise02, GetAdiacentPointsWithCondition } from '../09';
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
       
        const result = CreateInputData(testFileData);
        expect(result.length).toBe(7); // 7 lines expected
        expect(result[1]).toStrictEqual([10, 2,1,9,9,9,4,3,2,1,0,10]) 
    });

    it('Exercise 01', async () => { 
       
        const data = CreateInputData(testFileData);
        const result = Exercise01(data);
        expect(result).toBe(15);
    });

    it('GetAdiacentPointsWithCondition', async () => { 
        const data = CreateInputData(testFileData);
        const points = GetAdiacentPointsWithCondition(data, 1, 1, (a, b) => b < 9);
        expect(points).toStrictEqual([{x: 2, y: 1}, {x: 1, y: 2}]);
    });

    it('GetAdiacentPointsWithCondition 2', async () => { 
        const data = CreateInputData(testFileData);
        const points = GetAdiacentPointsWithCondition(data, 3, 3, (a, b) => b < 9);
        expect(points).toStrictEqual([{x: 2, y: 3}, {x: 4, y: 3}, {x: 3, y: 2}, {x: 3, y: 4}]);
    });

    it('Get Basin 1', async () => { 
        const data = CreateInputData(testFileData);
        const points = GetBasin(data, 1, 2);
        expect(points.length).toBe(3);
    });

    it('Get Basin 1a', async () => { 
        const data = CreateInputData(testFileData);
        const points = GetBasin(data, 1, 1);
        expect(points.length).toBe(3);
    });

    it('Get Basin 2', async () => { 
        const data = CreateInputData(testFileData);
        const points = GetBasin(data, 1, 9);
        console.log(points);
        expect(points.length).toBe(9);
    });

    it('Exercise 02', async () => { 
       
        const data = CreateInputData(testFileData);
        const result = Exercise02(data);
        expect(result).toBe(1134);
    });
});
