#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;

pub fn test1() {
    let data = utils::parse_lines("../data/day1.txt", |s| s.parse::<u32>().ok());
    let mut count = 0u32;

    for i in 1..data.len() {
        if data[i] > data[i - 1] {
            count += 1;
        }
    }

    println!("{}", count);
}

pub fn test2() {
    let data = utils::parse_lines("../data/day1.txt", |s| s.parse::<u32>().ok());
    let mut count = 0u32;

    for i in 3..data.len() {
        if data[i] > data[i - 3] {
            count += 1;
        }
    }

    println!("{}", count);
}

