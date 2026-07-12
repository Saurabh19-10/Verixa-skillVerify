export const dsaQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question: "What does DSA stand for?",
      options: [
        "Data Structures and Algorithms",
        "Database System Architecture",
        "Distributed System Analysis",
        "Dynamic Software Application",
      ],
      correctAnswer: "Data Structures and Algorithms",
      explanation:
        "DSA stands for Data Structures and Algorithms, the foundation of problem-solving in computer science.",
    },
  
    {
      difficulty: "Easy",
      question: "Which data structure follows the FIFO principle?",
      options: [
        "Queue",
        "Stack",
        "Tree",
        "Graph",
      ],
      correctAnswer: "Queue",
      explanation:
        "Queue follows the First In First Out (FIFO) principle.",
    },
  
    {
      difficulty: "Easy",
      question: "Which data structure follows the LIFO principle?",
      options: [
        "Stack",
        "Queue",
        "Linked List",
        "Heap",
      ],
      correctAnswer: "Stack",
      explanation:
        "Stack follows the Last In First Out (LIFO) principle.",
    },
  
    {
      difficulty: "Easy",
      question: "What is the time complexity of accessing an array element by index?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n log n)",
      ],
      correctAnswer: "O(1)",
      explanation:
        "Arrays provide constant-time random access using indexes.",
    },
  
    {
      difficulty: "Easy",
      question: "Which data structure stores elements in key-value pairs?",
      options: [
        "Hash Map",
        "Stack",
        "Queue",
        "Tree",
      ],
      correctAnswer: "Hash Map",
      explanation:
        "Hash Maps store data as key-value pairs for efficient lookup.",
    },
  
    {
      difficulty: "Easy",
      question: "Which traversal visits Root, Left, Right?",
      options: [
        "Preorder",
        "Inorder",
        "Postorder",
        "Level Order",
      ],
      correctAnswer: "Preorder",
      explanation:
        "Preorder traversal follows Root → Left → Right.",
    },
  
    {
      difficulty: "Easy",
      question: "Which sorting algorithm has the best average-case complexity among these?",
      options: [
        "Merge Sort",
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
      ],
      correctAnswer: "Merge Sort",
      explanation:
        "Merge Sort runs in O(n log n) average and worst case.",
    },
  
    {
      difficulty: "Easy",
      question: "Binary Search works only on?",
      options: [
        "Sorted Array",
        "Unsorted Array",
        "Linked List",
        "Queue",
      ],
      correctAnswer: "Sorted Array",
      explanation:
        "Binary Search requires the data to be sorted.",
    },
  
    {
      difficulty: "Easy",
      question: "Which data structure is used for recursion?",
      options: [
        "Stack",
        "Queue",
        "Heap",
        "Tree",
      ],
      correctAnswer: "Stack",
      explanation:
        "Recursive function calls are stored in the call stack.",
    },
  
    {
      difficulty: "Easy",
      question: "What is the worst-case time complexity of Linear Search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(1)",
        "O(n log n)",
      ],
      correctAnswer: "O(n)",
      explanation:
        "Linear Search checks each element until the target is found.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question: "What is the average-case time complexity of Binary Search?",
        options: [
          "O(log n)",
          "O(n)",
          "O(n log n)",
          "O(1)",
        ],
        correctAnswer: "O(log n)",
        explanation:
          "Binary Search repeatedly divides the search space in half, resulting in O(log n) time complexity.",
      },
    
      {
        difficulty: "Medium",
        question: "Which data structure is primarily used to implement Breadth First Search (BFS)?",
        options: [
          "Queue",
          "Stack",
          "Heap",
          "Hash Map",
        ],
        correctAnswer: "Queue",
        explanation:
          "BFS explores nodes level by level using a queue.",
      },
    
      {
        difficulty: "Medium",
        question: "Which data structure is primarily used to implement Depth First Search (DFS)?",
        options: [
          "Stack",
          "Queue",
          "Linked List",
          "Heap",
        ],
        correctAnswer: "Stack",
        explanation:
          "DFS uses a stack, either explicitly or through recursion.",
      },
    
      {
        difficulty: "Medium",
        question: "What is the worst-case time complexity of Quick Sort?",
        options: [
          "O(n²)",
          "O(n log n)",
          "O(log n)",
          "O(n)",
        ],
        correctAnswer: "O(n²)",
        explanation:
          "Quick Sort degrades to O(n²) when poor pivot choices are repeatedly made.",
      },
    
      {
        difficulty: "Medium",
        question: "Which tree traversal visits nodes in sorted order for a Binary Search Tree?",
        options: [
          "Inorder",
          "Preorder",
          "Postorder",
          "Level Order",
        ],
        correctAnswer: "Inorder",
        explanation:
          "Inorder traversal of a BST returns elements in ascending order.",
      },
    
      {
        difficulty: "Medium",
        question: "Which data structure is used to efficiently implement a priority queue?",
        options: [
          "Heap",
          "Stack",
          "Queue",
          "Trie",
        ],
        correctAnswer: "Heap",
        explanation:
          "Binary Heap allows insertion and deletion of the highest-priority element in O(log n).",
      },
    
      {
        difficulty: "Medium",
        question: "What is the worst-case time complexity of searching in a Binary Search Tree (BST)?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n log n)",
        ],
        correctAnswer: "O(n)",
        explanation:
          "A skewed BST behaves like a linked list, resulting in O(n) search time.",
      },
    
      {
        difficulty: "Medium",
        question: "Which graph traversal algorithm guarantees the shortest path in an unweighted graph?",
        options: [
          "Breadth First Search (BFS)",
          "Depth First Search (DFS)",
          "Dijkstra",
          "Prim",
        ],
        correctAnswer: "Breadth First Search (BFS)",
        explanation:
          "BFS visits vertices level by level and guarantees the shortest path in unweighted graphs.",
      },
    
      {
        difficulty: "Medium",
        question: "What is the average-case time complexity of Merge Sort?",
        options: [
          "O(n log n)",
          "O(n²)",
          "O(log n)",
          "O(n)",
        ],
        correctAnswer: "O(n log n)",
        explanation:
          "Merge Sort consistently performs in O(n log n) time regardless of input order.",
      },
    
      {
        difficulty: "Medium",
        question: "Which data structure is most suitable for implementing an autocomplete feature?",
        options: [
          "Trie",
          "Heap",
          "Queue",
          "Graph",
        ],
        correctAnswer: "Trie",
        explanation:
          "Trie stores strings efficiently and enables fast prefix-based searches.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question: "Which algorithmic technique is primarily used in the 0/1 Knapsack problem?",
        options: [
          "Dynamic Programming",
          "Greedy Algorithm",
          "Backtracking",
          "Divide and Conquer",
        ],
        correctAnswer: "Dynamic Programming",
        explanation:
          "The 0/1 Knapsack problem is optimally solved using Dynamic Programming by storing solutions to overlapping subproblems.",
      },
    
      {
        difficulty: "Hard",
        question: "Which algorithm is commonly used to find the shortest path in a weighted graph with non-negative edge weights?",
        options: [
          "Dijkstra's Algorithm",
          "Breadth First Search",
          "Prim's Algorithm",
          "Kruskal's Algorithm",
        ],
        correctAnswer: "Dijkstra's Algorithm",
        explanation:
          "Dijkstra's Algorithm efficiently computes the shortest path from a source vertex to all other vertices when edge weights are non-negative.",
      },
    
      {
        difficulty: "Hard",
        question: "Which algorithm is used to find the shortest paths between all pairs of vertices in a graph?",
        options: [
          "Floyd-Warshall Algorithm",
          "Dijkstra's Algorithm",
          "Bellman-Ford Algorithm",
          "Depth First Search",
        ],
        correctAnswer: "Floyd-Warshall Algorithm",
        explanation:
          "The Floyd-Warshall algorithm computes shortest paths between every pair of vertices using Dynamic Programming.",
      },
    
      {
        difficulty: "Hard",
        question: "Which algorithm is commonly used for topological sorting of a Directed Acyclic Graph (DAG)?",
        options: [
          "Kahn's Algorithm",
          "Prim's Algorithm",
          "Merge Sort",
          "Binary Search",
        ],
        correctAnswer: "Kahn's Algorithm",
        explanation:
          "Kahn's Algorithm performs topological sorting using indegree counts and a queue.",
      },
    
      {
        difficulty: "Hard",
        question: "Which data structure is used in the Union-Find (Disjoint Set Union) algorithm?",
        options: [
          "Disjoint Set",
          "Trie",
          "Heap",
          "AVL Tree",
        ],
        correctAnswer: "Disjoint Set",
        explanation:
          "The Disjoint Set data structure supports efficient union and find operations for connectivity problems.",
      },
    
      {
        difficulty: "Hard",
        question: "Kadane's Algorithm is used to solve which problem?",
        options: [
          "Maximum Subarray Sum",
          "Shortest Path",
          "Minimum Spanning Tree",
          "Binary Search",
        ],
        correctAnswer: "Maximum Subarray Sum",
        explanation:
          "Kadane's Algorithm finds the maximum possible sum of a contiguous subarray in O(n) time.",
      },
    
      {
        difficulty: "Hard",
        question: "Which data structure is commonly used to answer range sum queries efficiently with updates?",
        options: [
          "Segment Tree",
          "Stack",
          "Queue",
          "Trie",
        ],
        correctAnswer: "Segment Tree",
        explanation:
          "Segment Trees efficiently support range queries and point updates in O(log n) time.",
      },
    
      {
        difficulty: "Hard",
        question: "Which algorithmic paradigm explores all possible solutions and abandons invalid paths early?",
        options: [
          "Backtracking",
          "Greedy",
          "Dynamic Programming",
          "Binary Search",
        ],
        correctAnswer: "Backtracking",
        explanation:
          "Backtracking systematically explores possible solutions and prunes paths that cannot lead to a valid solution.",
      },
    
      {
        difficulty: "Hard",
        question: "Which algorithmic strategy always chooses the locally optimal solution in the hope of finding the global optimum?",
        options: [
          "Greedy Algorithm",
          "Dynamic Programming",
          "Backtracking",
          "Divide and Conquer",
        ],
        correctAnswer: "Greedy Algorithm",
        explanation:
          "Greedy algorithms make the best local choice at each step, which is optimal for specific classes of problems.",
      },
    
      {
        difficulty: "Hard",
        question: "What is the time complexity of inserting an element into a Binary Heap?",
        options: [
          "O(log n)",
          "O(1)",
          "O(n)",
          "O(n log n)",
        ],
        correctAnswer: "O(log n)",
        explanation:
          "Insertion into a Binary Heap requires bubbling the new element up, resulting in O(log n) time complexity.",
      },
    
    ];