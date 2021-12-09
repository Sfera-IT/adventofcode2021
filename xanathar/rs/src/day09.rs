#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;


pub fn test1() {
    let map = utils::Map2D::load("../data/day9.txt", |s| s.as_bytes().iter().map(|b| b - b'0').collect::<Box<[u8]>>());
    let mut risk: u64 = 0;

    for x in 0..map.width() {
        for y in 0..map.height() {
            let v = map.get(x, y);
            let ns = map.neighbours8(x, y);
            let n = ns.iter().min().unwrap();

            if v < n {
                risk += (*v as u64) + 1;
            }
        }
    }

    println!("{}", risk);
}

pub fn test2() {
    #[derive(Copy, Clone, Debug)]
    enum BasinCell {
        Wall,
        Basin(usize),
        Unchecked,
    }

    let mut map = utils::Map2D::load("../data/day9.txt", |s| s.as_bytes().iter()
        .map(|b| if *b == b'9' { BasinCell::Wall } else { BasinCell::Unchecked }).collect::<Box<[BasinCell]>>());

    let mut basin_size = Vec::new();

    for x in 0..map.width() {
        for y in 0..map.height() {
            if let BasinCell::Unchecked = *(map.get(x, y)) {
                let size = map.flood_fill4(x, y, & |b| match b {
                    BasinCell::Unchecked => Some(BasinCell::Basin(basin_size.len())),
                    _ => None,
                });
                basin_size.push(size);
            }
        }
    }

    basin_size.sort_unstable();

    println!("Found {} basins: {:?}", basin_size.len(), basin_size);

    let b1 = basin_size[basin_size.len() - 1];
    let b2 = basin_size[basin_size.len() - 2];
    let b3 = basin_size[basin_size.len() - 3];

    println!("{}*{}*{} = {}", b1, b2, b3, b1 * b2 * b3);
}
