import matplotlib.pyplot as plt
import networkx as nx

def main(input_file) -> None:
    """
    Simply play with networkx library
    """
    with open(input_file) as file:
        lines = file.readlines()

    # Ok we can draw with networkx it is not special but we can do something.
    graph = nx.Graph()

    line_len = len(lines[0]) - 1 # -1 because of \n
    for i in range(len(lines) * 5):

        for j in range(line_len * 5):
            line = lines[i % len(lines)]
            char = line[j % line_len]
            muli = i // len(lines)
            mulj = j // line_len
            risk = (ord(char) - 48 + muli + mulj)
            if risk > 9:
                risk = risk - 9

            graph.add_node(f'{i}_{j}', nodeRisk=risk)
            if j > 0:
                graph.add_edge(f'{i}_{j}', f'{i}_{j-1}', risk=graph.nodes[f'{i}_{j-1}']['nodeRisk'])  # previous node.
            if i > 0:
                graph.add_edge(f'{i}_{j}', f'{i - 1}_{j}', risk=graph.nodes[f'{i-1}_{j}']['nodeRisk'])  # top node.

    # Now we can simply use networkx
    last_node = f'{len(lines) * 5 - 1}_{line_len * 5 - 1}'
    print (f'Last Node = {last_node}')
    dijkstra_path = nx.dijkstra_path(graph, '0_0', last_node, weight= lambda u, v, d: graph.nodes[v]['nodeRisk'])

    print(dijkstra_path)
    weight = 0
    print (f'Neighbors of 2_3 = {[n for n in graph.neighbors("2_3")]}')
    print(f'Neighbors risk of 2_3 = {[graph.nodes[n]["nodeRisk"] for n in graph.neighbors("2_3")]}')
    for node in dijkstra_path:
        weight += graph.nodes[node]['nodeRisk']
        # print(graph.nodes[node]['risk'])
    print (f'Total risk is {weight}')


if __name__ == "__main__":
    main("realinput.txt")  # or call with input.txt to verify with test data.

