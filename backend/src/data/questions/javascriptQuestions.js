export const javascriptQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "Which keyword declares a block-scoped variable in JavaScript?",
      options: ["let", "var", "define", "scope"],
      correctAnswer: "let",
      explanation:
        "The let keyword creates a block-scoped variable.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which keyword declares a constant binding in JavaScript?",
      options: ["const", "final", "static", "fixed"],
      correctAnswer: "const",
      explanation:
        "A const binding cannot be reassigned after initialization.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which operator compares both value and data type?",
      options: ["===", "==", "=", "!="],
      correctAnswer: "===",
      explanation:
        "Strict equality checks both the value and the type.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method converts a JSON string into a JavaScript object?",
      options: [
        "JSON.parse",
        "JSON.stringify",
        "Object.parse",
        "JSON.decode",
      ],
      correctAnswer: "JSON.parse",
      explanation:
        "JSON.parse converts valid JSON text into a JavaScript value.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which method converts a JavaScript object into a JSON string?",
      options: [
        "JSON.stringify",
        "JSON.parse",
        "Object.stringify",
        "JSON.encode",
      ],
      correctAnswer: "JSON.stringify",
      explanation:
        "JSON.stringify serializes a JavaScript value into JSON text.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which array method adds an element to the end of an array?",
      options: ["push", "pop", "shift", "unshift"],
      correctAnswer: "push",
      explanation:
        "The push method appends one or more elements to an array.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which array method removes the final element?",
      options: ["pop", "push", "shift", "slice"],
      correctAnswer: "pop",
      explanation:
        "The pop method removes and returns the final array element.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which value represents an intentional absence of a value?",
      options: ["null", "undefined", "NaN", "false"],
      correctAnswer: "null",
      explanation:
        "null is commonly assigned to represent an intentional absence of a value.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which function schedules code to run after a delay?",
      options: [
        "setTimeout",
        "setIntervalOnly",
        "delay",
        "sleep",
      ],
      correctAnswer: "setTimeout",
      explanation:
        "setTimeout schedules a callback after at least the specified delay.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which symbol is used for single-line comments in JavaScript?",
      options: ["//", "#", "<!--", "--"],
      correctAnswer: "//",
      explanation:
        "JavaScript single-line comments begin with two forward slashes.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
  
    {
      difficulty: "Medium",
      question:
        "What is a closure in JavaScript?",
      options: [
        "A function that retains access to its lexical scope",
        "A method that closes the browser",
        "A frozen object",
        "A completed Promise",
      ],
      correctAnswer:
        "A function that retains access to its lexical scope",
      explanation:
        "A closure lets a function access variables from the scope where it was created.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What does the map method return?",
      options: [
        "A new transformed array",
        "The original array length",
        "A single boolean",
        "Nothing",
      ],
      correctAnswer: "A new transformed array",
      explanation:
        "map creates a new array containing the callback result for every element.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which array method returns only elements that pass a condition?",
      options: ["filter", "map", "reduce", "forEach"],
      correctAnswer: "filter",
      explanation:
        "filter creates a new array containing elements for which the callback returns true.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What does the reduce method commonly do?",
      options: [
        "Combines array values into one accumulated result",
        "Removes the final item",
        "Sorts the array",
        "Duplicates all elements",
      ],
      correctAnswer:
        "Combines array values into one accumulated result",
      explanation:
        "reduce processes each element while maintaining an accumulated result.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What is event delegation?",
      options: [
        "Handling child events through a common ancestor",
        "Blocking all browser events",
        "Creating custom events only",
        "Running events on the backend",
      ],
      correctAnswer:
        "Handling child events through a common ancestor",
      explanation:
        "Event delegation uses event bubbling so a parent can handle events for its children.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which Promise method resolves when all supplied Promises resolve?",
      options: [
        "Promise.all",
        "Promise.race",
        "Promise.any",
        "Promise.resolveOnly",
      ],
      correctAnswer: "Promise.all",
      explanation:
        "Promise.all waits for all inputs and rejects if any input rejects.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What does the spread operator do inside an array literal?",
      options: [
        "Expands iterable elements",
        "Sorts the array",
        "Removes duplicates automatically",
        "Freezes the array",
      ],
      correctAnswer: "Expands iterable elements",
      explanation:
        "The spread operator expands iterable values into the surrounding array.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What is destructuring in JavaScript?",
      options: [
        "Extracting values from arrays or objects into variables",
        "Deleting an object permanently",
        "Converting JSON into HTML",
        "Stopping asynchronous execution",
      ],
      correctAnswer:
        "Extracting values from arrays or objects into variables",
      explanation:
        "Destructuring provides concise syntax for extracting array items and object properties.",
    },
  
    {
      difficulty: "Medium",
      question:
        "What is hoisting in JavaScript?",
      options: [
        "Declarations are processed before normal execution of their scope",
        "Variables are moved into global scope",
        "Functions always run asynchronously",
        "Objects are moved into browser storage",
      ],
      correctAnswer:
        "Declarations are processed before normal execution of their scope",
      explanation:
        "JavaScript registers declarations before executing statements in that scope.",
    },
  
    {
      difficulty: "Medium",
      question:
        "Which method creates a shallow merged object from source objects?",
      options: [
        "Object.assign",
        "Object.freeze",
        "Object.keys",
        "Object.createOnly",
      ],
      correctAnswer: "Object.assign",
      explanation:
        "Object.assign copies enumerable own properties from source objects into a target.",
    },
  
    // =========================================
    // Hard Questions
    // =========================================
  
    {
      difficulty: "Hard",
      question:
        "What does the JavaScript event loop coordinate?",
      options: [
        "Execution of queued asynchronous callbacks",
        "Database indexing",
        "CSS selector matching only",
        "Memory allocation only",
      ],
      correctAnswer:
        "Execution of queued asynchronous callbacks",
      explanation:
        "The event loop schedules queued tasks when the call stack becomes available.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Which queue normally has priority after the current call stack finishes?",
      options: [
        "Microtask queue",
        "Timer queue",
        "Rendering queue only",
        "Network queue only",
      ],
      correctAnswer: "Microtask queue",
      explanation:
        "Promise callbacks and other microtasks run before the next regular task.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is prototype-based inheritance?",
      options: [
        "Objects inherit behavior through prototype links",
        "Classes inherit only using interfaces",
        "Functions cannot contain properties",
        "Inheritance requires a compiler",
      ],
      correctAnswer:
        "Objects inherit behavior through prototype links",
      explanation:
        "JavaScript objects delegate missing property lookups through their prototype chain.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What does Object.freeze prevent?",
      options: [
        "Adding, deleting, or changing own properties",
        "Reading object properties",
        "Creating references to the object",
        "Garbage collection",
      ],
      correctAnswer:
        "Adding, deleting, or changing own properties",
      explanation:
        "A frozen object's own properties become non-configurable and generally non-writable.",
    },
  
    {
      difficulty: "Hard",
      question:
        "Why can 0.1 + 0.2 produce a value different from exactly 0.3?",
      options: [
        "Binary floating-point representation",
        "Integer overflow",
        "String concatenation",
        "Event-loop scheduling",
      ],
      correctAnswer: "Binary floating-point representation",
      explanation:
        "Many decimal fractions cannot be represented exactly using binary floating-point numbers.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What does an async function always return?",
      options: [
        "A Promise",
        "A generator",
        "A callback",
        "A plain object",
      ],
      correctAnswer: "A Promise",
      explanation:
        "An async function wraps its returned value in a Promise.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is a shallow copy?",
      options: [
        "A copy where nested objects still share references",
        "A complete independent copy of every nested value",
        "A frozen object",
        "A copy containing primitive values only",
      ],
      correctAnswer:
        "A copy where nested objects still share references",
      explanation:
        "A shallow copy duplicates the top level but keeps references to nested objects.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What problem can arise from modifying an array while iterating over it?",
      options: [
        "Elements may be skipped or processed unexpectedly",
        "JavaScript stops compiling",
        "The browser always crashes",
        "The array becomes immutable",
      ],
      correctAnswer:
        "Elements may be skipped or processed unexpectedly",
      explanation:
        "Changing indexes and length during iteration can affect which elements are visited.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is the purpose of a WeakMap?",
      options: [
        "Store object keys without preventing their garbage collection",
        "Store primitive keys in sorted order",
        "Create immutable maps",
        "Serialize objects into JSON",
      ],
      correctAnswer:
        "Store object keys without preventing their garbage collection",
      explanation:
        "WeakMap keys are weakly referenced objects and do not prevent garbage collection.",
    },
  
    {
      difficulty: "Hard",
      question:
        "What is a generator function?",
      options: [
        "A function that can pause and resume while yielding values",
        "A function that always returns a Promise",
        "A function that creates database IDs",
        "A function that runs only once",
      ],
      correctAnswer:
        "A function that can pause and resume while yielding values",
      explanation:
        "Generator functions use function* and yield to produce values lazily.",
    },
  ];