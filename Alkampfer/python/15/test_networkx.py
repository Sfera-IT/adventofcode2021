import networkx as netx

def test_basicNetworkx():
    """
    Basic graph creation
    """
    G = netx.Graph()
    G.add_edge(1, 2) # default edge data=1
    G.add_edge(2, 3, weight=0.9) # specify edge dat

    print(list(G.neighbors(1)))
    assert G.number_of_edges() == 2

    
