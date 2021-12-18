use std::iter::Iterator;
use std::ops::RangeInclusive;

// I guess the difficulty here would be to define when to stop, except trying 2 million times
// is plenty enough and quick enough. Meh, not happy.

#[derive(Clone, Debug)]
struct HitData {
    pub velocity: Vector,
    pub time: u64,
    pub highest_y: i64,
}

#[derive(Clone, Debug)]
enum HitResult {
    Hit(HitData),
    Underreach,
    Overreach,
    Undetermined,
    Miss,
}

type Vector = (i64, i64);

fn hit_test(velocity: Vector, area_x: &RangeInclusive<i64>, area_y: &RangeInclusive<i64>) -> HitResult {
    let mut vel = velocity;

    let (mut x, mut y, mut highest_y) = (0, 0, 0);

    for time in 1..=2000000 {
        if area_x.contains(&x) && area_y.contains(&y) {
            return HitResult::Hit(HitData {
                velocity,
                time,
                highest_y,
            });
        } else if x > *area_x.end() {
            return HitResult::Overreach;
        } else if y < *area_y.start() && x < *area_x.start() {
            return HitResult::Underreach;
        } else if y < *area_y.start() {
            return HitResult::Miss;
        }

        x += vel.0;
        y += vel.1;
        highest_y = std::cmp::max(y, highest_y);

        vel.0 = std::cmp::max(0, vel.0 - 1);
        vel.1 -= 1;
    }

    HitResult::Undetermined
}



fn find_hits(area_x: RangeInclusive<i64>, area_y: RangeInclusive<i64>) -> Vec<HitData> {
    let mut hits = Vec::new();

    for vx in 1..=*area_x.end() {
        for vy in -2000..=2000 {
            match hit_test((vx, vy), &area_x, &area_y) {
                HitResult::Hit(hit) => {
                    println!("Hit: {:?}", hit);
                    hits.push(hit);
                }
                HitResult::Underreach => (),
                HitResult::Overreach => (),
                HitResult::Undetermined => panic!("undetermined result"),
                HitResult::Miss => (),
            }
        }
    }

    hits
}


pub fn test1() {
    let hits = find_hits(155..=182, -117..=-67);

    println!("Max-Y: {}", hits.iter().map(|h| h.highest_y).max().unwrap());
    println!("Num: {}", hits.len());
}

pub fn test2() {
    test1();
}


