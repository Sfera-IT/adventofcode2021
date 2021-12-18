import itertools
import pathlib
from typing import List


def read_inputs(input_file: str) -> List[str]:
    with pathlib.Path(input_file).open() as fp:
        lines = fp.readlines()
    return [x for x in lines]


def convert_to_depth_list(value_string: str) -> List[List[int]]:
    entries: List[List[int, int]] = []
    open_bracket_count = 0
    num_str = ""
    for index, value in enumerate(value_string):
        if num_str and not value.isnumeric():
            entries.append([int(num_str), open_bracket_count])
            num_str = ""

        if value == "[":
            open_bracket_count += 1
        elif value == "]":
            open_bracket_count -= 1
        elif value.isnumeric():
            num_str += value

    return entries


def add_math_rows(math_rows: List[str]) -> List[List[int]]:
    prior_addition_depth_list: List[List[int]] = []

    for math_row in math_rows:
        depth_list = convert_to_depth_list(math_row)

        if prior_addition_depth_list:
            depth_list = [
                [value, depth + 1]
                for value, depth in prior_addition_depth_list + depth_list
            ]

        keep_iterating = True
        while keep_iterating:
            keep_iterating = False

            for index, (value, depth) in enumerate(depth_list):
                if keep_iterating:
                    break

                if 5 <= depth == depth_list[index + 1][1]:
                    if index - 1 >= 0:
                        depth_list[index - 1][0] += depth_list[index][0]
                    if index + 2 < len(depth_list):
                        depth_list[index + 2][0] += depth_list[index + 1][0]

                    depth_list[index + 1][0] = 0
                    depth_list[index + 1][1] -= 1

                    del depth_list[index]
                    keep_iterating = True

            for index, (value, depth) in enumerate(depth_list):
                if keep_iterating:
                    break

                if value >= 10:
                    del depth_list[index]
                    depth_list.insert(index, [(value + 1) // 2, depth + 1])
                    depth_list.insert(index, [value // 2, depth + 1])
                    keep_iterating = True

        prior_addition_depth_list = depth_list

    return prior_addition_depth_list


def calculate_magnitude(reduced_form: List[List[int]]) -> int:
    while len(reduced_form) > 1:
        deepest_found = -1
        deep_index = -1

        for index, (value, depth) in enumerate(reduced_form):
            if depth > deepest_found:
                deepest_found = depth
                deep_index = index

        max_depth_found = reduced_form[deep_index][1]

        total = 3 * reduced_form[deep_index][0] + 2 * reduced_form[deep_index + 1][0]
        del reduced_form[deep_index + 1]
        del reduced_form[deep_index]
        reduced_form.insert(deep_index, [total, max_depth_found - 1])

    return reduced_form[0][0]

def part1(lines) -> int:
    foo = add_math_rows(lines)
    return calculate_magnitude(foo)


def part2(lines) -> int:
    all_permutations = list(itertools.permutations(lines, 2))
    return max(
        calculate_magnitude(add_math_rows(list(perm))) for perm in all_permutations
    )

def main() -> None:
    lines = read_inputs("18.txt")
    print(part1(lines))
    print(part2(lines))


if __name__ == "__main__":
    main()