export const htmlQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "HyperText Machine Language",
        "Hyper Transfer Markup Language",
        "HighText Markup Language",
      ],
      correctAnswer: "HyperText Markup Language",
      explanation:
        "HTML stands for HyperText Markup Language and is the standard markup language used to create web pages.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used to create the largest heading?",
      options: [
        "<h1>",
        "<h6>",
        "<head>",
        "<heading>",
      ],
      correctAnswer: "<h1>",
      explanation:
        "The <h1> tag defines the most important and largest heading in HTML.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML element is used to create a paragraph?",
      options: [
        "<p>",
        "<para>",
        "<text>",
        "<paragraph>",
      ],
      correctAnswer: "<p>",
      explanation:
        "The <p> element defines a paragraph in HTML.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used to insert an image?",
      options: [
        "<img>",
        "<image>",
        "<picture>",
        "<src>",
      ],
      correctAnswer: "<img>",
      explanation:
        "The <img> element is used to embed images into an HTML document.",
    },
  
    {
      difficulty: "Easy",
      question: "Which attribute specifies the URL of an image?",
      options: [
        "src",
        "href",
        "alt",
        "link",
      ],
      correctAnswer: "src",
      explanation:
        "The src attribute specifies the path of the image to be displayed.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used to create a hyperlink?",
      options: [
        "<a>",
        "<link>",
        "<href>",
        "<url>",
      ],
      correctAnswer: "<a>",
      explanation:
        "The <a> (anchor) element is used to create hyperlinks.",
    },
  
    {
      difficulty: "Easy",
      question: "Which attribute defines the destination URL of a hyperlink?",
      options: [
        "href",
        "src",
        "target",
        "rel",
      ],
      correctAnswer: "href",
      explanation:
        "The href attribute specifies the destination of a hyperlink.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used to create an unordered list?",
      options: [
        "<ul>",
        "<ol>",
        "<li>",
        "<list>",
      ],
      correctAnswer: "<ul>",
      explanation:
        "The <ul> element creates an unordered (bulleted) list.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used for a list item?",
      options: [
        "<li>",
        "<ul>",
        "<ol>",
        "<item>",
      ],
      correctAnswer: "<li>",
      explanation:
        "The <li> element represents an individual item in ordered or unordered lists.",
    },
  
    {
      difficulty: "Easy",
      question: "Which HTML tag is used to create a line break?",
      options: [
        "<br>",
        "<break>",
        "<lb>",
        "<hr>",
      ],
      correctAnswer: "<br>",
      explanation:
        "The <br> tag inserts a single line break without starting a new paragraph.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question: "Which HTML5 element is used to define independent self-contained content?",
        options: [
          "<article>",
          "<section>",
          "<div>",
          "<aside>",
        ],
        correctAnswer: "<article>",
        explanation:
          "The <article> element represents self-contained content that can be distributed independently.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML element is used for navigation links?",
        options: [
          "<nav>",
          "<menu>",
          "<header>",
          "<section>",
        ],
        correctAnswer: "<nav>",
        explanation:
          "The <nav> element defines a section containing navigation links.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML5 element is used to play video files?",
        options: [
          "<video>",
          "<media>",
          "<movie>",
          "<play>",
        ],
        correctAnswer: "<video>",
        explanation:
          "The <video> element embeds video content without requiring external plugins.",
      },
    
      {
        difficulty: "Medium",
        question: "Which attribute opens a hyperlink in a new browser tab?",
        options: [
          'target="_blank"',
          'target="_new"',
          'target="_tab"',
          'target="_self"',
        ],
        correctAnswer: 'target="_blank"',
        explanation:
          'Using target="_blank" opens the linked document in a new tab or window.',
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML element is primarily used to group form controls together?",
        options: [
          "<fieldset>",
          "<formgroup>",
          "<group>",
          "<section>",
        ],
        correctAnswer: "<fieldset>",
        explanation:
          "The <fieldset> element groups related form controls and labels together.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML attribute is required to uniquely identify an element on a page?",
        options: [
          "id",
          "class",
          "name",
          "value",
        ],
        correctAnswer: "id",
        explanation:
          "The id attribute uniquely identifies an HTML element within a document.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML5 input type provides a built-in email validation?",
        options: [
          "email",
          "text",
          "mail",
          "string",
        ],
        correctAnswer: "email",
        explanation:
          'The input type="email" validates email format before form submission.',
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML element is used to display a scalar measurement such as disk usage or a progress value?",
        options: [
          "<meter>",
          "<progress>",
          "<gauge>",
          "<status>",
        ],
        correctAnswer: "<meter>",
        explanation:
          "The <meter> element represents a known measurement within a fixed range.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML element is commonly used to represent the footer of a document or section?",
        options: [
          "<footer>",
          "<bottom>",
          "<end>",
          "<section-footer>",
        ],
        correctAnswer: "<footer>",
        explanation:
          "The <footer> element contains information such as copyright, author details, or related links.",
      },
    
      {
        difficulty: "Medium",
        question: "Which HTML element provides machine-readable date and time information?",
        options: [
          "<time>",
          "<date>",
          "<datetime>",
          "<calendar>",
        ],
        correctAnswer: "<time>",
        explanation:
          "The <time> element represents dates and times in a machine-readable format.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question:
          "Which HTML feature allows a browser to defer loading images until they are close to the viewport?",
        options: [
          'loading="lazy"',
          'defer="true"',
          'fetch="lazy"',
          'lazyload',
        ],
        correctAnswer: 'loading="lazy"',
        explanation:
          'The loading="lazy" attribute delays loading off-screen images, improving page performance.',
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML element is most appropriate for marking up the primary content of a document?",
        options: [
          "<main>",
          "<section>",
          "<body>",
          "<article>",
        ],
        correctAnswer: "<main>",
        explanation:
          "The <main> element represents the dominant content of the document and should appear only once.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Why should developers prefer semantic HTML over generic <div> elements whenever possible?",
        options: [
          "It improves accessibility and SEO",
          "It reduces CSS file size",
          "It increases JavaScript speed",
          "It automatically makes pages responsive",
        ],
        correctAnswer: "It improves accessibility and SEO",
        explanation:
          "Semantic HTML helps browsers, screen readers, and search engines better understand page structure.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML attribute helps improve accessibility by associating a label with a form input?",
        options: [
          "for",
          "id",
          "name",
          "value",
        ],
        correctAnswer: "for",
        explanation:
          "The label's for attribute references the input's id, improving accessibility and usability.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML element should be used to provide alternative content when JavaScript is disabled?",
        options: [
          "<noscript>",
          "<fallback>",
          "<script-fallback>",
          "<alternative>",
        ],
        correctAnswer: "<noscript>",
        explanation:
          "The <noscript> element displays content when scripting is unavailable or disabled.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML5 API allows web applications to store data in the browser even after it is closed?",
        options: [
          "localStorage",
          "sessionStorage",
          "Cookies",
          "IndexedCSS",
        ],
        correctAnswer: "localStorage",
        explanation:
          "localStorage stores persistent key-value data until it is explicitly removed.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML element is used to draw graphics dynamically with JavaScript?",
        options: [
          "<canvas>",
          "<svg>",
          "<graphics>",
          "<draw>",
        ],
        correctAnswer: "<canvas>",
        explanation:
          "The <canvas> element provides a drawing surface that can be manipulated using JavaScript.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML metadata element is most important for responsive web design?",
        options: [
          '<meta name="viewport">',
          '<meta charset="UTF-8">',
          "<title>",
          '<meta name="keywords">',
        ],
        correctAnswer: '<meta name="viewport">',
        explanation:
          "The viewport meta tag ensures proper scaling and rendering on mobile devices.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML attribute is commonly used to improve accessibility by providing additional information to assistive technologies?",
        options: [
          "aria-label",
          "placeholder",
          "title",
          "caption",
        ],
        correctAnswer: "aria-label",
        explanation:
          "The aria-label attribute provides an accessible name for elements used by screen readers.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which HTML element is specifically designed for scalable vector graphics?",
        options: [
          "<svg>",
          "<canvas>",
          "<vector>",
          "<graphics>",
        ],
        correctAnswer: "<svg>",
        explanation:
          "The <svg> element defines resolution-independent vector graphics directly in HTML.",
      },
    
    ];