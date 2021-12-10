import { map, sum, reverse } from "lodash";

const _openParentheses = ['(', '<', '{', '['];

const _closingBracketPairs: {[key: string]: string} = { 
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>',
}
const _symbolScorePart1: {[key: string]: number} = {
    ')': 3,
    '}': 1197,
    ']': 57,
    '>': 25137
}

const _symbolScorePart2: {[key: string]: number} = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
}

export function GetScore(input: string[]): number {
    return sum(map(input, (c) => _symbolScorePart1[c]));
}

export class SyntaxChecker {
    private checkStack: string[];

    constructor() {
        this.checkStack = new Array<string>();
    }

    public Parse(char: string): boolean {

        if (_openParentheses.includes(char)) {
            this.checkStack.push(char);
            return true;
        }

        // we need to pop the last element and check if it matches the current char
        if (this.checkStack.length === 0) {
            return false;
        }
        const last = this.checkStack.pop();
        return this._isClosingMatch(<string>last, char);
    }

    public ParseLine(line: string): boolean {
        for (const char of line) { 
            if (!this.Parse(char)) { 
                return false;
            }
        }

        // return true, we did not detected any errors
        return true;
    }

    public GetScoreToCompleteLine() : number {

        return map(
                reverse(this.checkStack), 
                (c) => _symbolScorePart2[c])
            .reduce((acc, current) => acc * 5 + current);
    }

    private _isClosingMatch(last: string, char: string): boolean {
        return _closingBracketPairs[last] === char;
    }
}