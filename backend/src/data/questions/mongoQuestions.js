export const mongoQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "MongoDB is a ______ database.",
      options: [
        "NoSQL",
        "Relational",
        "Graph",
        "Hierarchical",
      ],
      correctAnswer: "NoSQL",
      explanation:
        "MongoDB is a NoSQL document-oriented database that stores data in BSON documents.",
    },
  
    {
      difficulty: "Easy",
      question:
        "MongoDB stores data in the form of?",
      options: [
        "Documents",
        "Tables",
        "Rows",
        "Views",
      ],
      correctAnswer: "Documents",
      explanation:
        "MongoDB stores data as BSON documents inside collections.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command is used to display all databases in MongoDB?",
      options: [
        "show dbs",
        "show databases",
        "list db",
        "display dbs",
      ],
      correctAnswer: "show dbs",
      explanation:
        "The show dbs command lists all available databases.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command is used to switch or create a database in MongoDB?",
      options: [
        "use databaseName",
        "create databaseName",
        "switch databaseName",
        "db databaseName",
      ],
      correctAnswer: "use databaseName",
      explanation:
        "The use command switches to an existing database or creates it when data is inserted.",
    },
  
    {
      difficulty: "Easy",
      question:
        "What is the equivalent of a table in MongoDB?",
      options: [
        "Collection",
        "Document",
        "Schema",
        "Bucket",
      ],
      correctAnswer: "Collection",
      explanation:
        "A collection in MongoDB is similar to a table in relational databases.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method inserts a single document into a collection?",
      options: [
        "insertOne()",
        "insert()",
        "addOne()",
        "createOne()",
      ],
      correctAnswer: "insertOne()",
      explanation:
        "insertOne() inserts exactly one document into a collection.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method retrieves all documents from a collection?",
      options: [
        "find()",
        "findOne()",
        "select()",
        "get()",
      ],
      correctAnswer: "find()",
      explanation:
        "find() returns all matching documents from a collection.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method retrieves only one matching document?",
      options: [
        "findOne()",
        "find()",
        "getOne()",
        "selectOne()",
      ],
      correctAnswer: "findOne()",
      explanation:
        "findOne() returns the first matching document.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which field is automatically created for every MongoDB document?",
      options: [
        "_id",
        "id",
        "primaryKey",
        "uuid",
      ],
      correctAnswer: "_id",
      explanation:
        "Every MongoDB document automatically contains a unique _id field.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command removes a single document from a collection?",
      options: [
        "deleteOne()",
        "removeOne()",
        "delete()",
        "dropOne()",
      ],
      correctAnswer: "deleteOne()",
      explanation:
        "deleteOne() removes the first document that matches the specified filter.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question:
          "Which MongoDB method updates a single document?",
        options: [
          "updateOne()",
          "update()",
          "modifyOne()",
          "replace()",
        ],
        correctAnswer: "updateOne()",
        explanation:
          "updateOne() updates the first document that matches the specified filter.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB operator is used to update specific fields without replacing the entire document?",
        options: [
          "$set",
          "$update",
          "$change",
          "$modify",
        ],
        correctAnswer: "$set",
        explanation:
          "$set updates one or more fields while leaving the remaining document unchanged.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB operator is used to increase a numeric field?",
        options: [
          "$inc",
          "$add",
          "$sum",
          "$increase",
        ],
        correctAnswer: "$inc",
        explanation:
          "$inc increments a numeric field by the specified value.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB method removes multiple documents matching a filter?",
        options: [
          "deleteMany()",
          "removeMany()",
          "deleteAll()",
          "dropMany()",
        ],
        correctAnswer: "deleteMany()",
        explanation:
          "deleteMany() removes all documents that satisfy the specified filter.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB method returns the total number of documents matching a filter?",
        options: [
          "countDocuments()",
          "count()",
          "length()",
          "size()",
        ],
        correctAnswer: "countDocuments()",
        explanation:
          "countDocuments() accurately counts documents matching a query.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB method sorts query results?",
        options: [
          "sort()",
          "orderBy()",
          "arrange()",
          "group()",
        ],
        correctAnswer: "sort()",
        explanation:
          "The sort() method orders documents in ascending or descending order.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB method limits the number of returned documents?",
        options: [
          "limit()",
          "take()",
          "top()",
          "max()",
        ],
        correctAnswer: "limit()",
        explanation:
          "limit() restricts the number of documents returned by a query.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB method skips a specified number of documents?",
        options: [
          "skip()",
          "offset()",
          "ignore()",
          "next()",
        ],
        correctAnswer: "skip()",
        explanation:
          "skip() is commonly used for implementing pagination.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which MongoDB feature allows indexing fields to improve query performance?",
        options: [
          "createIndex()",
          "addIndex()",
          "makeIndex()",
          "index()",
        ],
        correctAnswer: "createIndex()",
        explanation:
          "createIndex() creates indexes that significantly improve query performance.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which aggregation stage filters documents in a MongoDB pipeline?",
        options: [
          "$match",
          "$group",
          "$project",
          "$sort",
        ],
        correctAnswer: "$match",
        explanation:
          "$match filters documents before passing them to the next aggregation stage.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question:
          "Which MongoDB aggregation stage is used to join documents from another collection?",
        options: [
          "$lookup",
          "$join",
          "$merge",
          "$union",
        ],
        correctAnswer: "$lookup",
        explanation:
          "$lookup performs a left outer join between two collections in the aggregation pipeline.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which MongoDB aggregation stage groups documents by a specified field?",
        options: [
          "$group",
          "$match",
          "$sort",
          "$project",
        ],
        correctAnswer: "$group",
        explanation:
          "$group groups documents by a specified key and performs aggregate calculations such as sum, average, and count.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the primary purpose of MongoDB replication?",
        options: [
          "To provide high availability and data redundancy",
          "To reduce document size",
          "To improve schema validation",
          "To replace indexing",
        ],
        correctAnswer: "To provide high availability and data redundancy",
        explanation:
          "Replication copies data across multiple servers to ensure fault tolerance and high availability.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is a Replica Set in MongoDB?",
        options: [
          "A group of MongoDB servers that maintain the same data",
          "A collection of indexes",
          "A group of related documents",
          "A backup file",
        ],
        correctAnswer: "A group of MongoDB servers that maintain the same data",
        explanation:
          "A Replica Set consists of one primary node and one or more secondary nodes that replicate data.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the main purpose of sharding in MongoDB?",
        options: [
          "To distribute data across multiple servers",
          "To encrypt documents",
          "To create backups",
          "To compress collections",
        ],
        correctAnswer: "To distribute data across multiple servers",
        explanation:
          "Sharding horizontally partitions data across multiple machines, improving scalability.",
      },
    
      {
        difficulty: "Hard",
        question:
          "MongoDB internally stores documents in which format?",
        options: [
          "BSON",
          "JSON",
          "XML",
          "CSV",
        ],
        correctAnswer: "BSON",
        explanation:
          "MongoDB stores documents in BSON (Binary JSON), which supports additional data types and efficient storage.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which MongoDB feature allows multiple operations to be executed atomically?",
        options: [
          "Transactions",
          "Replication",
          "Aggregation",
          "Indexing",
        ],
        correctAnswer: "Transactions",
        explanation:
          "Transactions ensure multiple operations either all succeed or all fail together.",
      },
    
      {
        difficulty: "Hard",
        question:
          "When should embedded documents generally be preferred over referenced documents?",
        options: [
          "When related data is frequently accessed together",
          "When data is shared across many collections",
          "When documents are extremely large",
          "When normalization is mandatory",
        ],
        correctAnswer: "When related data is frequently accessed together",
        explanation:
          "Embedding improves read performance by storing related data within the same document.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which type of index is automatically created for every MongoDB collection?",
        options: [
          "_id Index",
          "Text Index",
          "Compound Index",
          "Hashed Index",
        ],
        correctAnswer: "_id Index",
        explanation:
          "MongoDB automatically creates a unique index on the _id field for every collection.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which aggregation stage is used to reshape documents by including, excluding, or renaming fields?",
        options: [
          "$project",
          "$group",
          "$match",
          "$sort",
        ],
        correctAnswer: "$project",
        explanation:
          "$project controls the structure of documents passed to the next stage of the aggregation pipeline.",
      },
    
    ];