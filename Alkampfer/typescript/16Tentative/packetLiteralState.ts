import {TypeState} from "./typeState";
import {Decoder} from "./16";
import {State} from "./state";
import {LiteralPacket} from "./packet";

export class PacketLiteralState extends State {

    public packet: LiteralPacket;
    private _databin: string = "";

    constructor(decoder: Decoder, version: number, remaining: string) {
        super(decoder);
        this._stream = remaining;
        this.packet = new LiteralPacket(version, 4)
        this.decoder.packets.push(this.packet);
    }

    onParse(): State {
        if (this._stream.length < 5) {
            return this;
        }
        // ok now we cycle until we have more than 5 char
        while (this._stream.length > 4) {
            this._databin += this._stream.substring(1, 5);
            // is this the last piece of the packet?
            if (this._stream.charAt(0) == '0') {
                this.packet.data = parseInt(this._databin, 2);
                // we finished decoding this packet, so we can return to the type state
                return new TypeState(this.decoder);
            }
            this._stream = this._stream.substring(5, 10000);
        }
        return this;
    }
}