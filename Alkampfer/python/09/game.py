import matplotlib.pyplot as plt
import networkx as nx

def main():
    """
    Simply play with networkx library
    """
    graph = nx.Graph()
    graph.add_node(1, color='red')
    graph.add_node(2, color='blue')
    graph.add_node(3, color='green')
    graph.add_node(4, color='yellow')
    graph.add_edge(1, 2)
    graph.add_edge(2, 3)
    graph.add_edge(3, 4)
    graph.add_edge(4, 2)

    # Ok we can draw with networkx it is not special but we can do something.
    pos = nx.nx_agraph.graphviz_layout(graph)
    nx.draw(graph, pos=pos, node_color="lightgrey", edge_color="grey", node_size=50, with_labels=True)   
    plt.savefig("out.png")

    print (list(graph.neighbors(2)))

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
