use std::iter::Iterator;
use std::collections::VecDeque;
use crate::utils;

enum Error {
    Corrupted(u64),
    Incomplete(Vec<u64>),
}

#[derive(Copy, Clone, PartialEq)]
enum Delimiter {
    Round,
    Square,
    Curly,
    Angular,
}

impl Delimiter {
    fn error_score(&self) -> u64 {
        match self {
            Delimiter::Round => 3,
            Delimiter::Square => 57,
            Delimiter::Curly => 1197,
            Delimiter::Angular => 25137,
        }
    }

    fn autocomplete_score(&self) -> u64 {
        match self {
            Delimiter::Round => 1,
            Delimiter::Square => 2,
            Delimiter::Curly => 3,
            Delimiter::Angular => 4,
        }
    }
}

enum Token {
    Open(Delimiter),
    Close(Delimiter),
}

impl Token {
    fn parse(c: char) -> Self {
        match c {
            '(' => Token::Open(Delimiter::Round),
            '[' => Token::Open(Delimiter::Square),
            '{' => Token::Open(Delimiter::Curly),
            '<' => Token::Open(Delimiter::Angular),
            ')' => Token::Close(Delimiter::Round),
            ']' => Token::Close(Delimiter::Square),
            '}' => Token::Close(Delimiter::Curly),
            '>' => Token::Close(Delimiter::Angular),
            _ => panic!("unexpected token {}", c),
        }
    }
}


fn parse_chunk(queue: &mut VecDeque<char>) -> Result<(), Error> {
    let c = match queue.pop_front() {
        Some(c) => c,
        None => panic!("Empty chunk!"),
    };

    let delim = match Token::parse(c) {
        Token::Open(d) => d,
        Token::Close(d) => return Err(Error::Corrupted(d.error_score())),
    };

    loop {
        let c = match queue.front() {
            Some(c) => c,
            None => return Err(Error::Incomplete(vec![delim.autocomplete_score()])),
        };

        match Token::parse(*c) {
            Token::Open(_) => match parse_chunk(queue) {
                Ok(()) => (),
                Err(Error::Corrupted(score)) => return Err(Error::Corrupted(score)),
                Err(Error::Incomplete(mut v)) => {
                    v.push(delim.autocomplete_score());
                    return Err(Error::Incomplete(v));
                }
            },
            Token::Close(_) => break,
        };
    }

    let c = match queue.pop_front() {
        Some(c) => c,
        None => return Err(Error::Incomplete(vec![delim.autocomplete_score()])),
    };

    match Token::parse(c) {
        Token::Open(_) => panic!("unreachable branch"),
        Token::Close(d) if d == delim => Ok(()),
        Token::Close(d) => Err(Error::Corrupted(d.error_score())),
    }
}

pub fn test1() {
    let lines = utils::read_lines("../data/day10.txt").collect::<Vec<String>>();

    let score: u64 = lines.iter().map(|l| {
        let mut q = l.chars().collect::<VecDeque<char>>();

        match parse_chunk(&mut q) {
            Ok(()) => 0,
            Err(Error::Incomplete(_)) => 0,
            Err(Error::Corrupted(score)) => score,
        }
    }).sum();

    println!("Score: {}", score);
}

pub fn test2() {
    let lines = utils::read_lines("../data/day10.txt").collect::<Vec<String>>();

    let mut scores: Vec<u64> = lines.iter().filter_map(|l| {
        let mut q = l.chars().collect::<VecDeque<char>>();

        match parse_chunk(&mut q) {
            Ok(()) => None,
            Err(Error::Incomplete(values)) => Some(values.iter().fold(0, |score, v| score * 5 + v)),
            Err(Error::Corrupted(_)) => None,
        }
    }).collect();

    scores.sort_unstable();

    let score = scores[scores.len() /2];

    println!("Score: {:?}", score);
}
