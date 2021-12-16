import 'jest';
import {
    hexToBinary,
    Decoder
} from '../16';
import {TypeState} from "../typeState";
import {PacketLiteralState} from "../packetLiteralState";
import {PacketOperatorState} from "../packetOperatorState";
import {LiteralPacket, OperatorPacket} from "../packet";

const each = require("jest-each").default;

describe('Helpers', () => {

    each([
        ["4", '0100'],
        ["F", '1111'],
        ["4F", '01001111'],
        ["11", '00010001']
    ])
        .it('HEx to binary', async (num:string, expected: string) => {

        const result = hexToBinary(num);
        expect(result).toBe(expected);
    });

    it ("Basic packet literal", () => {
        const decoder = new Decoder();
        decoder.pushChar('D');
        expect(decoder.state).toBeInstanceOf(TypeState);
        decoder.pushChar('2');
        expect(decoder.state).toBeInstanceOf(PacketLiteralState);
        expect(decoder.state.stream).toBe('10');
        expect(decoder.packets.length).toBe(1);
    });

    it ("Basic operator packet", () => {
        const decoder = new Decoder();
        decoder.pushChar('38');

        expect(decoder.state).toBeInstanceOf(PacketOperatorState);
        expect(decoder.state.stream).toBe('00');
        expect(decoder.packets.length).toBe(1);
    });

    it ("First complete sequence", () => {
        const decoder = new Decoder();
        decoder.pushChar('D2FE28');
        // after all the parsing, we need to return to the first state, the state that is expecing parsing
        expect(decoder.state).toBeInstanceOf(TypeState);
        expect(decoder.state.stream).toBe('');
        expect(decoder.packets.length).toBe(1);

        const packet = decoder.packets[0] as LiteralPacket;
        expect(packet.type).toBe(4);
        expect(packet.version).toBe(6);
        expect(packet.data).toBe(2021);
    });

    it ("First complete sequence operator packet", () => {
        const decoder = new Decoder();
        decoder.pushChar('38006F45291200');
        // after all the parsing, we need to return to the first state, the state that is expecing parsing
        expect(decoder.state).toBeInstanceOf(TypeState);
        expect(decoder.state.stream).toBe('0000');
        expect(decoder.packets.length).toBe(1);

        const packet = decoder.packets[0] as OperatorPacket;
        expect(packet.type).toBe(6);
        expect(packet.version).toBe(1);
        expect(packet.subPackets.length).toBe(2);
        const subPacket1 = packet.subPackets[0] as LiteralPacket;
        expect(subPacket1.type).toBe(4);
        expect(subPacket1.version).toBe(7);
        expect(subPacket1.data).toBe(10);

        const subPacket2 = packet.subPackets[1] as LiteralPacket;
        expect(subPacket2.type).toBe(4);
        expect(subPacket2.version).toBe(3);
        expect(subPacket2.data).toBe(20);
    });
});
