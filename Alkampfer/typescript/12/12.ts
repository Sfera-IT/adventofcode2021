import * as fs from 'fs';
import {find, forEach} from 'lodash';
import {arrayBuffer} from "stream/consumers";

export class Cave {

    constructor(name: string) {
        this._name = name;
        this._connectedCaves = new Array<Cave>(0);
        this._canBeVisitedMultipleTimes = name.toUpperCase() === name;
        this._isTerminal = name == 'start' || name == 'end';
    }

    get connectedCaves(): Array<Cave> {
        return this._connectedCaves;
    }

    get name(): string {
        return this._name;
    }

    get canBeVisitedMultipleTimes(): boolean {
        return this._canBeVisitedMultipleTimes;
    }

    get isTerminal(): boolean {
        return this._isTerminal;
    }

    private _name: string;
    private _connectedCaves: Array<Cave>
    private _canBeVisitedMultipleTimes: boolean;
    private _isTerminal: boolean;

    /**
     * Connects this cave to the given cave and back to create a graph.
     * @param cave
     * @constructor
     */
    public ConnectTo(cave: Cave) {
        this._connectedCaves.push(cave);
        if (!cave.connectedCaves.includes(this)) {
            cave.ConnectTo(this);
        }
    }
}

function _containsCave(list: Array<Cave>, fn: (cave: Cave) => boolean): boolean {
    return find(list, fn) != undefined
}

function _addToCave(caves: Array<Cave>, newCave: string) {
    if (!_containsCave(caves, c => c.name == newCave)) {
        caves.push(new Cave(newCave));
    }
}

function _connect(caves: Array<Cave>, cave1: string, cave2: string): void {
    const c1: Cave = find(caves, c => c.name == cave1) as Cave;
    const c2: Cave = find(caves, c => c.name == cave2) as Cave;
    c1.ConnectTo(c2);
}

export function LoadFile(filename: string): Array<Cave> {
    let caves = new Array<Cave>();
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    for (let line of lines) {
        const lineCaves = line.trim().split('-');
        _addToCave(caves, lineCaves[0]);
        _addToCave(caves, lineCaves[1]);
        _connect(caves, lineCaves[0], lineCaves[1]);
    }
    return caves;
}

/**
 * Perform a basic backtracking search to fin all paths.
 * @param cave
 * @param currentPath
 * @param paths
 * @constructor
 */
export function InnerBackTrack(cave: Cave, currentPath: Array<string>, paths: Array<Array<string>>) {

    //need to understand if we found the end we can add this path and backtrack
    if (cave.name == "end") {
        const foundPath = [...currentPath];
        foundPath.push(cave.name)
        paths.push(foundPath);
        return; //we cannot proceed forward
    }

    // if this cave was already visited and cannot be visited multiple time we need to stop
    if (currentPath.includes(cave.name) && !cave.canBeVisitedMultipleTimes) {
        return;
    }

    //ok this is a valid cave, lets add it to the path and proceed forward
    currentPath.push(cave.name);
    for (let connectedCave of cave.connectedCaves) {
        InnerBackTrack(connectedCave, currentPath, paths);
    }

    // we explored that cave, lets remove it from the path
    currentPath.pop();
}

export function BackTrack(caves: Array<Cave>): Array<Array<string>> {
    let paths = new Array<Array<string>>();
    const currentPath = new Array<string>();
    const startCave = find(caves, c => c.name == "start") as Cave;
    InnerBackTrack(startCave, currentPath, paths);
    return paths;
}

/**
 * Perform a basic backtracking search to fin all paths.
 * @param cave
 * @param currentPath
 * @param paths
 * @constructor
 */
export function InnerBackTrack2(cave: Cave, currentPath: Array<string>, paths: Array<Array<string>>, smallVisited: boolean) {

    /**
     * This is the inner function used to proceed the backtrack, it is parametrized due to the new rule
     * that a SINGLE small cave can be visited twice
     * @param newSmallVisited
     * @constructor
     */
    function Proceed(newSmallVisited: boolean) {

        // simple classic backtrack, push, move to children, then pop and exit
        currentPath.push(cave.name);
        for (let connectedCave of cave.connectedCaves) {
            InnerBackTrack2(connectedCave, currentPath, paths, newSmallVisited);
        }

        // we explored that cave, lets remove it from the path
        currentPath.pop();
    }

    //need to understand if we found the end we can add this path and backtrack
    if (cave.name == "end") {
        const foundPath = [...currentPath];
        foundPath.push(cave.name)
        paths.push(foundPath);
        return; //we cannot proceed forward
    }

    // Check if this cave stop the track for some rule
    if (currentPath.includes(cave.name) && !cave.canBeVisitedMultipleTimes) {

        // normally we should not proceed forward, but we need to let one single small cave to be visited twice
        if (!smallVisited && !cave.isTerminal) {
            Proceed(true);
        }
        return;
    }

    // ok this is a valid cave, lets add it to the path and proceed forward
    Proceed(smallVisited);
}

export function BackTrack2(caves: Array<Cave>): Array<Array<string>> {
    let paths = new Array<Array<string>>();
    const currentPath = new Array<string>();
    const startCave = find(caves, c => c.name == "start") as Cave;
    InnerBackTrack2(startCave, currentPath, paths, false);
    return paths;
}
