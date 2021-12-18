import 'jest';
import {
    findDistinctShot,
    findMaxY,
} from '../17';
import * as fs from 'fs';
const each = require("jest-each").default;

describe('Helpers', () => {

    it ("First shot", () => {
        const result = findMaxY(20,30,-10, -5);
        expect(result).toBe(45);
    });

    it ("RealFirst shot", () => {
        const result = findMaxY(57,116, -198, -148);
        expect(result).toBe(19503);
    });

    it ("Second shot", () => {
        const result = findDistinctShot(20,30,-10, -5);
        expect(result).toBe(112);
    });

    it ("Real second shot", () => {
        const result = findDistinctShot(57,116, -198, -148);
        expect(result).toBe(112);
    });
});
