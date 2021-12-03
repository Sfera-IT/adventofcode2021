#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;

enum Command {
    Forward(i64),
    UpDown(i64),
}

fn parse_command(s: String) -> Option<Command> {
    let cmd: Vec<&str> = s.split(' ').collect();

    match cmd[0] {
        "forward" => Some(Command::Forward(cmd[1].parse::<i64>().unwrap())),
        "down" => Some(Command::UpDown(cmd[1].parse::<i64>().unwrap())),
        "up" => Some(Command::UpDown(-cmd[1].parse::<i64>().unwrap())),
        _ => None,
    }
}


pub fn test1() {
    let data = utils::parse_lines("../data/day2.txt", parse_command);

    let mut depth = 0i64;
    let mut pos = 0i64;

    for c in data.iter() {
        match c {
            Command::Forward(v) => pos += v,
            Command::UpDown(v) => depth += v,
        }
    }

    println!("{}", depth * pos);
}

pub fn test2() {
    let data = utils::parse_lines("../data/day2.txt", parse_command);

    let mut depth = 0i64;
    let mut aim = 0i64;
    let mut pos = 0i64;

    for c in data.iter() {
        match c {
            Command::Forward(v) => { pos += v; depth += v * aim; },
            Command::UpDown(v) => aim += v,
        }
    }

    println!("{}", depth * pos);
}


