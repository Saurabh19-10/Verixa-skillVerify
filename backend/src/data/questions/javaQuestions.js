export const javaQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "Which keyword is used to inherit a class in Java?",
      options: [
        "extends",
        "implements",
        "inherits",
        "super",
      ],
      correctAnswer: "extends",
      explanation:
        "The extends keyword is used when one Java class inherits another class.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method is the entry point of a Java application?",
      options: [
        "main",
        "start",
        "run",
        "init",
      ],
      correctAnswer: "main",
      explanation:
        "The JVM starts a Java application from the public static void main method.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which primitive data type stores true or false values in Java?",
      options: [
        "boolean",
        "bool",
        "bit",
        "binary",
      ],
      correctAnswer: "boolean",
      explanation:
        "Java uses the boolean primitive type to store true or false values.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which keyword is used to create a new object in Java?",
      options: [
        "new",
        "create",
        "object",
        "make",
      ],
      correctAnswer: "new",
      explanation:
        "The new keyword allocates memory and creates a new object.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which access modifier makes a member accessible from any class?",
      options: [
        "public",
        "private",
        "protected",
        "default",
      ],
      correctAnswer: "public",
      explanation:
        "A public member can be accessed from any class where the class itself is accessible.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which collection type allows duplicate elements?",
      options: [
        "List",
        "Set",
        "Map",
        "EnumSet",
      ],
      correctAnswer: "List",
      explanation:
        "List implementations preserve ordered elements and allow duplicate values.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which exception is thrown when an integer is divided by zero?",
      options: [
        "ArithmeticException",
        "IOException",
        "NullPointerException",
        "ClassCastException",
      ],
      correctAnswer: "ArithmeticException",
      explanation:
        "Integer division by zero throws ArithmeticException in Java.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which keyword is used to define a constant variable in Java?",
      options: [
        "final",
        "const",
        "static",
        "fixed",
      ],
      correctAnswer: "final",
      explanation:
        "A final variable can be assigned only once.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which operator is used to compare primitive values for equality?",
      options: [
        "==",
        "=",
        "equals",
        "===",
      ],
      correctAnswer: "==",
      explanation:
        "The == operator compares primitive values directly.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which package contains the ArrayList class?",
      options: [
        "java.util",
        "java.lang",
        "java.io",
        "java.net",
      ],
      correctAnswer: "java.util",
      explanation:
        "ArrayList is part of the java.util package.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
  
    {
      difficulty: "Medium",
      question:
        "Which collection does not allow duplicate elements?",
      options: [
        "Set",
        "List",
        "ArrayList",
        "Queue",
      ],
      correctAnswer: "Set",
      explanation:
        "Set implementations store only unique elements.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which keyword prevents a method from being overridden?",
      options: [
        "final",
        "static",
        "const",
        "sealed",
      ],
      correctAnswer: "final",
      explanation:
        "A final method cannot be overridden by subclasses.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which interface defines the natural ordering of objects?",
      options: [
        "Comparable",
        "Comparator",
        "Iterable",
        "Serializable",
      ],
      correctAnswer: "Comparable",
      explanation:
        "Comparable defines natural ordering using the compareTo method.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which class is mutable and synchronized for string manipulation?",
      options: [
        "StringBuffer",
        "String",
        "StringBuilder",
        "CharSequence",
      ],
      correctAnswer: "StringBuffer",
      explanation:
        "StringBuffer is mutable and its methods are synchronized.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What is method overloading in Java?",
      options: [
        "Using the same method name with different parameter lists",
        "Redefining a parent method with the same signature",
        "Calling one constructor from another",
        "Hiding a static variable",
      ],
      correctAnswer:
        "Using the same method name with different parameter lists",
      explanation:
        "Method overloading occurs when methods have the same name but different parameters.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which Map implementation maintains insertion order?",
      options: [
        "LinkedHashMap",
        "HashMap",
        "TreeMap",
        "WeakHashMap",
      ],
      correctAnswer: "LinkedHashMap",
      explanation:
        "LinkedHashMap maintains entries in insertion order.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What does the transient keyword do in Java?",
      options: [
        "Excludes a field from default serialization",
        "Makes a field immutable",
        "Shares a field across all objects",
        "Creates thread-local storage",
      ],
      correctAnswer:
        "Excludes a field from default serialization",
      explanation:
        "Transient fields are skipped by Java's default serialization process.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which keyword is used by a class to implement an interface?",
      options: [
        "implements",
        "extends",
        "interface",
        "inherits",
      ],
      correctAnswer: "implements",
      explanation:
        "A class uses the implements keyword to provide an interface implementation.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What is the default value of an instance int variable in Java?",
      options: [
        "0",
        "null",
        "1",
        "undefined",
      ],
      correctAnswer: "0",
      explanation:
        "Instance numeric primitive fields receive zero as their default value.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which exception must generally be handled or declared at compile time?",
      options: [
        "Checked exception",
        "Runtime exception",
        "Arithmetic exception",
        "Null pointer exception",
      ],
      correctAnswer: "Checked exception",
      explanation:
        "Checked exceptions must be caught or declared using throws.",
    },
  
    // =========================================
    // Hard Questions
    // =========================================
  
    {
      difficulty: "Hard",
      question:
        "Where are ordinary Java objects typically stored?",
      options: [
        "Heap",
        "Stack",
        "Register",
        "Code cache",
      ],
      correctAnswer: "Heap",
      explanation:
        "Objects created with new are generally allocated in heap memory.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Which memory area stores method call frames and local variables?",
      options: [
        "Stack",
        "Heap",
        "Metaspace",
        "Constant pool",
      ],
      correctAnswer: "Stack",
      explanation:
        "Each thread has a stack containing method frames and local variables.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What problem does the volatile keyword primarily solve?",
      options: [
        "Visibility of shared variable updates between threads",
        "Atomicity of compound operations",
        "Deadlock prevention",
        "Object serialization",
      ],
      correctAnswer:
        "Visibility of shared variable updates between threads",
      explanation:
        "volatile ensures that changes to a shared variable are visible across threads.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Which concept determines whether an object can be garbage collected?",
      options: [
        "Reachability",
        "Reflection",
        "Boxing",
        "Interning",
      ],
      correctAnswer: "Reachability",
      explanation:
        "Objects that are no longer reachable from GC roots become eligible for garbage collection.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is type erasure in Java generics?",
      options: [
        "Generic type information is mostly removed at runtime",
        "Generic classes cannot be instantiated",
        "Primitive types become wrapper objects",
        "Interfaces become abstract classes",
      ],
      correctAnswer:
        "Generic type information is mostly removed at runtime",
      explanation:
        "Java generics are implemented mainly at compile time through type erasure.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Which lock allows multiple readers but only one writer?",
      options: [
        "ReadWriteLock",
        "ReentrantLock",
        "Semaphore",
        "CountDownLatch",
      ],
      correctAnswer: "ReadWriteLock",
      explanation:
        "ReadWriteLock supports concurrent reads while requiring exclusive write access.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is the purpose of the synchronized keyword?",
      options: [
        "To control concurrent access to critical sections",
        "To serialize objects",
        "To create immutable variables",
        "To start a new thread",
      ],
      correctAnswer:
        "To control concurrent access to critical sections",
      explanation:
        "synchronized provides mutual exclusion and memory visibility guarantees.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What happens when hashCode is overridden but equals is not overridden consistently?",
      options: [
        "Hash-based collections may behave incorrectly",
        "The code will not compile",
        "All objects become equal",
        "Garbage collection stops",
      ],
      correctAnswer:
        "Hash-based collections may behave incorrectly",
      explanation:
        "Equal objects must return the same hash code for HashMap and HashSet to work correctly.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Which functional interface represents an operation that accepts one argument and returns no result?",
      options: [
        "Consumer",
        "Supplier",
        "Function",
        "Predicate",
      ],
      correctAnswer: "Consumer",
      explanation:
        "Consumer<T> accepts one value and returns void.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is the main difference between HashMap and ConcurrentHashMap?",
      options: [
        "ConcurrentHashMap supports safer concurrent access",
        "HashMap always preserves insertion order",
        "ConcurrentHashMap allows null keys and null values",
        "HashMap is synchronized by default",
      ],
      correctAnswer:
        "ConcurrentHashMap supports safer concurrent access",
      explanation:
        "ConcurrentHashMap is designed for concurrent operations without locking the entire map.",
    },
  ];