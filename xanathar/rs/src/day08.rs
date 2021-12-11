#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;
use std::fmt;

#[derive(Clone, Copy, PartialEq, Debug)]
struct Pattern {
    pub segs: u8,
    pub bits: usize,
}

impl Pattern {
    pub fn from_str(s: &str) -> Self {
        let mut segs = 0u8;

        for c in s.chars() {
            segs |= match c {
                'a' => 1,
                'b' => 2,
                'c' => 4,
                'd' => 8,
                'e' => 16,
                'f' => 32,
                'g' => 64,
                _ => panic!(),
            };
        }

        Pattern {
            segs,
            bits: s.len(),
        }
    }
}



#[derive(Debug)]
struct Signal {
    pub before: Vec<Pattern>,
    pub after: Vec<Pattern>,
}

impl Signal {
    pub fn translate_afters(&self) -> u32 {
        // Discover the trivial ones
        let p1 = self.before.iter().find(|p| p.bits == 2).unwrap();
        let p7 = self.before.iter().find(|p| p.bits == 3).unwrap();
        let p4 = self.before.iter().find(|p| p.bits == 4).unwrap();
        let p8 = self.before.iter().find(|p| p.bits == 7).unwrap();

        // 3 is the only 5-segment pattern which overlaps with 7
        let p3 = self.before.iter().find(
            |p| p.bits == 5 && (p.segs & p7.segs) == p7.segs
        ).unwrap();

        // the d-segment is the only one which is in p3 and p4 but not in p7
        let segd = (p3.segs ^ p7.segs) & p4.segs;

        // 0 is the only 6-segment pattern without segd
        let p0 = self.before.iter().find(
            |p| p.bits == 6 && (p.segs & segd) == 0
        ).unwrap();

        // segb is 4, minus pattern 1, and without segd
        let segb = (p4.segs ^ p1.segs) ^ segd;

        // 2 is the only remaining 5-segment pattern without segb; 5 is the other
        let p2 = self.before.iter().find(
            |p| p.bits == 5 && (p.segs & segb) == 0 && (p.segs != p3.segs)
        ).unwrap();
        let p5 = self.before.iter().find(
            |p| p.bits == 5 && (p.segs != p2.segs) && (p.segs != p3.segs)
        ).unwrap();

        // 9 is the only remaining 6-segment pattern which overlaps with 1; 6 is the other
        let p9 = self.before.iter().find(
            |p| p.bits == 6 && (p.segs & p1.segs) == p1.segs && (p.segs != p0.segs)
        ).unwrap();
        let p6 = self.before.iter().find(
            |p| p.bits == 6 && (p.segs != p0.segs) && (p.segs != p9.segs)
        ).unwrap();

        let mut result = 0u32;

        for p in self.after.iter() {
            let d = match p.segs {
                x if x == p0.segs => 0,
                x if x == p1.segs => 1,
                x if x == p2.segs => 2,
                x if x == p3.segs => 3,
                x if x == p4.segs => 4,
                x if x == p5.segs => 5,
                x if x == p6.segs => 6,
                x if x == p7.segs => 7,
                x if x == p8.segs => 8,
                x if x == p9.segs => 9,
                _ => panic!(),
            };
            result = result * 10 + d;
        }

        result
    }
}


fn load_raw() -> Vec<Signal> {
    utils::parse_lines("../data/day8.txt", |s| {
        let blocks = s.split('|').collect::<Vec<&str>>();

        let before: Vec<Pattern> = blocks[0]
            .split(' ')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| Pattern::from_str(s))
            .collect();

        let after: Vec<Pattern> =  blocks[1]
            .split(' ')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| Pattern::from_str(s))
            .collect();

        let v = Signal {
            before,
            after,
        };

        assert_eq!(v.before.len(), 10);
        assert_eq!(v.after.len(), 4);

        Some(v)
    })
}


pub fn test1() {
    let vals = load_raw();

    let c = vals.iter()
        .flat_map(|v| v.after.iter())
        .filter(|s| s.bits == 2 || s.bits == 3 || s.bits == 4 || s.bits == 7)
        .count();

    println!("{:?}", c);
}

pub fn test2() {
    let vals = load_raw();

    let sum: u32 = vals.iter().map(|v| v.translate_afters()).sum();

    println!("SUM = {}", sum);
}
