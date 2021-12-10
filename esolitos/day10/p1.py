from os import path
import numpy as np
import sys
from enum import Enum

# --- Day 10: Syntax Scoring ---
# 
# You ask the submarine to determine the best route out of the deep-sea cave, but it only replies:
# 
# Syntax error in navigation subsystem on line: all of them
# 
# All of them?! The damage is worse than you thought. You bring up a copy of the navigation subsystem (your puzzle input).
# 
# The navigation subsystem syntax is made of several lines containing chunks. There are one or more chunks on each line, and chunks contain zero or more other chunks. Adjacent chunks are not separated by any delimiter; if one chunk stops, the next chunk (if any) can immediately start. Every chunk must open and close with one of four legal pairs of matching characters:
# 
#     If a chunk opens with (, it must close with ).
#     If a chunk opens with [, it must close with ].
#     If a chunk opens with {, it must close with }.
#     If a chunk opens with <, it must close with >.
# 
# So, () is a legal chunk that contains no other chunks, as is []. More complex but valid chunks include ([]), {()()()}, <([{}])>, [<>({}){}[([])<>]], and even (((((((((()))))))))).
# 
# Some lines are incomplete, but others are corrupted. Find and discard the corrupted lines first.
# 
# A corrupted line is one where a chunk closes with the wrong character - that is, where the characters it opens and closes with do not form one of the four legal pairs listed above.
# 
# Examples of corrupted chunks include (], {()()()>, (((()))}, and <([]){()}[{}]). Such a chunk can appear anywhere within a line, and its presence causes the whole line to be considered corrupted.
# 
# For example, consider the following navigation subsystem:
# 
# [({(<(())[]>[[{[]{<()<>>
# [(()[<>])]({[<{<<[]>>(
# {([(<{}[<>[]}>{[]{[(<()>
# (((({<>}<{<{<>}{[]{[]{}
# [[<[([]))<([[{}[[()]]]
# [{[{({}]{}}([{[{{{}}([]
# {<[[]]>}<{[{[{[]{()[[[]
# [<(<(<(<{}))><([]([]()
# <{([([[(<>()){}]>(<<{{
# <{([{{}}[<[[[<>{}]]]>[]]
# 
# Some of the lines aren't corrupted, just incomplete; you can ignore these lines for now. The remaining five lines are corrupted:
# 
#     {([(<{}[<>[]}>{[]{[(<()> - Expected ], but found } instead.
#     [[<[([]))<([[{}[[()]]] - Expected ], but found ) instead.
#     [{[{({}]{}}([{[{{{}}([] - Expected ), but found ] instead.
#     [<(<(<(<{}))><([]([]() - Expected >, but found ) instead.
#     <{([([[(<>()){}]>(<<{{ - Expected ], but found > instead.
# 
# Stop at the first incorrect closing character on each corrupted line.
# 
# Did you know that syntax checkers actually have contests to see who can get the high score for syntax errors in a file? It's true! To calculate the syntax error score for a line, take the first illegal character on the line and look it up in the following table:
# 
#     ): 3 points.
#     ]: 57 points.
#     }: 1197 points.
#     >: 25137 points.
# 
# In the above example, an illegal ) was found twice (2*3 = 6 points), an illegal ] was found once (57 points), an illegal } was found once (1197 points), and an illegal > was found once (25137 points). So, the total syntax error score for this file is 6+57+1197+25137 = 26397 points!
# 
# Find the first illegal character in each corrupted line of the navigation subsystem. What is the total syntax error score for those errors?
# 
def main():
  fname = path.basename(path.dirname(__file__))
  fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  # fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  with open(dataFile, "r") as f:
    data = [x.strip() for x in f.readlines()]
  
  tot = 0
  corrupted = []
  for line in data:
    line_list = list(line)
    state, illegal_char = validate_line(line_list)
    if state == LineStatus.corrupted:
      score = calc_score(illegal_char)
      tot += score
      corrupted.append((line, illegal_char, score))
  
  print(corrupted)
  print(tot)

class LineStatus(Enum):
  valid = 0
  incomplete = 1
  corrupted = 2
  
def validate_line(row: list, open_seq: list = None):
  """
  @return tuple(LineStatus, str or None)
  """
  if open_seq is None:
    row.reverse()
    open_seq = []
  
  if len(row) == 0:
    return (LineStatus.valid, None) if len(open_seq) == 0 else (LineStatus.incomplete, None)
  
  next_char = row.pop()
  if next_char in ['(', '[', '{', '<']:
    open_seq.append(next_char)
    return validate_line(row, open_seq)
  elif len(open_seq) and next_char == get_closing(open_seq.pop()):
    return validate_line(row, open_seq)
  
  return (LineStatus.corrupted, next_char)

def get_closing(char: str) -> str:
  if char == '(':
    return ')'
  if char == '[':
    return ']'
  if char == '{':
    return '}'
  if char == '<':
    return '>'
  
  raise RuntimeError(f"Invalid character {char}")

def calc_score(c: str) -> int:
  if c == ')':
    return 3
  elif c == ']':
    return 57
  elif c == '}':
    return 1197
  elif c == '>':
    return 25137

  raise RuntimeError(f'Invalid char: {c}')

if __name__ == "__main__":
  main()