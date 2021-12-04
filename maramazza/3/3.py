with open("./3.txt") as f:
    data = [l.strip() for l in f.readlines() if l]

gamma = ['1' if bit.count('1') > bit.count('0') else '0' for bit in zip(*data)]
epsilon = ['1' if x == '0' else '0' for x in gamma]

x = int(''.join(gamma), 2)
y = int(''.join(epsilon), 2)
print(x * y)

def most_common(data, index):
    l = [x[index] for x in data]
    if l.count('1') >= l.count('0'):
        return '1'
    return '0'


def least_common(data, index):
    l = [x[index] for x in data]
    if l.count('0') <= l.count('1'):
        return '0'
    return '1'


def filter_by(data, filter_function):
    data = data[:]
    while len(data) > 1:
        for i in range(len(data[0])):
            value = filter_function(data, i)
            data = [x for x in data if x[i] == value]
            if len(data) == 1:
                break
    return int(''.join(data[0]), 2)


oxy = filter_by(data, most_common)
co2 = filter_by(data, least_common)
print(oxy * co2)
