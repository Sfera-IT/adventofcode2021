use std::iter::Iterator;
use std::collections::VecDeque;
use std::fmt;
use crate::utils;
use std::ops::Add;


#[allow(unused_macros)]
macro_rules! snail {
    ($e1:expr,$e2:expr) => {
        format!("[{},{}]", stringify!($e1), stringify!($e2)).parse::<SnailFish>().unwrap()
    };
    ($e1:expr) => {
        stringify!($e1).parse::<SnailFish>().unwrap()
    };
}

enum ReductionResult {
    None,
    Reduced,
    Propagate(Option<u32>, Option<u32>),
}


#[derive(Clone, PartialEq)]
enum SnailFish {
    Regular(u32),
    Composite(Box<SnailFish>, Box<SnailFish>),
}

impl SnailFish {
    pub fn new() -> Self {
        Self::Regular(0)
    }

    pub fn magnitude(&self) -> u32 {
        match self {
            Self::Regular(v) => *v,
            Self::Composite(l, r) => 3 * l.magnitude() + 2 * r.magnitude(),
        }
    }

    fn add_to_leftmost(&mut self, val: u32) {
        match self {
            Self::Regular(v) => *self = Self::Regular(*v + val),
            Self::Composite(l, _) => l.add_to_leftmost(val),
        }
    }

    fn add_to_rightmost(&mut self, val: u32) {
        match self {
            Self::Regular(v) => *self = Self::Regular(*v + val),
            Self::Composite(_, r) => r.add_to_rightmost(val),
        }
    }

    fn reduce_split(&mut self) -> ReductionResult {
        match self {
            Self::Regular(v) if *v >= 10 => {
                let d = *v >> 1;
                let r = *v & 1;
                *self = Self::Composite(Box::new(Self::Regular(d)), Box::new(Self::Regular(d + r)));
                ReductionResult::Reduced
            },
            Self::Regular(_) => ReductionResult::None,
            Self::Composite(l, r) => {
                match l.reduce_split() {
                    ReductionResult::None => (),
                    r => return r,
                }
                r.reduce_split()
            },
        }
    }

    fn reduce_explode(&mut self, depth: u32) -> ReductionResult {
        let (l, r) = match self {
            Self::Regular(_) => return ReductionResult::None,
            Self::Composite(l, r) => (l, r),
        };

        match l.reduce_explode(depth + 1) {
            ReductionResult::None => (),
            ReductionResult::Reduced => return ReductionResult::Reduced,
            ReductionResult::Propagate(vleft, vright) => {
                let vright = match vright {
                    None => None,
                    Some(vr) => { r.add_to_leftmost(vr); None },
                };
                return ReductionResult::Propagate(vleft, vright);
            }
        }

        if depth >= 4 {
            if let (Self::Regular(vl), Self::Regular(vr)) = (&**l, &**r) {
                let (vl, vr) = (*vl, *vr);
                *self = Self::Regular(0);
                return ReductionResult::Propagate(Some(vl), Some(vr));
            }
        }

        match r.reduce_explode(depth + 1) {
            ReductionResult::None => ReductionResult::None,
            ReductionResult::Reduced => ReductionResult::Reduced,
            ReductionResult::Propagate(vleft, vright) => {
                let vleft = match vleft {
                    None => None,
                    Some(vr) => { l.add_to_rightmost(vr); None },
                };
                ReductionResult::Propagate(vleft, vright)
            }
        }
    }

    fn reduce(mut self) -> Self {
        loop {
            match self.reduce_explode(0) {
                ReductionResult::None => (),
                _ => continue,
            }
            match self.reduce_split() {
                ReductionResult::None => break,
                _ => continue,
            }
        }
        self
    }

    fn expect_char(exp: u8, stream: &mut VecDeque<u8>) -> Result<(), SnailFishParseError> {
        match stream.pop_front() {
            Some(c) if c == exp => Ok(()),
            Some(c) => Err(SnailFishParseError(format!("unexpected char: '{}'", c as char))),
            None => Err(SnailFishParseError("unexpected end of string".to_string())),
        }
    }

    fn deserialize(stream: &mut VecDeque<u8>) -> Result<Self, SnailFishParseError> {
        stream.retain(|c| !char::is_whitespace(*c as char));

        match stream.pop_front() {
            Some(b'[') => {
                let left = Self::deserialize(stream)?;
                Self::expect_char(b',', stream)?;
                let right = Self::deserialize(stream)?;
                Self::expect_char(b']', stream)?;
                Ok(Self::Composite(Box::new(left), Box::new(right)))
            },
            Some(c) if char::is_digit(c as char, 10) => {
                Ok(Self::Regular((c - b'0') as u32))
            },
            Some(c) => Err(SnailFishParseError(format!("unexpected char: '{}'", c as char))),
            None => Err(SnailFishParseError("unexpected end of string".to_string())),
        }
    }
}

impl fmt::Display for SnailFish {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Regular(v) => write!(f, "{}", v),
            Self::Composite(l, r) => write!(f, "[{},{}]", l, r),
        }
    }
}

impl fmt::Debug for SnailFish {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self)
    }
}

impl Add for SnailFish {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        SnailFish::Composite(Box::new(self), Box::new(other)).reduce()
    }
}

impl Add for &SnailFish {
    type Output = SnailFish;

    fn add(self, other: Self) -> SnailFish {
        SnailFish::Composite(Box::new(self.clone()), Box::new(other.clone())).reduce()
    }
}


impl<'a> std::iter::Sum<&'a Self> for SnailFish {
    fn sum<I>(mut iter: I) -> Self
    where
        I: Iterator<Item = &'a Self>,
    {
        match iter.next() {
            None => SnailFish::new(),
            Some(s) => iter.fold(s.clone(), |a, b| &a + b),
        }
    }
}

impl std::str::FromStr for SnailFish {
    type Err = SnailFishParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::deserialize(&mut s.as_bytes().iter().copied().collect::<VecDeque<u8>>())
    }
}

#[derive(Clone, Debug)]
struct SnailFishParseError(String);
impl From<std::num::ParseIntError> for SnailFishParseError {
    fn from(e: std::num::ParseIntError) -> Self {
        Self(format!("{}", e))
    }
}


pub fn test1() {
    let data = utils::parse_lines("../data/day18.txt", |s| s.parse::<SnailFish>().ok());

    let total_fish = data.iter().sum::<SnailFish>();

    println!("magn: {}", total_fish.magnitude());
}

pub fn test2() {
    let data = utils::parse_lines("../data/day18.txt", |s| s.parse::<SnailFish>().ok());
    let mut mags = Vec::new();

    for a in data.iter() {
        for b in data.iter().filter(|bb| bb != &a) {
            mags.push((a + b).magnitude());
            mags.push((b + a).magnitude());
        }
    }

    println!("max: {}", mags.iter().max().unwrap());
}



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn day18_test_deserialize()
    {
        assert_eq!(
            "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
            format!("{}", snail![[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]])
        );
    }

    #[test]
    fn day18_test_sum1()
    {
        let snails = vec![
            snail![1,1],
            snail![2,2],
            snail![3,3],
            snail![4,4],
        ];

        assert_eq!(snail![[[[1,1],[2,2]],[3,3]],[4,4]], snails.iter().sum());
    }

    #[test]
    fn day18_test_sum2()
    {
        let snails = vec![
            snail![1,1],
            snail![2,2],
            snail![3,3],
            snail![4,4],
            snail![5,5],
        ];

        assert_eq!(snail![[[[3,0],[5,3]],[4,4]],[5,5]], snails.iter().sum());
    }

    #[test]
    fn day18_test_sum3()
    {
        let snails = vec![
            snail![1,1],
            snail![2,2],
            snail![3,3],
            snail![4,4],
            snail![5,5],
            snail![6,6],
        ];

        assert_eq!(snail![[[[5,0],[7,4]],[5,5]],[6,6]], snails.iter().sum());
    }

    #[test]
    fn day18_test_sum4()
    {
        let snails = vec![
            snail![[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
            snail![7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
            snail![[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
            snail![[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
            snail![7,[5,[[3,8],[1,4]]]],
            snail![[2,[2,2]],[8,[8,1]]],
            snail![2,9],
            snail![1,[[[9,3],9],[[9,0],[0,7]]]],
            snail![[[5,[7,4]],7],1],
            snail![[[[4,2],2],6],[8,7]],
        ];

        assert_eq!(snail![[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]], snails.iter().sum());
    }

    #[test]
    fn day18_test_sum_step_1() {
        let s1 = snail![[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]];
        let s2 = snail![7,[[[3,7],[4,3]],[[6,3],[8,8]]]];
        assert_eq!(s1 + s2, snail![[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]);
    }

    #[test]
    fn day18_test_sum_step_2() {
        let s1 = snail![[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]];
        let s2 = snail![[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]];
        assert_eq!(s1 + s2, snail![[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]);
    }

    #[test]
    fn day18_test_sum_step_3() {
        let s1 = snail![[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]];
        let s2 = snail![[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]];
        assert_eq!(s1 + s2, snail![[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]);
    }

    #[test]
    fn day18_test_sum_step_4() {
        let s1 = snail![[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]];
        let s2 = snail![7,[5,[[3,8],[1,4]]]];
        assert_eq!(s1 + s2, snail![[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]);
    }

    #[test]
    fn day18_test_sum_step_5() {
        let s1 = snail![[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]];
        let s2 = snail![[2,[2,2]],[8,[8,1]]];
        assert_eq!(s1 + s2, snail![[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]);
    }

    #[test]
    fn day18_test_sum_step_6() {
        let s1 = snail![[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]];
        let s2 = snail![2,9];
        assert_eq!(s1 + s2, snail![[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]);
    }

    #[test]
    fn day18_test_sum_step_7() {
        let s1 = snail![[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]];
        let s2 = snail![1,[[[9,3],9],[[9,0],[0,7]]]];
        assert_eq!(s1 + s2, snail![[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]);
    }

    #[test]
    fn day18_test_sum_step_8() {
        let s1 = snail![[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]];
        let s2 = snail![[[5,[7,4]],7],1];
        assert_eq!(s1 + s2, snail![[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]);
    }

    #[test]
    fn day18_test_sum_step_9() {
        let s1 = snail![[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]];
        let s2 = snail![[[[4,2],2],6],[8,7]];
        assert_eq!(s1 + s2, snail![[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]);
    }
}
