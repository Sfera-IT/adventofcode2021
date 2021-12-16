import {Decoder} from "./16";
import {PacketOperatorType0State} from "./packetOperatorType0State";
import {State} from "./state";
import {OperatorPacket} from "./packet";

export class PacketOperatorState extends State {

    public packet: OperatorPacket;

    constructor(decoder: Decoder,
                version: number,
                type: number,
                remaining: string) {
        super(decoder);
        this._stream = remaining;
        this.packet = new OperatorPacket(version, type)
        this.decoder.packets.push(this.packet);
    }

    /**
     * we have a really more complex stuff here, because a packet can be made of multiple packets
     * @returns {State}
     */
    onParse(): State {
        // we need at least 16 bit to understand what we have
        if (this._stream.length < 15) {
            return this;
        }

        // now we can understand what we have to do
        if (this._stream[0] === '0') {
            // next 15 bits sub packets length
            let length = parseInt(this._stream.substring(1, 16), 2);
            // now we know that we need to wait at least length bits to proceed with the next packet.
            return new PacketOperatorType0State(this.decoder, this.packet, this._stream.substring(16, length + 16), length);
        }
        throw new Error("Not implemented");

    }
}