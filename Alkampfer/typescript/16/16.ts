import {forEach} from 'lodash';

export function hexToBinary(hex: string): string {
    return hex.split('').map(function (c) {
        return parseInt(c, 16).toString(2).padStart(4, '0');
    }).join('');
}

export class PacketDecoder {
    get sumVersion(): number {
        return this._sumVersion;
    }
    private binData: string;

    /**
     * Operator packets have operations that should be performed on arrays of internal packet.
     */
    private operators: Map<number, { (data: number[]): number; }>  = new Map();

    constructor(data: string) {
        this.binData = hexToBinary(data);

        this.operators.set(0 , (data: number[]) => {
            return data.reduce((a, b) => a + b, 0);
        });
        this.operators.set(1 , (data: number[]) => {
            return data.reduce((a, b) => a * b, 1);
        });
        this.operators.set(2 , (data: number[]) => {
            return Math.min.apply(null, data);
        });
        this.operators.set(3 , (data: number[]) => {
            return Math.max.apply(null, data);
        });
        this.operators.set(5 , (data: number[]) => {
            return data[0] > data[1] ? 1 : 0;
        });
        this.operators.set(6 , (data: number[]) => {
            return data[0] < data[1] ? 1 : 0;
        });
        this.operators.set(7 , (data: number[]) => {
            return data[0] === data[1] ? 1 : 0;
        });
    }

    private _sumVersion: number = 0;
    private _result: number = 0;
    private _currentIndex = 0;

    decode(): number {
        // we are at the beginning of a packet grab type and version
        const version = parseInt(this.binData.substring(this._currentIndex, this._currentIndex + 3), 2);
        const type = parseInt(this.binData.substring(this._currentIndex + 3, this._currentIndex + 6), 2);
        this._currentIndex += 6;
        this._sumVersion += version;
        if (type == 4) {
            // we need to cycle to grab all the numbers
            let num: string = '';
            let bit: string = '';
            do {
                num += this.binData.substring(this._currentIndex + 1, this._currentIndex + 5);
                bit = this.binData[this._currentIndex];
                this._currentIndex += 5;
            } while (bit === '1');
            // number packet is multiple of 4 so we need to pad it
            const number = parseInt(num, 2);
            const pad = num.length % (num.length / 4)
            this._currentIndex += pad;
            return number;
        } else {
            // this is an operator packet
            const lengthType = this.binData[this._currentIndex++];
            if (lengthType === '0') {
                //we have a subsequent 15 bytes that indicates the length of the subpackets.
                const subsequentPacketLength = parseInt(
                    this.binData.substring(
                        this._currentIndex,
                        this._currentIndex + 15),
                    2);
                // we need to parse the subsequent packets
                this._currentIndex+=15;
                const stopPackets = this._currentIndex + subsequentPacketLength;
                // ok we know that we need to parse until we reach stopPackets
                const subPackets: number[] = [];
                while (this._currentIndex < stopPackets) {
                    subPackets.push( this.decode());
                }

                const operator = this.operators.get(type) as { (data: number[]): number; };
                if (operator == undefined)
                    return 0;
                return operator(subPackets);
            } else {
                //we have a subsequent 11 bytes that indicates how many subpackets we have
                const subsequentNumberOfPackets = parseInt(
                    this.binData.substring(
                        this._currentIndex,
                        this._currentIndex + 11),
                    2);
                // we need to parse the subsequent packets
                this._currentIndex+=11;
                const subPackets: number[] = [];
                for (let i = 0; i < subsequentNumberOfPackets; i++) {
                    subPackets.push( this.decode());
                }

                const operator = this.operators.get(type) as { (data: number[]): number; };
                if (operator == undefined)
                    return 0;
                return operator(subPackets);
            }
        }
        return 0;
    }
}



