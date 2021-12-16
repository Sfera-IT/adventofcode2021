import {Decoder} from "./16";
import {State} from "./state";
import {OperatorPacket} from "./packet";
import {TypeState} from "./typeState";

export class PacketOperatorType0State extends State {
    public packet: OperatorPacket;

    constructor(decoder: Decoder,
                packet: OperatorPacket,
                remaining: string,
                private length: number) {
        super(decoder);
        this._stream = remaining;
        this.packet = packet;
        // we do not need to push the packet to the decoder, because all new packets will be added
        // to this internal operator packet.
    }

    onParse(): State {
        if (this._stream.length < this.length) {
            return this;
        }
        // ok we have now all the data for subsequent packets we have to parse.
        const decoder = new Decoder();
        // in this._stream we have nested packet of this packet, lets decode recusively
        decoder.pushBinary(this._stream);
        decoder.packets.forEach(p => this.packet.subPackets.push(p));
        // we finished decoding this packet,
        return new TypeState(this.decoder);
    }
}