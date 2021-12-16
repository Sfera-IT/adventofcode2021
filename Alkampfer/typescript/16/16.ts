import * as fs from 'fs';
import {uniqBy, maxBy, forEach} from 'lodash';

export function hexToBinary(hex: string): string {
    return hex.split('').map(function (c) {
        return parseInt(c, 16).toString(2).padStart(4, '0');
    }).join('');
}

export class Decoder {
    public packets: Packet[] = [];
    public state: State;

    constructor() {
        this.state = new TypeState(this);
    }
    /**
     * Pushes a single char and try to decode a packet.
     * @param hex
     */
    public pushChar(hex: string): void {
        forEach(hex, (c) => {
            let binary = hexToBinary(c);
            this.state = this.state.Add(binary);
        });
    }

}

/**
 * An abstract class that is capabpe of decoding a packet
 */
abstract class State {
    protected _stream = "";

    constructor(protected decoder: Decoder) {
    }

    public Add(binString: string): State {
        this._stream += binString;
        return this.onParse();
    }

    abstract onParse() : State

    public get stream(): string {
        return this._stream;
    }
}

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
        if (type == 4)
        {
            return new PacketLiteralState(this.decoder, version, this._stream.substring(6, 10000))
        }
        return new PacketOperatorState(this.decoder, version, this._stream.substring(6, 10000) );
    }
}

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

export class PacketOperatorState extends State {

    public packet: OperatorPacket;

    constructor(decoder: Decoder, version: number, remaining: string) {
        super(decoder);
        this._stream = remaining;
        this.packet = new OperatorPacket(version, 4)
        this.decoder.packets.push(this.packet);
    }

    onParse(): State {

        return this;
    }
}

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
    public packets: Packet[] = []; // operator packet contains other packets.
}


