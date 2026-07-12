export const cssQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets",
      ],
      correctAnswer: "Cascading Style Sheets",
      explanation:
        "CSS stands for Cascading Style Sheets and is used to style HTML documents.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property is used to change the text color?",
      options: [
        "color",
        "font-color",
        "text-color",
        "foreground",
      ],
      correctAnswer: "color",
      explanation:
        "The color property sets the color of text.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property is used to change the background color of an element?",
      options: [
        "background-color",
        "bgcolor",
        "color",
        "background",
      ],
      correctAnswer: "background-color",
      explanation:
        "The background-color property sets the background color of an element.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property controls the size of text?",
      options: [
        "font-size",
        "text-size",
        "font-style",
        "size",
      ],
      correctAnswer: "font-size",
      explanation:
        "The font-size property specifies the size of text.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property is used to make text bold?",
      options: [
        "font-weight",
        "font-style",
        "text-bold",
        "weight",
      ],
      correctAnswer: "font-weight",
      explanation:
        "The font-weight property specifies the thickness of text.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property adds space inside an element's border?",
      options: [
        "padding",
        "margin",
        "spacing",
        "border-spacing",
      ],
      correctAnswer: "padding",
      explanation:
        "Padding creates space between the content and the border.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property adds space outside an element's border?",
      options: [
        "margin",
        "padding",
        "spacing",
        "gap",
      ],
      correctAnswer: "margin",
      explanation:
        "Margin creates space outside the element's border.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property is used to add a border around an element?",
      options: [
        "border",
        "outline",
        "frame",
        "box-border",
      ],
      correctAnswer: "border",
      explanation:
        "The border property defines the border around an element.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS property is used to align text horizontally?",
      options: [
        "text-align",
        "align",
        "text-position",
        "justify-content",
      ],
      correctAnswer: "text-align",
      explanation:
        "The text-align property controls horizontal alignment of text.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which CSS selector selects an element with the id 'header'?",
      options: [
        "#header",
        ".header",
        "*header",
        "header#",
      ],
      correctAnswer: "#header",
      explanation:
        "The # selector is used to target an element by its id.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question:
          "Which CSS layout module is primarily designed for one-dimensional layouts?",
        options: [
          "Flexbox",
          "Grid",
          "Float",
          "Position",
        ],
        correctAnswer: "Flexbox",
        explanation:
          "Flexbox is designed for arranging items in a single row or column.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS layout module is best suited for two-dimensional layouts?",
        options: [
          "Grid",
          "Flexbox",
          "Float",
          "Inline-block",
        ],
        correctAnswer: "Grid",
        explanation:
          "CSS Grid provides both row and column based layouts.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property makes a flex container?",
        options: [
          "display: flex",
          "display: grid",
          "flex: 1",
          "position: flex",
        ],
        correctAnswer: "display: flex",
        explanation:
          "Applying display: flex converts an element into a flex container.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which property changes the main axis direction in Flexbox?",
        options: [
          "flex-direction",
          "justify-content",
          "align-items",
          "flex-wrap",
        ],
        correctAnswer: "flex-direction",
        explanation:
          "flex-direction controls whether flex items are arranged in rows or columns.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property aligns flex items along the main axis?",
        options: [
          "justify-content",
          "align-items",
          "align-content",
          "text-align",
        ],
        correctAnswer: "justify-content",
        explanation:
          "justify-content distributes items along the main axis of a flex container.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property aligns flex items along the cross axis?",
        options: [
          "align-items",
          "justify-content",
          "vertical-align",
          "align-self",
        ],
        correctAnswer: "align-items",
        explanation:
          "align-items controls alignment on the cross axis.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property specifies the stacking order of positioned elements?",
        options: [
          "z-index",
          "order",
          "stack",
          "layer",
        ],
        correctAnswer: "z-index",
        explanation:
          "z-index controls which positioned element appears on top.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property rounds the corners of an element?",
        options: [
          "border-radius",
          "corner-radius",
          "border-style",
          "outline-radius",
        ],
        correctAnswer: "border-radius",
        explanation:
          "border-radius creates rounded corners for an element.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS property is used to create shadows around elements?",
        options: [
          "box-shadow",
          "shadow",
          "element-shadow",
          "border-shadow",
        ],
        correctAnswer: "box-shadow",
        explanation:
          "box-shadow adds shadow effects around an element's frame.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which CSS pseudo-class selects an element when the mouse pointer is over it?",
        options: [
          ":hover",
          ":focus",
          ":active",
          ":visited",
        ],
        correctAnswer: ":hover",
        explanation:
          "The :hover pseudo-class applies styles when the user hovers over an element.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question:
          "Which CSS selector has the highest specificity?",
        options: [
          "#id",
          ".class",
          "element",
          "*",
        ],
        correctAnswer: "#id",
        explanation:
          "ID selectors have higher specificity than class, element, and universal selectors.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the default value of the position property in CSS?",
        options: [
          "static",
          "relative",
          "absolute",
          "fixed",
        ],
        correctAnswer: "static",
        explanation:
          "By default, every HTML element has position: static.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS position value places an element relative to the browser viewport?",
        options: [
          "fixed",
          "absolute",
          "relative",
          "sticky",
        ],
        correctAnswer: "fixed",
        explanation:
          "A fixed positioned element remains in the same place even when the page is scrolled.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS position value behaves like relative until a scroll threshold is reached?",
        options: [
          "sticky",
          "fixed",
          "absolute",
          "relative",
        ],
        correctAnswer: "sticky",
        explanation:
          "position: sticky combines relative and fixed positioning based on the scroll position.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS function is commonly used to create responsive font sizes and layouts?",
        options: [
          "clamp()",
          "rgb()",
          "calc-color()",
          "opacity()",
        ],
        correctAnswer: "clamp()",
        explanation:
          "The clamp() function provides responsive values with minimum, preferred, and maximum limits.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS property controls how overflowing content is handled?",
        options: [
          "overflow",
          "clip",
          "display",
          "visibility",
        ],
        correctAnswer: "overflow",
        explanation:
          "The overflow property determines whether content is clipped, scrollable, or visible outside its container.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS at-rule is primarily used to create responsive layouts?",
        options: [
          "@media",
          "@import",
          "@keyframes",
          "@font-face",
        ],
        correctAnswer: "@media",
        explanation:
          "@media rules apply styles based on screen size, orientation, and device characteristics.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS feature allows custom reusable variables?",
        options: [
          "CSS Custom Properties",
          "Mixins",
          "Constants",
          "Variables()",
        ],
        correctAnswer: "CSS Custom Properties",
        explanation:
          "CSS Custom Properties (variables) are declared using --variable-name and accessed with var().",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS property defines the duration of a transition effect?",
        options: [
          "transition-duration",
          "animation-duration",
          "transition-delay",
          "transition-speed",
        ],
        correctAnswer: "transition-duration",
        explanation:
          "transition-duration specifies how long a transition animation should take.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which CSS property enables smooth animations between property changes?",
        options: [
          "transition",
          "animation",
          "transform",
          "translate",
        ],
        correctAnswer: "transition",
        explanation:
          "The transition property allows CSS property values to change smoothly over a specified duration.",
      },
    
    ];