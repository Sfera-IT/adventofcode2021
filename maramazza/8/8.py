def part_one(outputs):
    counter = 0

    for output in outputs:
        for signal in output:
            if len(signal) == 2 or len(signal) == 4 or len(signal) == 3 or len(signal) == 7:
                counter += 1

    return counter


def sort_signal(signal):
    return ''.join(sorted(signal))


def decode(signal):
    decoded_numbers, encoded_numbers = dict(), dict()

    for sig in signal:
        if len(sig) == 2:
            decoded_numbers[1] = sort_signal(sig)
        elif len(sig) == 3:
            decoded_numbers[7] = sort_signal(sig)
        elif len(sig) == 4:
            decoded_numbers[4] = sort_signal(sig)
        elif len(sig) == 7:
            decoded_numbers[8] = sort_signal(sig)
        elif len(sig) == 6:  # candidates for 0, 6 and 9
            encoded_numbers.setdefault(6, []).append(sort_signal(sig))
        else:  # candidates for 2, 3 and 5
            encoded_numbers.setdefault(5, []).append(sort_signal(sig))

    # find 9: 4 is substring of 9
    for number in encoded_numbers.get(6):
        if contains_characters(number, decoded_numbers.get(4)):
            decoded_numbers[9] = ''.join(sorted(number))
            encoded_numbers.get(6).remove(number)

    # find 0 and 6: 1 is substring of one of them
    for number in encoded_numbers.get(6):

        if contains_characters(number, decoded_numbers.get(1)):
            decoded_numbers[0] = sort_signal(number)
        else:
            decoded_numbers[6] = sort_signal(number)

    # find 3: 1 is substring of 3
    for number in encoded_numbers.get(5):

        if contains_characters(number, decoded_numbers.get(1)):
            decoded_numbers[3] = sort_signal(number)
            encoded_numbers.get(5).remove(number)

    # find bottom left
    bottom_left = remove_substring(decoded_numbers.get(8), decoded_numbers.get(9))

    # find 2 and 5: 2 contains bottom left piece
    for number in encoded_numbers.get(5):

        if contains_characters(number, bottom_left):
            decoded_numbers[2] = sort_signal(number)
        else:
            decoded_numbers[5] = sort_signal(number)

    return decoded_numbers


def remove_substring(signal, characters):

    for char in characters:
        signal = signal.replace(char, '')

    return signal


def contains_characters(signal, characters):
    for char in characters:
        if char not in signal:
            return False

    return True


def part_two(signals, outputs):
    sum, value = 0, ""

    for i, signal in enumerate(signals):
        decoded = dict((v, k) for k, v in decode(signal).items())  # invert key, value

        for out in outputs[i]:
            value += str(decoded.get(''.join(sorted(out))))

        sum += int(value)
        value = ""

    return sum


def read_input():
    file = open("8.txt", 'r')
    outputs = []
    signals = []

    for line in file.readlines():
        sig, out = line.strip().split("|")
        sig = [x for x in sig.split(" ") if x]
        out = [x for x in out.split(" ") if x]
        outputs.append(out)
        signals.append(sig)

    return signals, outputs


def main():
    signals, outputs = read_input()
    print("Part 1:", part_one(outputs))
    print("Part 2:", part_two(signals, outputs))


main()