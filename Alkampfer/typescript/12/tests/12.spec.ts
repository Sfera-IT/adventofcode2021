import 'jest';
import {Cave, LoadFile, BackTrack, BackTrack2} from '../12';

describe('Helpers', () => {
    
    it('load file 01', async () => {

        const caves = LoadFile("input1.txt");
        expect(caves.length).toBe(6);
    });

    it('Backtrack 01', async () => {

        const caves = LoadFile("input1.txt");
        const paths = BackTrack(caves);
        expect(paths.length).toBe(10);
    });

    it('Backtrack 02', async () => {

        const caves = LoadFile("input2.txt");
        const paths = BackTrack(caves);
        expect(paths.length).toBe(19);
    });

    it('Backtrack 03', async () => {

        const caves = LoadFile("input3.txt");
        const paths = BackTrack(caves);
        expect(paths.length).toBe(226);
    });

    it('Exercise 01', async () => {

        const caves = LoadFile("input.txt");
        const paths = BackTrack(caves);
        expect(paths.length).toBe(0);
    });

    it('Backtrack 01 - 2', async () => {

        const caves = LoadFile("input1.txt");
        const paths = BackTrack2(caves);
        expect(paths.length).toBe(36);
    });

    it('Backtrack 02 - 2', async () => {

        const caves = LoadFile("input2.txt");
        const paths = BackTrack2(caves);
        expect(paths.length).toBe(103);
    });

    it('Backtrack 03 - 2', async () => {

        const caves = LoadFile("input3.txt");
        const paths = BackTrack2(caves);
        expect(paths.length).toBe(3509);
    });

    it('Exercise 02', async () => {

        const caves = LoadFile("input.txt");
        const paths = BackTrack2(caves);
        expect(paths.length).toBe(0);
    });
});
