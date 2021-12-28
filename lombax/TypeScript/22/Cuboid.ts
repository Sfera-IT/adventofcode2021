export default class Cuboid {
    set on(value: boolean) {
        this._on = value;
    }

    get isOn(): boolean {
        return this._on;
    }

    private _on : boolean;
    public x1 : number;
    public x2 : number;
    public y1 : number;
    public y2 : number;
    public z1 : number;
    public z2 : number;

    constructor(
        on: boolean,
        x1: number,
        x2: number,
        y1: number,
        y2: number,
        z1: number,
        z2: number
    ) {
        this._on = on;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.z1 = z1;
        this.z2 = z2;
    }

    getVolume() {
        const x = this.x2 - this.x1 + 1;
        const y = this.y2 - this.y1 + 1;
        const z = this.z2 - this.z1 + 1;

        return x*y*z;
    }
}