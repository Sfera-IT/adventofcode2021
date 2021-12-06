from pathlib import Path
from collections import Counter

n_times = 9

def read_input() -> list[int]:
    path = "6.txt"
    text = Path(path).read_text().strip()
    counts = Counter(int(x) for x in text.split(","))
    return [counts[i] for i in range(n_times)]


def increment(counts: list[int]) -> list[int]:
    new_counts = n_times * [0]
    for i in range(1, n_times):
        new_counts[i-1] = counts[i]
    # lanternfish that creates a new fish resets its timer to 6
    new_counts[6] += counts[0]
    # new lanternfish starts with an internal timer of 8
    new_counts[n_times - 1] += counts[0]
    return new_counts


def population_size(days: int) -> int:
    counts = read_input()
    for _ in range(days):
        counts = increment(counts)
    return sum(counts)

print("part 1", population_size(days=80))
print("part 2", population_size(days=256))
