use std::iter::Iterator;
use std::collections::HashSet;
use std::ops::RangeInclusive;
use crate::utils;
use std::cmp::{min, max};

#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
struct Point(pub i64, pub i64);

struct Map {
    map: HashSet<Point>,
    default: bool,
    x_range: RangeInclusive<i64>,
    y_range: RangeInclusive<i64>,
}

impl Map {
    pub fn new(lines: &[String]) -> Self {
        let mut map = HashSet::<Point>::new();
        let mut max_x = 0;
        let mut max_y = 0;

        for (y, line) in lines.iter().enumerate() {
            for (x, b) in line.as_bytes().iter().enumerate() {
                if *b == b'#' {
                    let (x, y) = (x as i64, y as i64);
                    map.insert(Point(x, y));
                    max_x = max(x, max_x);
                    max_y = max(y, max_y);
                }
            }
        }

        Self {
            map,
            default: false,
            x_range: 0..=max_x,
            y_range: 0..=max_y,
        }
    }

    pub fn get(&self, x: i64, y: i64) -> bool {
        self.map.contains(&Point(x, y)) ^ self.default
    }

    pub fn calc_lut_index(&self, x: i64, y: i64) -> usize {
        // Disable warnings to have nicer column code
        #![allow(clippy::unusual_byte_groupings)]
        #![allow(clippy::identity_op)]
        let mut idx = 0;
        idx |= if self.get(x - 1, y - 1) { 0b_100000000 } else { 0 };
        idx |= if self.get(x - 0, y - 1) { 0b_010000000 } else { 0 };
        idx |= if self.get(x + 1, y - 1) { 0b_001000000 } else { 0 };
        idx |= if self.get(x - 1, y - 0) { 0b_000100000 } else { 0 };
        idx |= if self.get(x - 0, y - 0) { 0b_000010000 } else { 0 };
        idx |= if self.get(x + 1, y - 0) { 0b_000001000 } else { 0 };
        idx |= if self.get(x - 1, y + 1) { 0b_000000100 } else { 0 };
        idx |= if self.get(x - 0, y + 1) { 0b_000000010 } else { 0 };
        idx |= if self.get(x + 1, y + 1) { 0b_000000001 } else { 0 };
        idx
    }

    pub fn enhance(&self, lut: &[bool]) -> Self {
        let mut newmap = HashSet::<Point>::new();
        let newdefault = if lut[0] { !self.default } else { self.default };
        let mut min_x = *self.x_range.end();
        let mut max_x = *self.x_range.start();
        let mut min_y = *self.y_range.end();
        let mut max_y = *self.y_range.start();

        for y in (self.y_range.start() - 2)..(self.y_range.end() + 2) {
            for x in (self.x_range.start() - 2)..(self.x_range.end() + 2) {
                let lut_idx = self.calc_lut_index(x, y);
                let lut_val = lut[lut_idx];

                if lut_val != newdefault {
                    max_x = max(x, max_x);
                    max_y = max(y, max_y);
                    min_x = min(x, min_x);
                    min_y = min(y, min_y);
                    newmap.insert(Point(x, y));
                }
            }
        }

        Map {
            map: newmap,
            default: newdefault,
            x_range: min_x..=max_x,
            y_range: min_y..=max_y,
        }
    }
}

fn lut_parser(s: &str) -> Box<[bool]> {
    s.as_bytes().iter().map(|b| match b {
        b'.' => false,
        b'#' => true,
        c => panic!("invalid char '{}'", c),
    }).collect::<Box<[bool]>>()
}

pub fn test1() {
    let data = utils::read_lines("../data/day20.txt").collect::<Vec<String>>();

    let lut = lut_parser(&data[0]);
    let mut map = Map::new(&data[1..]);

    for i in 1..=50 {
        map = map.enhance(&lut);
        println!("after {} : count = {}", i, map.map.len());
    }
}

pub fn test2() {
    test1();
}
