import {forEach, repeat} from 'lodash';

/**
 * Lets have another approach, we are not interested in how number are nested, only
 * value and depth
 */
class SnailNumber {

    constructor(public value: number, public depth: number) {
    }
}


export class SnailFish {

    /**
     * No number is greater than 10 for parsing purpose.
     * @param snailFishValue
     */
    constructor(snailFishValue: string) {

        //ok we need to examine char by char to understand what is happening
        this._numbers = this.ParseSnailFish(snailFishValue);
        this.reduce();
    }

    private ParseSnailFish(snailFishValue: string): SnailNumber[] {
        let level = 0;
        let numbers: SnailNumber[] = [];
        snailFishValue = snailFishValue.trim();
        forEach(snailFishValue, (char: string) => {

            if (char === '[') {
                level += 1;
            } else if (char === ']') {
                level -= 1;
            } else if (char === ',') {
                // do absolutely nothing
            } else {
                //we have a number
                let number = parseInt(char);
                numbers.push(new SnailNumber(number, level));
            }
        });
        return numbers;
    }

    public add(snailFishValue: string): void {
        const snail = this.ParseSnailFish(snailFishValue);
        // adding snailfish
        this._numbers = this._numbers.concat(snail);
        forEach(this._numbers, (snailNumber: SnailNumber) => {
            snailNumber.depth += 1;
        });
        this.reduce();
    }

    private _numbers: SnailNumber[] = [];

    public magnitude() {

        let numbers = this._numbers;
        while (numbers.length > 1) {
            let newNumbers: SnailNumber[] = [];
            let i: number = 0;
            while (i < numbers.length) {
                // a pair happens when we have two numbers with the same depth
                const isPair = i < numbers.length -1 && numbers[i].depth === numbers[i+1].depth;
                if (isPair) {
                    const magnitude = 3 * numbers[i].value + 2 * numbers[i+1].value;
                    newNumbers.push(new SnailNumber(magnitude, numbers[i].depth - 1));
                    i += 2;
                } else {
                    newNumbers.push(new SnailNumber(numbers[i].value, numbers[i].depth));
                    i++;
                }
            }
            if (numbers.length === newNumbers.length) {
                return newNumbers.map(sn => sn.value).reduce((a, b) => a + b, 0)
            }
            numbers = newNumbers;
        }

        return numbers[0].value;
    }

    public print(): string {
        let output: string = "[";
        forEach(this._numbers, (number: SnailNumber) => {
            if (output.length > 1) output+= ',';
            output += number.value;
        });
        return output + ']';
    }

    public printWithDepth(): string {
        let output: string = "[";
        forEach(this._numbers, (number: SnailNumber) => {
            if (output.length > 1) output+= ',';
            output += number.value + '(' + number.depth + ')';
        });
        return output + ']';
    }

    private reduce() {

        let somethingHappened: boolean = false;
        do
        {
            somethingHappened = false;
            let i: number = 0;
            while (i < this._numbers.length) {
                // a pair happens when we have two numbers with the same depth
                const isPair = i < this._numbers.length - 1 && this._numbers[i].depth === this._numbers[i + 1].depth;
                if (isPair && this._numbers[i].depth >= 5) {
                    // we need to reduce, find the first left standard number
                    if (i > 0) {
                        this._numbers[i - 1].value += this._numbers[i].value;
                    }
                    if (i < this._numbers.length - 2) {
                        this._numbers[i + 2].value += this._numbers[i + 1].value;
                    }

                    const actualDepth = this._numbers[i].depth - 1;
                    this._numbers.splice(i, 2);
                    this._numbers.splice(i, 0, new SnailNumber(0, actualDepth));
                    somethingHappened = true;
                    break;
                }
                i++;
            }
            i = 0;
            if (!somethingHappened) {
                while (i < this._numbers.length) {

                    if (this._numbers[i].value > 9) {
                        // ok need to split;
                        const left = Math.floor(this._numbers[i].value / 2.0);
                        const right = Math.ceil(this._numbers[i].value / 2.0);
                        this._numbers.splice(
                            i,
                            1,
                            new SnailNumber(left, this._numbers[i].depth + 1),
                            new SnailNumber(right, this._numbers[i].depth + 1));
                        somethingHappened = true;
                        break;
                    }
                    i++;
                }
            }

        } while (somethingHappened);
    }

    private IsStandardNumber(index: number): boolean {
        return index == this._numbers.length -1 ||
            this._numbers[index].depth !== this._numbers[index + 1].depth;
    }
}





