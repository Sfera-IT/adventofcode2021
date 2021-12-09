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

pub fn parse_lines<T>(filename: &str, parser: impl Fn(String) -> Option<T>) -> Vec<T> {
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



pub struct Map2D<T> {
    map: Vec<Box<[T]>>,
    width: usize,
    height: usize,
}

impl<T> Map2D<T> {
    pub fn load(filename: &str, parser: impl Fn(String) -> Box<[T]>) -> Self {
        let map = parse_lines(filename, |s| Some(parser(s)));
        let width = map[0].len();
        let height = map.len();

        Map2D {
            map, width, height,
        }
    }

    #[allow(dead_code)]
    pub fn from_map<O>(m: Map2D<O>, mapper: impl Fn(&O) -> T) -> Self {
        let mut newmap = Vec::<Box<[T]>>::new();

        for r in m.map.iter() {
            newmap.push(r.iter().map(&mapper).collect());
        }

        Map2D {
            map: newmap,
            height: m.height,
            width: m.width,
        }
    }

    pub fn width(&self) -> usize { self.width }
    pub fn height(&self) -> usize { self.height }

    pub fn at(&self, x: isize, y: isize) -> Option<&T> {
        if x < 0 || y < 0 || x >= (self.width as isize) || y >= (self.height as isize) {
            None
        } else {
            Some(self.get(x as usize, y as usize))
        }
    }

    pub fn get(&self, x: usize, y: usize) -> &T {
        &self.map[y][x]
    }

    pub fn set(&mut self, x: usize, y: usize, v: T) {
        self.map[y][x] = v;
    }

    pub fn neighbours8(&self, x: usize, y: usize) -> Vec<&T> {
        let mut res = Vec::new();
        let x = x as isize;
        let y = y as isize;

        for dx in -1..=1 {
            for dy in -1..=1 {
                if dx != 0 || dy != 0 {
                    if let Some(v) = self.at(x + dx, y + dy) {
                        res.push(v);
                    }
                }
            }
        }

        res
    }

    pub fn flood_fill4(&mut self, x: usize, y: usize, filler: &dyn Fn(&T) -> Option<T>) -> usize {
        match filler(self.get(x, y)) {
            None => return 0,
            Some(v) => self.set(x, y, v),
        }

        let mut fill_count = 1;

        fill_count += if x > 0 { self.flood_fill4(x - 1, y, &filler) } else { 0 };
        fill_count += if x < self.width - 1 { self.flood_fill4(x + 1, y, &filler) } else { 0 };
        fill_count += if y > 0 { self.flood_fill4(x, y - 1, &filler) } else { 0 };
        fill_count += if y < self.height - 1 { self.flood_fill4(x, y + 1, &filler) } else { 0 };

        fill_count
    }

    pub fn neighbours4(&self, x: usize, y: usize) -> Vec<&T> {
        let mut res = Vec::new();
        let x = x as isize;
        let y = y as isize;

        if let Some(v) = self.at(x - 1, y) { res.push(v); }
        if let Some(v) = self.at(x + 1, y) { res.push(v); }
        if let Some(v) = self.at(x, y - 1) { res.push(v); }
        if let Some(v) = self.at(x, y + 1) { res.push(v); }

        res
    }

    pub fn dump(&self, mapper: fn(&T) -> String) {
        for y in 0..self.height {
            for x in 0..self.width {
                print!("{}", mapper(self.get(x, y)));
            }
            println!();
        }
    }
}
