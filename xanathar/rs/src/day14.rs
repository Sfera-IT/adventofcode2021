use std::iter::Iterator;
use std::fmt;
use crate::utils;
use std::rc::Rc;

const MAX_ITERATIONS: usize = 100;


#[derive(Copy, Clone, PartialEq, Default)]
struct Atom(u8);

impl Atom {
    pub const MAX: usize = 26;
    pub const MAX_PAIRS: usize = Self::MAX * Self::MAX;

    pub fn new(v: u8) -> Self {
        let a = v - b'A';
        if (a as usize) >= Self::MAX {
            panic!("Invalid value to atom: {}", v);
        }

        Self(a)
    }

    pub fn from_val(a: u8) -> Self {
        if (a as usize) >= Self::MAX {
            panic!("Invalid value to atom: {}", a);
        }

        Self(a)
    }

    pub fn val(self) -> usize {
        self.0 as usize
    }

    pub fn pair_index(a1: Atom, a2: Atom) -> usize {
        (a1.val() * Atom::MAX) + a2.val()
    }
}

impl fmt::Debug for Atom {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", (self.0 + b'A') as char)
    }
}


struct PolymerRules {
    table: [Option<Atom>; Atom::MAX_PAIRS],
}

impl PolymerRules {
    pub fn new() -> Self {
        Self {
            table: [None; Atom::MAX_PAIRS],
        }
    }

    pub fn add_rule(&mut self, from1: Atom, from2: Atom, to: Atom) {
        if self.get(from1, from2).is_some() {
            panic!("Duplicate rule");
        }
        self.table[Atom::pair_index(from1, from2)] = Some(to);
    }

    pub fn get(&self, from1: Atom, from2: Atom) -> Option<Atom> {
        self.table[Atom::pair_index(from1, from2)]
    }
}


#[derive(Clone)]
struct PolymerResult(Rc<[u128; Atom::MAX]>);

impl PolymerResult {
    pub fn new(a1: Atom, a2: Atom) -> Self {
        let mut arr = [0u128; Atom::MAX];
        arr[a1.val()] += 1;
        arr[a2.val()] += 1;
        Self(Rc::new(arr))
    }

    pub fn combine(excess: Atom, r1: &Self, r2: &Self) -> Self {
        let mut arr = [0u128; Atom::MAX];
        #[allow(clippy::needless_range_loop)]
        for i in 0..Atom::MAX {
            arr[i] = r1.0[i] + r2.0[i];
        }
        arr[excess.val()] -= 1;
        Self(Rc::new(arr))
    }

    pub fn min(&self) -> u128 {
        self.0.iter().filter(|v| **v != 0).copied().min().unwrap()
    }

    pub fn max(&self) -> u128 {
        self.0.iter().filter(|v| **v != 0).copied().max().unwrap()
    }
}

impl fmt::Debug for PolymerResult {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut v = f.debug_struct("PolymerResult");
        for i in 0..Atom::MAX {
            if self.0[i] != 0 {
                v.field(&format!("{:?}", Atom::from_val(i as u8)), &self.0[i]);
            }
        }
        v.finish()
    }
}


struct BimerCache(Box<[Option<PolymerResult>]>);

impl BimerCache {
    pub fn new() -> Self {
        Self(vec![None; Atom::MAX_PAIRS * MAX_ITERATIONS].into_boxed_slice())
    }

    fn index(iter: usize, a1: Atom, a2: Atom) -> usize {
        iter * Atom::MAX_PAIRS + Atom::pair_index(a1, a2)
    }

    pub fn zero_entry(&mut self, a1: Atom, a2: Atom) -> PolymerResult {
        match self.get(a1, a2, 0) {
            Some(r) => r,
            None => self.set(a1, a2, 0, PolymerResult::new(a1, a2)),
        }
    }

    pub fn get(&self, a1: Atom, a2: Atom, iteration: usize) -> Option<PolymerResult> {
        let index = Self::index(iteration, a1, a2);
        self.0[index].as_ref().cloned()
    }

    pub fn set(&mut self, a1: Atom, a2: Atom, iteration: usize, result: PolymerResult) -> PolymerResult {
        let index = Self::index(iteration, a1, a2);
        self.0[index] = Some(result.clone());
        result
    }
}


fn polymerize_bruteforce(v: &[Atom], rules: &PolymerRules) -> Vec<Atom> {
    let mut res = vec![v[0]];

    for i in 1..v.len() {
        res.push(rules.get(v[i - 1], v[i]).unwrap_or_else(||
            panic!("Missing rule! [{:?}{:?}]", v[i - 1], v[i])
        ));
        res.push(v[i]);
    }

    res
}

fn count_min_max(polymer: &[Atom]) -> (usize, usize) {
    let mut counts = [0usize; Atom::MAX];

    for v in polymer.iter() {
        counts[v.val()] += 1;
    }

    (
        counts.iter().copied().filter(|v| *v != 0).min().unwrap(),
        counts.iter().copied().filter(|v| *v != 0).max().unwrap(),
    )
}


fn load_data() -> (Vec<Atom>, PolymerRules) {
    let lines = utils::read_lines("../data/day14.txt").collect::<Vec<String>>();

    let template = lines[0].as_bytes().iter().map(|b| Atom::new(*b)).collect();
    let mut rules = PolymerRules::new();

    for l in lines.iter().skip(1) {
        let line_bytes = l.as_bytes();
        rules.add_rule(Atom::new(line_bytes[0]), Atom::new(line_bytes[1]), Atom::new(line_bytes[6]));
    }

    (template, rules)
}

fn calc_bimer(a1: Atom, a2: Atom, iteration: usize, cache: &mut BimerCache, rules: &PolymerRules) -> PolymerResult {
    if iteration == 0 {
        return cache.zero_entry(a1, a2);
    }

    if let Some(r) = cache.get(a1, a2, iteration) {
        return r;
    }

    let amid = rules.get(a1, a2).unwrap();

    let bimer1 = calc_bimer(a1, amid, iteration - 1, cache, rules);
    let bimer2 = calc_bimer(amid, a2, iteration - 1, cache, rules);

    cache.set(a1, a2, iteration, PolymerResult::combine(amid, &bimer1, &bimer2))
}


pub fn test1() {
    let (mut polymer, rules) = load_data();

    for _ in 1..=10{
        polymer = polymerize_bruteforce(&polymer, &rules);
    }

    let (min, max) = count_min_max(&polymer);
    println!("max={}, min={}, len={}, diff={}", max, min, polymer.len(), max - min);
}


pub fn test2() {
    let (polymer, rules) = load_data();

    let mut cache = BimerCache::new();
    let mut bimer_result: Option<PolymerResult> = None;

    for i in 1..polymer.len() {
        let res = calc_bimer(polymer[i - 1], polymer[i], 40, &mut cache, &rules);
        bimer_result = match bimer_result {
            None => Some(res),
            Some(br) => {
                Some(PolymerResult::combine(polymer[i - 1], &br, &res))
            }
        }
    }

    let result = bimer_result.unwrap();
    let (min, max) = (result.min(), result.max());

    println!("max={}, min={}, diff={}", max, min, max - min);
}
