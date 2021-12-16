import {Decoder} from "./16";
import {PacketLiteralState} from "./packetLiteralState";
import {PacketOperatorState} from "./packetOperatorState";
import {State} from "./state";

/***
 * The state that is used when we are waiting for the start of a packet
 */
export class TypeState extends State {

    constructor(protected decoder: Decoder) {
        super(decoder);
    }

    onParse(): State {
        // if we have not enough chars, continue to parse
        if (this._stream.length < 8) {
            return this;
        }

        const version = parseInt(this._stream.substring(0, 3), 2);
        const type = parseInt(this._stream.substring(3, 6), 2);
        if (type == 4) {
            return new PacketLiteralState(this.decoder, version, this._stream.substring(6, 10000))
        }
        return new PacketOperatorState(this.decoder, version, type, this._stream.substring(6, 10000));
    }
}