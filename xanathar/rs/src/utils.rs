#![allow(dead_code)]

use std::fs::File;
use std::io::{self, BufRead};
use std::iter::Iterator;


pub fn read_lines(filename: &str) -> impl Iterator<Item = String> {
    let file = File::open(filename).expect("file open failed");
    io::BufReader::new(file)
        .lines()
        .filter_map(|s| match s.as_deref() {
            Ok("") => None,
            Ok(s) => Some(s.to_string()),
            Err(_) => None,
        })
}

pub fn parse_lines<T>(filename: &str, parser: fn(String) -> Option<T>) -> Vec<T> {
    let file = File::open(filename).expect("file open failed");
    io::BufReader::new(file)
        .lines()
        .filter_map(|s| match s.as_deref() {
            Ok("") => None,
            Ok(s) => Some(s.to_string()),
            Err(_) => None,
        })
        .filter_map(parser)
        .collect()
}

