from os import path
from collections import deque

from numpy import void


def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day6.txt")
    with open(dataFile, "r") as f:
        data = [int(x) for x in f.readline().split(',')]

    # Populate fish spawn status
    days = {}
    for day in data:
      days[day] = 1 if day not in days else days[day] + 1

    # Fish will spwan again on this date
    next_spawn_on = 7
    for current_day in range(80):
      if current_day in days:
        todays_fish_count = days.pop(current_day)
        spawn_fish(days, next_spawn_on, todays_fish_count)

        # Newly spawaned fish needs 2 extra days
        spawn_fish(days, next_spawn_on + 2, todays_fish_count)
      
      next_spawn_on += 1
      print(f"Fish after {current_day+1} days: {sum(list(days.values()))}")

    print(f"Fish at the end: {sum(days.values())}")
      

def spawn_fish(days: dict, spawn_day: int, spawn_count: int) -> void:
  if spawn_day not in days:
    days[spawn_day] = spawn_count
  else:
    days[spawn_day] += spawn_count
    

if __name__ == "__main__":
  main()