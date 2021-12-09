import {find} from 'lodash';
import { getMaxListeners } from 'process';

export function CreateInputData(data: string[]): Array<Array<number>>
{
    // brutal use a outer 'frame' to remove special cases
    const lineLength = data[0].length + 2;
    const retvalue = new Array<Array<number>>();
    retvalue.push(Array(lineLength).fill(10));
    data.forEach(line => {
        const row = new Array<number>(lineLength);
        row[0] = row[lineLength - 1] = 10;
        for (let i = 1; i < line.length + 1; i++) {
            row[i] = line.charCodeAt(i - 1) - 48;
        }
        retvalue.push(row);
    });
    retvalue.push(Array(lineLength).fill(10));
    return retvalue;
}

function _findMinimumAndPerform(
    data: Array<Array<number>>,
    fn: (x: number, y: number) => number) {

    const lineLength = data[0].length;
    for (let i = 1; i < data.length - 1; i++) {
        for (let j = 1; j < lineLength - 1; j++) {
            const thisCell = data[i][j];
            if (thisCell < data[i-1][j] && thisCell < data[i+1][j] &&
                thisCell < data[i][j-1] && thisCell < data[i][j+1]) {
                
                fn(i, j);
            }
        }
    }
}

export function Exercise01(data: Array<Array<number>>): number
{
    let retvalue = 0;
    _findMinimumAndPerform(data, (x, y) =>         retvalue += data[x][y] + 1);
    return retvalue;
}

export function Exercise02(data: Array<Array<number>>): number
{
    let basins = new Array<number>();
    _findMinimumAndPerform(data, (x, y) => basins.push(GetBasin(data, x , y).length)); 
    basins.sort((a, b) => b - a);

    return basins[0] * basins[1] * basins[2];
}

export interface Position {
    x: number;
    y: number;
}

export function GetAdiacentPointsWithCondition(
    data: Array<Array<number>>, 
    x: number, 
    y: number,
    condition: (a: number, b:number) => boolean ): Array<Position>
{
    const retvalue = new Array<Position>();
    if (condition(data[x][y], data[x-1][y])) retvalue.push({x: x-1, y: y});
    if (condition(data[x][y], data[x+1][y])) retvalue.push({x: x+1, y: y});
    if (condition(data[x][y], data[x][y-1])) retvalue.push({x: x, y: y-1});
    if (condition(data[x][y], data[x][y+1])) retvalue.push({x: x, y: y+1});

    return retvalue;
}

function _containsPosition(list: Array<Position>, pos: Position): boolean
{
    return find(list, (p) => p.x == pos.x && p.y == pos.y) != undefined
}

export function GetBasin(
    data: Array<Array<number>>, 
    x: number, 
    y: number) : Array<Position> {

    const retvalue = new Array<Position>();
    const toVisit = new Array<Position>();
    toVisit.push({x: x, y: y});

    // ok now we need to iterate until we have no more element into toVisit
    while (toVisit.length > 0) {
        const element = toVisit.pop() as Position;
        retvalue.push(element);
        const adiacentPoints = GetAdiacentPointsWithCondition(
            data, 
            element.x, 
            element.y, 
            (a, b) => b < 9);
        adiacentPoints.forEach(point => {
            //we need to add adiacent point if it was not already visited or is it in visit list
           if (!_containsPosition(retvalue, point) && 
                !_containsPosition(toVisit, point)) {
                toVisit.push(point);
            }
        })
    }
    return retvalue;
}
