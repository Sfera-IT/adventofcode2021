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
    i = 0
    print (len(lines))
    for i in range(len(lines)):
        for j in range(line_len):
            line = lines[i]
            char = line[j]
            risk = ord(char) - 48
            #print(f'{i}_{j} = {char} risk = {risk}')
            graph.add_node(f'{i}_{j}', nodeRisk=risk)

            # now we need to connect nodes, since we are loading
            # nodes one by one, we can bind a node only to previously added nodes
            if j > 0:
                graph.add_edge(f'{i}_{j}', f'{i}_{j-1}', risk=graph.nodes[f'{i}_{j-1}']['nodeRisk'])  # previous node.
            if i > 0:
                graph.add_edge(f'{i}_{j}', f'{i - 1}_{j}', risk=graph.nodes[f'{i-1}_{j}']['nodeRisk'])  # top node.
                # if j > 0:
                #     graph.add_edge(f'{i}_{j}', f'{i - 1}_{j - 1}', risk=graph.nodes[f'{i-1}_{j-1}']['risk'])  # top left node.
                # if j < line_len - 1:
                #     graph.add_edge(f'{i}_{j}', f'{i - 1}_{j + 1}', risk=graph.nodes[f'{i-1}_{j+1}']['risk'])  # top right node.

    last_node = f'{len(lines) - 1}_{line_len - 1}'
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
    # # # We can draw the graph if the number of element is not too big
    # if (len(graph.nodes) < 1000):
    #     # now we can draw the graph
    #     pos = nx.nx_agraph.graphviz_layout(graph)
    #     labels = nx.get_node_attributes(graph, 'height')
    #
    #     nx.draw(
    #         graph,
    #         pos=pos,
    #         node_color="white",
    #         edge_color="grey",
    #         node_size=50,
    #         labels=labels,
    #         with_labels=True)
    #
    #     # or you can print other stuff in a subsequent time :D
    #     # nx.draw_networkx_labels(graph, pos)
    #     plt.savefig("out.png")
    #
    #     G = nx.grid_2d_graph(5, 5)  # 5x5 grid
    #     # This example needs Graphviz and PyGraphviz
    #     nx.nx_agraph.write_dot(G, "grid.dot")
    #     # Having created the dot file, graphviz can be invoked via the command line
    #     # to generate an image on disk, e.g.
    #     print("Now run: neato -Tps grid.dot >grid.ps")
    #
    #     # Alternatively, the and image can be created directly via AGraph.draw
    #     A = nx.nx_agraph.to_agraph(G)
    #     A.draw("5x5.png", prog="neato")

if __name__ == "__main__":
    main("realinput.txt") #or call with input.txt to verify with test data.
