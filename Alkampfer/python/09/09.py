import matplotlib.pyplot as plt
import networkx as nx

def main():
    """
    Simply play with networkx library
    """
    with open("input.txt") as file:
        lines = file.readlines()

    # Ok we can draw with networkx it is not special but we can do something.
    graph = nx.Graph()

    line_len = len(lines[0]) - 1 # -1 because of \n

    print (f'line length = {line_len}')
    i = 0
    for line in lines:
        for char in filter(lambda x: ord(x) >=48, line):
            # print(f'char = {char} ord = {ord(char)}')
            graph.add_node(i, height = ord(char) - 48)

            # now we need to connect the node between them since we are loading
            # nodes one by one, we can bind the node only to previously added nodes
            if i > line_len - 1:
                graph.add_edge(i-line_len, i) # to node up.
            if (i % line_len) != 0:
                graph.add_edge(i-1, i) # to previous node  
            i += 1

    # part 1 look for all nodes that have no low neighbours
    ex1_answer = 0
    for node, attributes in graph.nodes(data = True):
        # print (f'{node} attributes = {attributes}')
        # for neighbor in graph.neighbors(node):
        #     print (f'{node} neighbor = {neighbor}[{graph.nodes[neighbor]["height"]}]')

        height = attributes['height']
        neighbors = graph.neighbors(node)
        is_low = all(graph.nodes[n]['height'] > height for n in neighbors)
        if (is_low):
            ex1_answer += height + 1

    print (f'ex1 answer = {ex1_answer}')
    # now we can draw the graph            
    pos = nx.nx_agraph.graphviz_layout(graph)
    labels = nx.get_node_attributes(graph, 'height')

    nx.draw(
        graph,
        pos=pos,
        node_color="white",
        edge_color="grey",
        node_size=50,
        labels=labels,
        with_labels=True) 
    
    # or you can print other stuff in a subsequent time :D
    # nx.draw_networkx_labels(graph, pos)
    plt.savefig("out.png")

    # G = nx.grid_2d_graph(5, 5)  # 5x5 grid
    # # This example needs Graphviz and PyGraphviz
    # nx.nx_agraph.write_dot(G, "grid.dot")
    # # Having created the dot file, graphviz can be invoked via the command line
    # # to generate an image on disk, e.g.
    # print("Now run: neato -Tps grid.dot >grid.ps")

    # # Alternatively, the and image can be created directly via AGraph.draw
    # A = nx.nx_agraph.to_agraph(G)
    # A.draw("5x5.png", prog="neato")

if __name__ == "__main__":
    main()
