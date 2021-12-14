#PART 1#
Lines = [line.rstrip() for line in open('14.txt')]
template=Lines[0]

pairkeys={}
for line in Lines[2:]:
    pair,ins= line.split(sep=" -> ")
    pairkeys[pair]=ins

#function to check for odd or even
def is_odd(num):
    if (num % 2) == 0 or num==0:
        return False
    else:
        return True

#define function to get all pairs in template
def insertion(template, pairkeys):
    i=0
    result = ''
    for i in range(len(template)-1):
        ij = template[i]+template[i+1]
        ins = pairkeys[ij]

        if is_odd(i)==False:
            result+=ij[0]+ins+ij[1]
        elif is_odd(i)==True:
            if i==len(template)-2: #handles if last
                result+=ins+ij[1]
            else:
                result+=ins

    return(result)

#function to run insertion m times:
def run_it(template, pairkeys, m):
    for n in range(m):
        template = insertion(template, pairkeys)
    return template

output = run_it(template, pairkeys, 10)

from collections import Counter
char_count = Counter(output)

max_key = max(char_count, key=char_count.get)
min_key = min(char_count, key=char_count.get)

print(char_count[max_key]-char_count[min_key]) #part 1 answer

#Part 2 - need to track number of pairs instead of the string
pair_counter = Counter([template[i:i+2] for i in range(len(template) - 1)])

for n in range(40):
    new_count=Counter()
    for pair in pair_counter:
        i,j = pair
        ins = pairkeys[pair]
        new_count[i+ins] += pair_counter[pair]
        new_count[ins+j] += pair_counter[pair]
    pair_counter=new_count

char_count = Counter() #initialize new char counter

for pair in pair_counter:
    i, j = pair
    char_count[i]+=pair_counter[pair] #count left value of each pair

char_count[template[-1]] +=1 #accounts for final character

max_key = max(char_count, key=char_count.get)
min_key = min(char_count, key=char_count.get)

print(char_count[max_key]-char_count[min_key]) #part 2 answer