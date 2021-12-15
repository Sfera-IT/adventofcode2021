from typing import Callable

def read_file(file_name: str, line_cb: Callable = None, line_filter_cb: Callable = None, post_cb_line_filter: Callable = None) -> list:
    with open(f'{file_name}.txt') as file:
        lines = file.readlines()
        lines = [line_cb(line.rstrip()) if line_cb else line.rstrip() for line in lines if not line_filter_cb or line_filter_cb(line.rsplit())]
        if post_cb_line_filter:
            lines = list(filter(post_cb_line_filter, lines))
    return lines

def part_a_b(brd_scale: int) -> int:
    lines = read_file('15', line_cb=lambda x: tuple(map(int, x)))

    cost = {(0, 0): 0}
    seen = {(0, 0)}

    while cost:
        x, y = min(cost, key=cost.get)
        curr_cost = cost.pop((x, y))

        if x == (brd_scale * len(lines[0])) - 1 and y == (brd_scale * len(lines)) - 1:
            return curr_cost

        for dx, dy in ((1, 0), (0, 1), (-1, 0), (0, -1)):
            _x, _y = x + dx, y + dy
            if _x >= 0 and _x < brd_scale * len(lines[0]) and _y >= 0 and _y < brd_scale * len(lines):
                neighbour_cost = curr_cost + ((lines[_y % len(lines)][_x % len(lines[0])] + (_y // len(lines)) + (_x // len(lines[0])) - 1) % 9) + 1 

                if (_x, _y) not in seen:
                    seen.add((_x, _y))
                    cost[(_x, _y)] = neighbour_cost

if __name__ == '__main__':
    print(part_a_b(1))
    print(part_a_b(5))