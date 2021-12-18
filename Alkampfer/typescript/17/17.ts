import {forEach} from 'lodash';

export function findMaxY(minx: number, maxx: number, miny:number, maxy:number): number {
    // ok, bruteforce?
    let higher_position = 0;

    // clearly it is absolutely not useful to have velocity higer than maxx

    for (let x = 1; x <= maxx; x++) {
        console.log("Trying x: " + x);
        // for y it is absolutely not useful to start with a velocity less than miny then
        // we do not exactly maximum, we can try a big number and hope for the best.
        for (let y = miny; y <= 1000; y++) {
            let shotHigherPosition  = 0;
            let currentx = 0;
            let currenty = 0;
            let velocityx = x;
            let velocityy = y;
            //looè until we can reach minimum y
            while (currenty >= miny) {
                currentx += velocityx;
                currenty += velocityy;
                if (currenty > shotHigherPosition) {
                    shotHigherPosition = currenty;
                }
                if (currentx >= minx && currenty >= miny && currentx <= maxx && currenty <= maxy) {
                    // this shot reached the target
                    if (shotHigherPosition > higher_position) {
                        higher_position = shotHigherPosition;
                    }
                    break;
                }
                if (velocityx > 0) {
                    velocityx--;
                };
                velocityy--;
            }
        }
    }
    return higher_position;
}

export function findDistinctShot(minx: number, maxx: number, miny:number, maxy:number): number {

    // ok, bruteforce?
    let numberOfGoodShot = 0;

    // clearly it is absolutely not useful to have velocity higer than maxx
    for (let x = 1; x <= maxx; x++) {

        // for y it is absolutely not useful to start with a velocity less than miny then
        // we do not exactly maximum, we can try a big number and hope for the best.
        for (let y = miny; y <= 1000; y++) {
            let shotHigherPosition  = 0;
            let currentx = 0;
            let currenty = 0;
            let velocityx = x;
            let velocityy = y;
            //looè until we can reach minimum y
            while (currenty >= miny) {
                currentx += velocityx;
                currenty += velocityy;

                if (currentx >= minx && currenty >= miny && currentx <= maxx && currenty <= maxy) {
                    // this shot reached the target
                    numberOfGoodShot++;
                    break;
                }
                if (velocityx > 0) {
                    velocityx--;
                };
                velocityy--;
            }
        }
    }
    return numberOfGoodShot;
}





