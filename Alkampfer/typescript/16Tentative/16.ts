import {forEach} from 'lodash';
import {TypeState} from "./typeState";
import {State} from "./state";
import {Packet} from "./packet";

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

    public pushBinary(binaryString: string): void {
        const hex = parseInt(binaryString, 2).toString(16);
        this.pushChar(hex);
    }
}




