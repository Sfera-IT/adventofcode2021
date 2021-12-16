export class Packet {
    public version: number;
    public type: number;

    constructor(version: number, type: number) {
        this.version = version;
        this.type = type;
    }

}

export class LiteralPacket extends Packet {
    public data?: number
}

export class OperatorPacket extends Packet {
    public subPackets: Packet[] = []; // operator packet contains other packets.
}