#![allow(unused_imports)]
use std::iter::Iterator;
use std::collections::{HashMap, HashSet, VecDeque, BTreeSet, BTreeMap};
use regex::Regex;
use lazy_static::lazy_static;
use std::ops::RangeInclusive;
use crate::utils;
use std::rc::Rc;
use std::cell::RefCell;
use std::hash::{Hash, Hasher};

#[derive(Copy, Clone, PartialEq)]
enum CaveKind {
    Start,
    Small,
    Big,
    End,
}

#[derive(Clone)]
struct Cave(Rc<RefCell<CaveStr>>);

struct CaveStr {
    name: String,
    kind: CaveKind,
    conns: Vec<Cave>,
}

impl Cave {
    fn new(n: &str) -> Self {
        Cave(Rc::new(RefCell::new(CaveStr {
            name: String::from(n),
            kind: Cave::kind_from_name(n),
            conns: Vec::new(),
        })))
    }

    fn kind_from_name(n: &str) -> CaveKind {
        if n == "start" { CaveKind::Start }
        else if n == "end" { CaveKind::End }
        else if n.chars().next().unwrap().is_ascii_uppercase() { CaveKind::Big }
        else { CaveKind::Small }
    }

    fn name(&self) -> String { self.0.borrow().name.clone() }
    fn kind(&self) -> CaveKind { self.0.borrow().kind }
    fn conns(&self) -> Vec<Cave> { self.0.borrow().conns.clone() }
    fn add_conn(&self, cave: &Cave) { self.0.borrow_mut().conns.push(cave.clone()); }
}

impl PartialEq for Cave {
    fn eq(&self, other: &Self) -> bool {
        self.name() == other.name()
    }
}

impl Eq for Cave {}

impl Hash for Cave {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name().hash(state);
    }
}

fn count_paths(cave: &Cave, visited_small: &mut HashSet<String>, tolerated: bool) -> u64 {
    if cave.kind() == CaveKind::End {
        return 1;
    }

    let mut tolerating_this = false;

    if cave.kind() == CaveKind::Small {
        if visited_small.contains(&cave.name()) {
            if tolerated {
                return 0;
            } else {
                tolerating_this = true;
            }
        } else {
            visited_small.insert(cave.name());
        }
    }

    let count = cave.conns().iter()
        .filter(|c| c.kind() != CaveKind::Start)
        .map(|c| count_paths(c, visited_small, tolerated || tolerating_this)).sum();

    if cave.kind() == CaveKind::Small && !tolerating_this {
        visited_small.remove(&cave.name());
    }

    count
}

fn run(with_tolerance: bool) {
    let connections = utils::parse_lines("../data/day12.txt", |s| {
        let s = s.split('-').map(|s| s.to_string()).collect::<Vec<String>>();
        Some((s[0].clone(), s[1].clone()))
    });

    let mut caves = connections.iter()
        .flat_map(|(from, to)| [(from.to_string(), Cave::new(&*from)), (to.to_string(), Cave::new(&*to))])
        .collect::<HashMap<String, Cave>>();


    for conn in connections.iter() {
        {
            let to = caves.get(&conn.1).unwrap().clone();
            let from = caves.get_mut(&conn.0).unwrap();

            from.add_conn(&to);
        }
        {
            let to = caves.get(&conn.0).unwrap().clone();
            let from = caves.get_mut(&conn.1).unwrap();

            from.add_conn(&to);
        }
    }

    let start = caves.get("start").unwrap().clone();

    let paths = count_paths(&start, &mut HashSet::<String>::new(), !with_tolerance);

    println!("Paths: {}", paths);
}

pub fn test1() {
    run(false);
}

pub fn test2() {
    run(true);
}
