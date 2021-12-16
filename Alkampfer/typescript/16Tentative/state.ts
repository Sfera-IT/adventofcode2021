import {Decoder} from "./16";

/**
 * An abstract class that is capabpe of decoding a packet
 */
export abstract class State {
    protected _stream = "";

    constructor(protected decoder: Decoder) {
    }

    public Add(binString: string): State {
        this._stream += binString;
        return this.onParse();
    }

    abstract onParse(): State

    public get stream(): string {
        return this._stream;
    }
}