import 'jest';
import {Point, LoadFile, Game} from '../13';

describe('Helpers', () => {
    
    it('Basic load', async () => {

        const game = LoadFile("input1.txt");
        expect(game.points.length).toBe(18);
        expect(game.folds.length).toBe(2);
    });

    it('Basic fold', async () => {

        const game = LoadFile("input1.txt");
        game.performFolds();
        console.log("points:", game.points);
        expect(game.points.length).toBe(16);
    });

    it('Real fold', async () => {

        const game = LoadFile("input.txt");
        game.performFolds();
        expect(game.points.length).toBe(17);
    });

    it('Real fold graph', async () => {

        const game = LoadFile("input.txt");
        game.performFolds();
        const result = game.Plot();
        console.log(result); //now look at the console
    });
});