import 'jest';
import {
    hexToBinary, PacketDecoder,
} from '../16';
import * as fs from 'fs';
const each = require("jest-each").default;

describe('Helpers', () => {

    each([
        ["4", '0100'],
        ["F", '1111'],
        ["4F", '01001111'],
        ["11", '00010001'],
        ["EE", '11101110']
    ])
        .it('HEx to binary', async (num:string, expected: string) => {

        const result = hexToBinary(num);
        expect(result).toBe(expected);
    });

    it ("First complete sequence", () => {
        const decoder = new PacketDecoder('D2FE28');
        decoder.decode();
        expect(decoder.sumVersion).toBe(6);
    });

    it ("Second complete sequence", () => {
        const decoder = new PacketDecoder('38006F45291200');
        decoder.decode();
        expect(decoder.sumVersion).toBe(9);
    });

    each([
        ["8A004A801A8002F478", 16],
        ["620080001611562C8802118E34", 12],
        ["C0015000016115A2E0802F182340", 23],
        ["A0016C880162017C3686B18A3D4780", 31],
    ])
    .it ("some complete sequence", (code: string, expected: number) => {
        const decoder = new PacketDecoder(code);
        decoder.decode();
        expect(decoder.sumVersion).toBe(expected);
    });

    each([
        ["C200B40A82", 3],
        ["04005AC33890", 54],
        ["880086C3E88112", 7],
        ["CE00C43D881120", 9],
        ["D8005AC2A8F0", 1],
        ["F600BC2D8F", 0],
        ["9C005AC2F8F0", 0],
        ["9C0141080250320F1802104A08", 1],
    ])
    .it ("Array_Part 2 complete sequence", (code: string, expected: number) => {
        const decoder = new PacketDecoder(code);
        const result = decoder.decode();
        expect(result).toBe(expected);
    });

    it ("First Part", () => {
        const data = fs.readFileSync('input.txt', 'utf8')
        const decoder = new PacketDecoder(data);
        decoder.decode();
        expect(decoder.sumVersion).toBe(871);
    });

    it ("Second Part", () => {
        const data = fs.readFileSync('input.txt', 'utf8')
        const decoder = new PacketDecoder(data);
        const result = decoder.decode();
        expect(result).toBe(0);
    });
});
