export const sqlQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Logic",
        "Sequential Query Language",
      ],
      correctAnswer: "Structured Query Language",
      explanation:
        "SQL stands for Structured Query Language and is used to manage relational databases.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL statement is used to retrieve data from a table?",
      options: [
        "SELECT",
        "GET",
        "FETCH",
        "DISPLAY",
      ],
      correctAnswer: "SELECT",
      explanation:
        "The SELECT statement retrieves records from one or more database tables.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL clause is used to filter records?",
      options: [
        "WHERE",
        "ORDER BY",
        "GROUP BY",
        "HAVING",
      ],
      correctAnswer: "WHERE",
      explanation:
        "The WHERE clause filters rows based on specified conditions.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL statement is used to insert new records into a table?",
      options: [
        "INSERT INTO",
        "ADD",
        "CREATE",
        "APPEND",
      ],
      correctAnswer: "INSERT INTO",
      explanation:
        "INSERT INTO adds one or more new rows to a table.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL statement is used to modify existing records?",
      options: [
        "UPDATE",
        "MODIFY",
        "CHANGE",
        "ALTER",
      ],
      correctAnswer: "UPDATE",
      explanation:
        "The UPDATE statement modifies existing rows in a table.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL statement removes records from a table?",
      options: [
        "DELETE",
        "REMOVE",
        "DROP",
        "CLEAR",
      ],
      correctAnswer: "DELETE",
      explanation:
        "DELETE removes selected rows from a table while keeping the table structure intact.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL keyword is used to sort query results?",
      options: [
        "ORDER BY",
        "SORT BY",
        "GROUP BY",
        "ARRANGE BY",
      ],
      correctAnswer: "ORDER BY",
      explanation:
        "ORDER BY sorts the result set in ascending or descending order.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL function returns the total number of rows?",
      options: [
        "COUNT()",
        "SUM()",
        "TOTAL()",
        "ROWS()",
      ],
      correctAnswer: "COUNT()",
      explanation:
        "COUNT() returns the number of rows matching the query.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL constraint uniquely identifies each record in a table?",
      options: [
        "PRIMARY KEY",
        "FOREIGN KEY",
        "UNIQUE",
        "CHECK",
      ],
      correctAnswer: "PRIMARY KEY",
      explanation:
        "A PRIMARY KEY uniquely identifies every row and cannot contain NULL values.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which SQL statement is used to create a new table?",
      options: [
        "CREATE TABLE",
        "NEW TABLE",
        "ADD TABLE",
        "MAKE TABLE",
      ],
      correctAnswer: "CREATE TABLE",
      explanation:
        "CREATE TABLE creates a new table along with its columns and constraints.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question:
          "Which SQL JOIN returns only the matching rows from both tables?",
        options: [
          "INNER JOIN",
          "LEFT JOIN",
          "RIGHT JOIN",
          "FULL JOIN",
        ],
        correctAnswer: "INNER JOIN",
        explanation:
          "INNER JOIN returns only rows that have matching values in both tables.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL JOIN returns all rows from the left table and matching rows from the right table?",
        options: [
          "LEFT JOIN",
          "INNER JOIN",
          "RIGHT JOIN",
          "CROSS JOIN",
        ],
        correctAnswer: "LEFT JOIN",
        explanation:
          "LEFT JOIN returns all rows from the left table, even if there is no matching row in the right table.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL clause is used to group rows with the same values?",
        options: [
          "GROUP BY",
          "ORDER BY",
          "HAVING",
          "DISTINCT",
        ],
        correctAnswer: "GROUP BY",
        explanation:
          "GROUP BY groups rows that have the same values into summary rows.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL clause filters grouped records after GROUP BY?",
        options: [
          "HAVING",
          "WHERE",
          "ORDER BY",
          "LIMIT",
        ],
        correctAnswer: "HAVING",
        explanation:
          "HAVING filters grouped records, whereas WHERE filters individual rows before grouping.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL keyword removes duplicate rows from a query result?",
        options: [
          "DISTINCT",
          "UNIQUE",
          "FILTER",
          "ONLY",
        ],
        correctAnswer: "DISTINCT",
        explanation:
          "DISTINCT returns only unique values from the selected columns.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL function returns the highest value in a column?",
        options: [
          "MAX()",
          "TOP()",
          "HIGH()",
          "UPPER()",
        ],
        correctAnswer: "MAX()",
        explanation:
          "MAX() returns the maximum value from a column.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL function calculates the average value of a numeric column?",
        options: [
          "AVG()",
          "MEAN()",
          "SUM()",
          "COUNT()",
        ],
        correctAnswer: "AVG()",
        explanation:
          "AVG() calculates the average of numeric values in a column.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL constraint ensures that a column cannot contain NULL values?",
        options: [
          "NOT NULL",
          "UNIQUE",
          "PRIMARY KEY",
          "CHECK",
        ],
        correctAnswer: "NOT NULL",
        explanation:
          "The NOT NULL constraint ensures that every row must contain a value for that column.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL statement is used to modify the structure of an existing table?",
        options: [
          "ALTER TABLE",
          "UPDATE TABLE",
          "MODIFY TABLE",
          "CHANGE TABLE",
        ],
        correctAnswer: "ALTER TABLE",
        explanation:
          "ALTER TABLE is used to add, remove, or modify columns and constraints.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which SQL constraint creates a relationship between two tables?",
        options: [
          "FOREIGN KEY",
          "PRIMARY KEY",
          "UNIQUE",
          "CHECK",
        ],
        correctAnswer: "FOREIGN KEY",
        explanation:
          "A FOREIGN KEY links one table to another by referencing the primary key of another table.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question:
          "Which SQL command permanently saves the current transaction?",
        options: [
          "COMMIT",
          "SAVE",
          "ROLLBACK",
          "END",
        ],
        correctAnswer: "COMMIT",
        explanation:
          "COMMIT permanently saves all changes made during the current transaction.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which SQL command is used to undo changes made during the current transaction?",
        options: [
          "ROLLBACK",
          "UNDO",
          "RESET",
          "REVERT",
        ],
        correctAnswer: "ROLLBACK",
        explanation:
          "ROLLBACK restores the database to its previous consistent state before the transaction.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which ACID property ensures that a transaction is completed entirely or not executed at all?",
        options: [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability",
        ],
        correctAnswer: "Atomicity",
        explanation:
          "Atomicity guarantees that every transaction is treated as a single indivisible unit.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the primary purpose of an index in SQL?",
        options: [
          "To improve query performance",
          "To store backup data",
          "To enforce foreign keys",
          "To reduce table size",
        ],
        correctAnswer: "To improve query performance",
        explanation:
          "Indexes speed up data retrieval by reducing the amount of data scanned during queries.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which SQL object stores the result of a query as a virtual table?",
        options: [
          "VIEW",
          "INDEX",
          "TRIGGER",
          "PROCEDURE",
        ],
        correctAnswer: "VIEW",
        explanation:
          "A VIEW is a virtual table created from the result of a SELECT statement.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which type of subquery returns exactly one value?",
        options: [
          "Scalar Subquery",
          "Correlated Subquery",
          "Nested Subquery",
          "Inline View",
        ],
        correctAnswer: "Scalar Subquery",
        explanation:
          "A scalar subquery returns a single value that can be used in expressions.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which normal form removes partial dependency from a table?",
        options: [
          "Second Normal Form (2NF)",
          "First Normal Form (1NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)",
        ],
        correctAnswer: "Second Normal Form (2NF)",
        explanation:
          "2NF removes partial dependency by ensuring non-key attributes depend on the entire primary key.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which SQL clause is executed first during query processing?",
        options: [
          "FROM",
          "SELECT",
          "ORDER BY",
          "GROUP BY",
        ],
        correctAnswer: "FROM",
        explanation:
          "Logically, SQL processes the FROM clause before WHERE, GROUP BY, HAVING, SELECT, and ORDER BY.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which SQL feature allows a query to reference the outer query for each processed row?",
        options: [
          "Correlated Subquery",
          "Scalar Subquery",
          "View",
          "Stored Procedure",
        ],
        correctAnswer: "Correlated Subquery",
        explanation:
          "A correlated subquery depends on values from the outer query and executes once for each row.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which isolation level provides the highest level of transaction isolation in SQL?",
        options: [
          "Serializable",
          "Repeatable Read",
          "Read Committed",
          "Read Uncommitted",
        ],
        correctAnswer: "Serializable",
        explanation:
          "Serializable provides the strictest isolation by preventing dirty reads, non-repeatable reads, and phantom reads.",
      },
    
    ];