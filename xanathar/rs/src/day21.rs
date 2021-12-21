
fn mod_plus_1(val: u32, div: u32) -> u32 {
    ((val - 1) % div) + 1
}

pub fn dirac_game(
    player1_pos: u32,
    player2_pos: u32,
) -> ([u32; 2], u32) {
    let mut pos = [player1_pos, player2_pos];
    let mut score = [0u32, 0];
    let mut turns = 0u32;
    let mut dice = 0u32;

    while score[0] < 1000 && score[1] < 1000 {
        turns += 1;
        let mut roll = 0;
        let pidx = (1-(turns & 1)) as usize;

        dice = mod_plus_1(dice + 1, 100);
        roll += dice;
        dice = mod_plus_1(dice + 1, 100);
        roll += dice;
        dice = mod_plus_1(dice + 1, 100);
        roll += dice;

        pos[pidx] = mod_plus_1(pos[pidx] + roll, 10);

        score[pidx] += pos[pidx];
    }

    (score, turns * 3)
}

pub fn test1() {
    let (score, turns) = dirac_game(7, 3);
    println!("score: {:?} // turns: {} // X: {}", score, turns, std::cmp::min(score[0], score[1]) * turns);
}


fn quantum_turn(pos: [u32;2], score: [u32;2], player_active: usize) -> (u64, u64) {
    const DICE_ROLLS: [(u32, u64); 7] = [
        // Possible outcomes of 3 dice rolls, with their frequency
        // (e.g. 4 can be obtained with 1+1+2, 1+2+1 and 2+1+1)
        (3, 1), (4, 3), (5, 6), (6, 7), (7, 6), (8, 3), (9, 1)
    ];

    let mut local_wins = [0u64; 2];

    for dice in DICE_ROLLS.iter() {
        let mut new_pos = pos;
        let mut new_score = score;
        new_pos[player_active] = mod_plus_1(new_pos[player_active] + dice.0, 10);
        new_score[player_active] += new_pos[player_active];

        if new_score[player_active] >= 21 {
            local_wins[player_active] += dice.1;
        } else {
            let res = quantum_turn(new_pos, new_score, 1 - player_active);
            local_wins[0] += res.0 * dice.1;
            local_wins[1] += res.1 * dice.1;
        }
    }

    (local_wins[0], local_wins[1])
}

pub fn test2() {
    let res = quantum_turn([7, 3], [0, 0], 0);
    println!("{:?} -- {}", res, std::cmp::max(res.0, res.1));
}


