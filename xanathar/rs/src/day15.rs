use std::iter::Iterator;
use std::collections::BinaryHeap;
use crate::utils;
use utils::Map2D;
use std::cmp::*;

#[derive(Clone, Debug, Eq, PartialEq)]
struct MapTile {
    pub weight: u64,
    pub cost: u64,
}

impl MapTile {
    pub fn new(weight: u64) -> Self {
        Self {
            weight,
            cost: u64::MAX,
        }
    }
}


fn djikstra_solve(map: &mut Map2D<MapTile>) {
    type MapTileRef = Reverse<(u64, usize, usize)>;
    let mut adiacent = BinaryHeap::<MapTileRef>::new();
    adiacent.push(Reverse((0, 0, 0)));

    while let Some(Reverse((cost, x, y))) = adiacent.pop() {
        let tile = map.get_mut(x, y);

        if cost >= tile.cost {
            continue;
        }

        tile.cost = cost;

        if x == map.width() - 1 && y == map.height() - 1 {
            break;
        }

        for (nx, ny) in map.neighbours4_coords(x, y).iter() {
            let tile = map.get(*nx, *ny);
            let tile_cost = cost + tile.weight;
            if tile_cost < tile.cost {
                adiacent.push(Reverse((tile_cost, *nx, *ny)));
            }
        }
    }
}

#[allow(dead_code)]
fn astar_solve(map: &mut Map2D<MapTile>) {
    type MapTileRef = Reverse<(u64, u64, usize, usize)>;
    fn dist(x: usize, y: usize, x2: usize, y2: usize) -> u64 {
        (y2 - y + x2 - x - 2) as u64
    }

    let mut adiacent = BinaryHeap::<MapTileRef>::new();
    adiacent.push(Reverse((dist(0, 0, map.width(), map.height()), 0, 0, 0)));

    while let Some(Reverse((_, cost, x, y))) = adiacent.pop() {
        let tile = map.get_mut(x, y);

        if cost >= tile.cost {
            continue;
        }

        tile.cost = cost;

        if x == map.width() - 1 && y == map.height() - 1 {
            break;
        }

        for (nx, ny) in map.neighbours4_coords(x, y).iter() {
            let tile = map.get(*nx, *ny);
            let tile_cost = cost + tile.weight;
            if tile_cost < tile.cost {
                let heur = tile_cost + dist(*nx, *ny, map.width(), map.height());
                adiacent.push(Reverse((heur, tile_cost, *nx, *ny)));
            }
        }
    }
}

pub fn test1() {
    let mut map = Map2D::load("../data/day15.txt", |s| s.as_bytes().iter().map(|b| MapTile::new((b - b'0') as u64)).collect::<Box<[MapTile]>>());
    djikstra_solve(&mut map);
    println!("w: {}", map.get(map.width() - 1, map.height() - 1).cost);
}

pub fn test2() {
    let base_map = Map2D::load("../data/day15.txt", |s| s.as_bytes().iter().map(|b| (b - b'0') as u64).collect::<Box<[u64]>>());

    let mut tiled_map = Map2D::filled(5 * base_map.width(), 5 * base_map.height(), &0u64);

    for ty in 0..5 {
        for tx in 0..5 {
            for oy in 0..base_map.height() {
                for ox in 0..base_map.width() {
                    let x = ox + tx * base_map.width();
                    let y = oy + ty * base_map.height();
                    let incr = (tx + ty) as u64;
                    tiled_map.set(x, y, (base_map.get(ox, oy) + incr - 1) % 9 + 1);
                }
            }
        }
    }

    let mut map = Map2D::from_map(tiled_map, |v| MapTile::new(*v));
    djikstra_solve(&mut map);
    println!("w: {}", map.get(map.width() - 1, map.height() - 1).cost);
}
