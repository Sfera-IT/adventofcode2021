#![allow(unused_imports)]
#![allow(dead_code)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;
use std::ops::{Add, Sub};

// Supersloppy: only 24 of these are geometrically sound, but all 48 are used
// because there are no false positives in the dataset
#[derive(Copy, Clone, PartialEq, Debug, Eq, Hash)]
#[allow(clippy::upper_case_acronyms)]
enum Rotation {
    RXY, RXy, RXZ, RXz, RxZ, Rxz, RxY, Rxy,
    RYX, RYx, RYZ, RYz, RyZ, Ryz, RyX, Ryx,
    RZY, RZy, RZX, RZx, RzX, Rzx, RzY, Rzy,
    NXY, NXy, NXZ, NXz, NxZ, Nxz, NxY, Nxy,
    NYX, NYx, NYZ, NYz, NyZ, Nyz, NyX, Nyx,
    NZY, NZy, NZX, NZx, NzX, Nzx, NzY, Nzy,
}

impl Rotation {
    pub fn all() -> impl Iterator<Item = Rotation> {
        static VALUES: [Rotation;48] = [
            Rotation::RXY, Rotation::RXy, Rotation::RXZ, Rotation::RXz, Rotation::RxZ, Rotation::Rxz, Rotation::RxY, Rotation::Rxy,
            Rotation::RYX, Rotation::RYx, Rotation::RYZ, Rotation::RYz, Rotation::RyZ, Rotation::Ryz, Rotation::RyX, Rotation::Ryx,
            Rotation::RZY, Rotation::RZy, Rotation::RZX, Rotation::RZx, Rotation::RzX, Rotation::Rzx, Rotation::RzY, Rotation::Rzy,
            Rotation::NXY, Rotation::NXy, Rotation::NXZ, Rotation::NXz, Rotation::NxZ, Rotation::Nxz, Rotation::NxY, Rotation::Nxy,
            Rotation::NYX, Rotation::NYx, Rotation::NYZ, Rotation::NYz, Rotation::NyZ, Rotation::Nyz, Rotation::NyX, Rotation::Nyx,
            Rotation::NZY, Rotation::NZy, Rotation::NZX, Rotation::NZx, Rotation::NzX, Rotation::Nzx, Rotation::NzY, Rotation::Nzy,
        ];
        VALUES.iter().copied()
    }


}


#[derive(Copy, Clone, PartialEq, Eq, Debug, Hash)]
struct Point(i32, i32, i32);

impl Point {
    pub fn rotate(self, rot: Rotation) -> Self {
        let p = self;
        match rot {
            Rotation::RXY => Point( p.0, p.1, p.2),
            Rotation::RXy => Point( p.0,-p.1, p.2),
            Rotation::RXZ => Point( p.0, p.2, p.1),
            Rotation::RXz => Point( p.0,-p.2, p.1),
            Rotation::RxZ => Point(-p.0, p.2, p.1),
            Rotation::Rxz => Point(-p.0,-p.2, p.1),
            Rotation::RxY => Point(-p.0, p.1, p.2),
            Rotation::Rxy => Point(-p.0,-p.1, p.2),
            Rotation::RYX => Point( p.1, p.0, p.2),
            Rotation::RYx => Point( p.1,-p.0, p.2),
            Rotation::RYZ => Point( p.1, p.2, p.0),
            Rotation::RYz => Point( p.1,-p.2, p.0),
            Rotation::RyZ => Point(-p.1, p.2, p.0),
            Rotation::Ryz => Point(-p.1,-p.2, p.0),
            Rotation::RyX => Point(-p.1, p.0, p.2),
            Rotation::Ryx => Point(-p.1,-p.0, p.2),
            Rotation::RZY => Point( p.2, p.1, p.0),
            Rotation::RZy => Point( p.2,-p.1, p.0),
            Rotation::RZX => Point( p.2, p.0, p.1),
            Rotation::RZx => Point( p.2,-p.0, p.1),
            Rotation::RzX => Point(-p.2, p.0, p.1),
            Rotation::Rzx => Point(-p.2,-p.0, p.1),
            Rotation::RzY => Point(-p.2, p.1, p.0),
            Rotation::Rzy => Point(-p.2,-p.1, p.0),

            Rotation::NXY => Point( p.0, p.1,-p.2),
            Rotation::NXy => Point( p.0,-p.1,-p.2),
            Rotation::NXZ => Point( p.0, p.2,-p.1),
            Rotation::NXz => Point( p.0,-p.2,-p.1),
            Rotation::NxZ => Point(-p.0, p.2,-p.1),
            Rotation::Nxz => Point(-p.0,-p.2,-p.1),
            Rotation::NxY => Point(-p.0, p.1,-p.2),
            Rotation::Nxy => Point(-p.0,-p.1,-p.2),
            Rotation::NYX => Point( p.1, p.0,-p.2),
            Rotation::NYx => Point( p.1,-p.0,-p.2),
            Rotation::NYZ => Point( p.1, p.2,-p.0),
            Rotation::NYz => Point( p.1,-p.2,-p.0),
            Rotation::NyZ => Point(-p.1, p.2,-p.0),
            Rotation::Nyz => Point(-p.1,-p.2,-p.0),
            Rotation::NyX => Point(-p.1, p.0,-p.2),
            Rotation::Nyx => Point(-p.1,-p.0,-p.2),
            Rotation::NZY => Point( p.2, p.1,-p.0),
            Rotation::NZy => Point( p.2,-p.1,-p.0),
            Rotation::NZX => Point( p.2, p.0,-p.1),
            Rotation::NZx => Point( p.2,-p.0,-p.1),
            Rotation::NzX => Point(-p.2, p.0,-p.1),
            Rotation::Nzx => Point(-p.2,-p.0,-p.1),
            Rotation::NzY => Point(-p.2, p.1,-p.0),
            Rotation::Nzy => Point(-p.2,-p.1,-p.0),
        }
    }
}

impl std::str::FromStr for Point {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let v = s.split(',').map(|s| s.parse::<i32>().unwrap()).collect::<Vec<i32>>();
        Ok(Self(v[0], v[1], v[2]))
    }
}

impl Add for Point {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Point(self.0 + other.0, self.1 + other.1, self.2 + other.2)
    }
}

impl Sub for Point {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        Point(self.0 - other.0, self.1 - other.1, self.2 - other.2)
    }
}

#[derive(Clone)]
struct Scanner {
    beacons: HashSet<Point>,
}

impl Scanner {
    pub fn new() -> Self {
        Self {
            beacons: HashSet::new(),
        }
    }

    pub fn rotate(&self, r: Rotation) -> Self {
        Self {
            beacons: self.beacons.iter().map(|p| p.rotate(r)).collect(),
        }
    }

    pub fn translate(&self, offset: Point) -> Self {
        Self {
            beacons: self.beacons.iter().map(|p| *p + offset).collect(),
        }
    }

    pub fn add_beacon(&mut self, p: Point) {
        self.beacons.insert(p);
    }
}

fn load_scanners() -> Vec<Scanner> {
    let mut v = Vec::new();

    for s in utils::read_lines("../data/day19.txt") {
        if !s.is_empty() {
            if s.starts_with("--") {
                v.push(Scanner::new());
            } else {
                let p = s.parse::<Point>().unwrap();
                let l = v.len() - 1;
                v[l].add_beacon(p);
            }
        }
    }
    v
}

fn try_merge(base: &Scanner, other: &Scanner, overlap_threshold: usize) -> Option<(Scanner, Point)> {
    for r in Rotation::all() {
        let other = other.rotate(r);

        for b in base.beacons.iter() {
            for p in other.beacons.iter() {
                let offset = *b - *p;
                let other = other.translate(offset);
                let overlap = other.beacons.intersection(&base.beacons).count();
                if overlap >= overlap_threshold {
                    let mut res = Scanner::new();
                    for p in base.beacons.iter() {
                        res.add_beacon(*p);
                    }
                    for p in other.beacons.iter() {
                        res.add_beacon(*p);
                    }
                    return Some((res, offset))
                }
            }
        }
    }
    None
}


pub fn test1() {
    let mut scanners = load_scanners();
    let mut scanner_points = vec![Point(0, 0, 0)];
    let mut result = scanners[0].clone();
    scanners.remove(0);

    while !scanners.is_empty() {
        for (i, s) in scanners.iter().enumerate() {
            if let Some((merged, origin)) = try_merge(&result, s, 12) {
                result = merged;
                scanner_points.push(origin);
                scanners.remove(i);
                break;
            }
        }
    }

    println!("Beacons: {}", result.beacons.len());

    let mut distances = Vec::new();

    for p1 in scanner_points.iter() {
        for p2 in scanner_points.iter() {
            let d = *p1 - *p2;
            distances.push(d.0.abs() + d.1.abs() + d.2.abs());
        }
    }

    println!("Max dist: {:?}", distances.iter().max());

}

pub fn test2() {
    test1();
}


