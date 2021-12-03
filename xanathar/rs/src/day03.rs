#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;

type ByteStr = Box<[u8]>;

fn parse_bytestr(data: String) -> Option<ByteStr> {
    Some(data.as_bytes().iter().map(|b| b - b'0').collect())
}

fn bytestr_to_num(data: &ByteStr, filter: fn(u8) -> u8) -> u32 {
    data.iter().fold(0u32, | res, i | (res << 1) | (filter(*i) as u32))
}

fn calc_common(data: &[ByteStr], column: usize, default: u8) -> u8
{
    let mut count0 = 0usize;
    let mut count1 = 0usize;

    for s in data.iter()
    {
        if s[column] == 1 {
            count1 += 1;
        } else {
            count0 += 1;
        }
    }

    match count1.cmp(&count0) {
        std::cmp::Ordering::Greater => 1,
        std::cmp::Ordering::Less => 0,
        std::cmp::Ordering::Equal => default,
    }
}


pub fn test1() {
    let data = utils::parse_lines("../data/day3.txt", parse_bytestr);

    let cols = data[0].len();

    let common = (0..cols).map(|c| calc_common(&data, c, 0)).collect::<ByteStr>();

    let gamma = bytestr_to_num(&common, |v| v);
    let epsil = bytestr_to_num(&common, |v| 1 - v);

    println!("g={}, e={}, g*e={}", gamma, epsil, gamma*epsil);
}

pub fn test2() {
    let mut o2data = utils::parse_lines("../data/day3.txt", parse_bytestr);
    let mut co2data = o2data.clone();

    let cols = o2data[0].len();

    for col in 0..cols {
        if o2data.len() > 1 {
            let common = calc_common(&o2data, col, 1);
            o2data.retain(|v| v[col] == common);
        }

        if co2data.len() > 1 {
            let common = calc_common(&co2data, col, 1);
            co2data.retain(|v| v[col] != common);
        }

        if o2data.len() == 1 && co2data.len() == 1 {
            break;
        }
    }

    let o2 = bytestr_to_num(&o2data[0], |v| v);
    let co2 = bytestr_to_num(&co2data[0], |v| v);

    println!("co2={}, o2={}, o2*co2={}", o2, co2, o2*co2);
}

