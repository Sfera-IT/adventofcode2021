import re

REBOOT_RE = re.compile(r"x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)")

with open('22.txt') as f:
    input_data = list(map(lambda x: x.replace('\n', ''), f.readlines()))

def parse_range(r):
    m, mx = r[2:].split("..")
    r1 = range(int(m), int(mx)+1)
    return r1

reboot_steps = []

for line in input_data:
    state, rest = line.split()
    x, y, z = rest.split(',')
    reboot_steps.append((state, parse_range(x), parse_range(y), parse_range(z)))

def clip_range(candidate, clip):
    if candidate.stop <= clip.start or candidate.start >= clip.stop:
        return range(0)
    return range(max(candidate.start, clip.start), min(candidate.stop, clip.stop))

def count_uninterrupted(step, rest):
    _, xr, yr, zr = step

    conflicts = []

    for step in rest:
        state, xr2, yr2, zr2 = step

        xr2 = clip_range(xr2, xr)
        yr2 = clip_range(yr2, yr)
        zr2 = clip_range(zr2, zr)

        if len(xr2) == 0 or len(yr2) == 0 or len(zr2) == 0:
            continue

        conflicts.append((state, xr2, yr2, zr2))

    total = len(xr) * len(yr) * len(zr)
    for idx, step in enumerate(conflicts):
        total -= count_uninterrupted(step, conflicts[idx+1:])

    return total

def run_steps(steps):
    total = 0

    for i, step in enumerate(steps):
        if step[0] == 'off':
            continue # only count on lights
        total += count_uninterrupted(step, steps[i+1:])
    return total

def in_range(range, min, max):
    return range.start >= min and range.stop <= max

# Filter between -50 and +50 in x, y, z
def pt_1_filter(step):
    _, x, y, z = step
    return in_range(x, -50, 51) and in_range(y, -50, 51) and in_range(z, -50, 51)

def part_1():
    to_consider = list(filter(pt_1_filter, reboot_steps))
    return run_steps(to_consider)
    

def part_2():
    return run_steps(reboot_steps)

print(f"Part 1: {part_1()}")
print(f"Part 2: {part_2()}")