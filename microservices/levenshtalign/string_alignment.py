# -*- coding: utf-8 -*-
# author: chrishokamp

class LevensteinNode:
    def __init__(self, backpointer, cost, i, j):
        self.backpointer = backpointer
        self.cost = cost
        self.i = i
        self.j = j
    def operation_type(self):
        if self.backpointer is None:
            return 'start'
        if self.i == self.backpointer.i + 1 and self.j == self.backpointer.j:
            return 'deletion'
        if self.i == self.backpointer.i and self.j == self.backpointer.j + 1:
            return 'insertion'
        if self.i == self.backpointer.i + 1 and self.j == self.backpointer.j + 1:
            if self.cost > self.backpointer.cost:
                return 'substitution'
            return 'identical'

# Levenstein with backtrace
def levenstein(str1, str2):
    i_axis = len(str1) + 1
    j_axis = len(str2) + 1
    matrix = [[0 for j in range(j_axis)] for i in range(i_axis)]

    matrix[0][0] = LevensteinNode(None, 0, 0, 0)

    # init left column (all deletions)
    for i in range(1,i_axis):
        matrix[i][0] = LevensteinNode(matrix[i-1][0], i, i, 0)

    # init top row (all insertions)
    for j in range(1, j_axis):
        matrix[0][j] = LevensteinNode(matrix[0][j-1], j, 0, j)


    for j in range(1, j_axis):
        for i in range(1, i_axis):
            if (str1[i-1] == str2[j-1]):
                previous_node = matrix[i-1][j-1]
                matrix[i][j] = LevensteinNode(previous_node, previous_node.cost, i, j)
            else:
                candidate_nodes = [ \
                                   LevensteinNode(matrix[i-1][j], matrix[i-i][j].cost + 1, i, j), \
                                   LevensteinNode(matrix[i][j-1], matrix[i][j-1].cost + 1, i, j), \
                                   LevensteinNode(matrix[i-1][j-1], matrix[i-1][j-1].cost + 1, i, j), \
                                  ]
                sorted_costs = sorted(candidate_nodes, key= lambda x: x.cost)
                top_node = sorted_costs[0]
                matrix[i][j] = top_node

    return matrix

def levinstein_diff(str1, str2):
    final = levenstein(str1, str2)

    path = []
    last_node = final[-1][-1]
    path.append(last_node)
    while last_node.backpointer:
        last_node = last_node.backpointer
        path.append(last_node)

    path.reverse()

    str1_diff = []
    str2_diff = []
    # Remember that the string indices for ins, del, sub are off by one because we start at (0,0)
    for i, path_node in zip(range(1,len(path)), path[1:]):
        prev_node = path[i-1]
        # insertion
        if (path_node.i == prev_node.i and path_node.j == prev_node.j+1):
            str2_diff.append(path_node.j)
        # deletion
        elif (path_node.i == prev_node.i+1 and path_node.j == prev_node.j):
            str1_diff.append(path_node.i)
        # substitution
        elif path_node.cost != prev_node.cost:
            str2_diff.append(path_node.j)
            str1_diff.append(path_node.i)

    print(str1_diff)
    print(str2_diff)
    return (str1_diff, str2_diff)
