#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;
use utils::Map2D;

pub fn step(map: &mut Map2D<u64>) -> u64 {
    // First, the energy level of each octopus increases by 1.
    for x in 0..map.width() {
        for y in 0..map.height() {
            map.set(x, y, map.get(x, y) + 1);
        }
    }

    // Then, any octopus with an energy level greater than 9 flashes.
    // This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9.
    let mut flashqueue = VecDeque::new();
    for x in 0..map.width() {
        for y in 0..map.height() {
            if *map.get(x, y) == 10 {
                flashqueue.push_back((x, y));
            }
        }
    }

    while let Some((x, y)) = flashqueue.pop_front() {
        for (nx, ny) in map.neighbours8_coords(x, y).iter() {
            let (nx, ny) = (*nx, *ny);
            map.set(nx, ny, map.get(nx, ny) + 1);
            if *map.get(nx, ny) == 10 {
                flashqueue.push_back((nx, ny));
            }
        }
    }


    // Then, Finally, any octopus that flashed during this step has its energy level set to 0
    let mut flashcount = 0;
    for x in 0..map.width() {
        for y in 0..map.height() {
            if *map.get(x, y) >= 10 {
                flashcount += 1;
                map.set(x, y, 0);
            }
        }
    }
    flashcount
}

pub fn test1() {
    let mut map = utils::Map2D::load("../data/day11.txt", |s| s.as_bytes().iter().map(|b| (b - b'0') as u64).collect::<Box<[u64]>>());

    let res: u64 = (1..=100).map(|_| step(&mut map)).sum();

    println!("{}", res);
}

pub fn test2() {
    let mut map = utils::Map2D::load("../data/day11.txt", |s| s.as_bytes().iter().map(|b| (b - b'0') as u64).collect::<Box<[u64]>>());

    let res: u64 = (1..std::u64::MAX).find(|_| step(&mut map) == 100).unwrap();

    println!("{}", res);
}
