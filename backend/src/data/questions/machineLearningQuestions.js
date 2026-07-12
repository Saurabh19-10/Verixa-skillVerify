export const machineLearningQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question: "What is Machine Learning?",
      options: [
        "A branch of AI that enables systems to learn from data",
        "A programming language",
        "A database management system",
        "A web development framework",
      ],
      correctAnswer:
        "A branch of AI that enables systems to learn from data",
      explanation:
        "Machine Learning is a subset of Artificial Intelligence where models learn patterns from data without being explicitly programmed.",
    },
  
    {
      difficulty: "Easy",
      question: "Which of the following is a type of Machine Learning?",
      options: [
        "Supervised Learning",
        "Structured Learning",
        "Compiled Learning",
        "Dynamic Learning",
      ],
      correctAnswer: "Supervised Learning",
      explanation:
        "The three major types of Machine Learning are Supervised Learning, Unsupervised Learning, and Reinforcement Learning.",
    },
  
    {
      difficulty: "Easy",
      question:
        "In supervised learning, the model is trained using?",
      options: [
        "Labeled data",
        "Unlabeled data",
        "Random data",
        "Encrypted data",
      ],
      correctAnswer: "Labeled data",
      explanation:
        "Supervised learning uses labeled datasets where the expected output is already known.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which algorithm is commonly used for classification?",
      options: [
        "Logistic Regression",
        "K-Means",
        "Apriori",
        "PCA",
      ],
      correctAnswer: "Logistic Regression",
      explanation:
        "Logistic Regression is a supervised learning algorithm mainly used for classification problems.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which algorithm is commonly used for clustering?",
      options: [
        "K-Means",
        "Linear Regression",
        "Decision Tree",
        "Random Forest",
      ],
      correctAnswer: "K-Means",
      explanation:
        "K-Means is an unsupervised learning algorithm used for grouping similar data points into clusters.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which Python library is commonly used for Machine Learning?",
      options: [
        "Scikit-learn",
        "Bootstrap",
        "Express",
        "Spring",
      ],
      correctAnswer: "Scikit-learn",
      explanation:
        "Scikit-learn provides many machine learning algorithms and tools for data preprocessing and evaluation.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which evaluation metric is commonly used for regression problems?",
      options: [
        "Mean Squared Error (MSE)",
        "Accuracy",
        "Precision",
        "Recall",
      ],
      correctAnswer: "Mean Squared Error (MSE)",
      explanation:
        "MSE measures the average squared difference between predicted and actual values.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which evaluation metric is commonly used for classification problems?",
      options: [
        "Accuracy",
        "Mean Squared Error",
        "Variance",
        "Standard Deviation",
      ],
      correctAnswer: "Accuracy",
      explanation:
        "Accuracy measures the percentage of correctly classified predictions.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which learning type does not require labeled data?",
      options: [
        "Unsupervised Learning",
        "Supervised Learning",
        "Semi-supervised Learning",
        "Transfer Learning",
      ],
      correctAnswer: "Unsupervised Learning",
      explanation:
        "Unsupervised learning discovers hidden patterns from datasets without predefined labels.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which of the following is an example of supervised learning?",
      options: [
        "Spam Email Detection",
        "Customer Segmentation",
        "Market Basket Analysis",
        "Topic Modeling",
      ],
      correctAnswer: "Spam Email Detection",
      explanation:
        "Spam detection is a supervised classification problem because emails are labeled as spam or not spam.",
    },
      // =========================================
  // Medium Questions
  // =========================================

  {
    difficulty: "Medium",
    question:
      "What is overfitting in Machine Learning?",
    options: [
      "When a model performs well on training data but poorly on unseen data",
      "When a model performs equally well on all datasets",
      "When a model has too little data",
      "When a model trains very quickly",
    ],
    correctAnswer:
      "When a model performs well on training data but poorly on unseen data",
    explanation:
      "Overfitting occurs when a model learns the training data too closely, including noise, and fails to generalize on new data.",
  },

  {
    difficulty: "Medium",
    question:
      "What is underfitting in Machine Learning?",
    options: [
      "When a model is too simple to capture data patterns",
      "When a model memorizes training data",
      "When a model has high accuracy",
      "When a model uses too many features",
    ],
    correctAnswer:
      "When a model is too simple to capture data patterns",
    explanation:
      "Underfitting happens when a model is unable to learn important relationships from the training data.",
  },

  {
    difficulty: "Medium",
    question:
      "Which technique is commonly used to evaluate model performance on unseen data?",
    options: [
      "Cross Validation",
      "Feature Scaling",
      "Normalization",
      "Encoding",
    ],
    correctAnswer: "Cross Validation",
    explanation:
      "Cross-validation divides the dataset into multiple subsets to test how well a model performs on unseen data.",
  },

  {
    difficulty: "Medium",
    question:
      "Which preprocessing technique scales feature values to a common range?",
    options: [
      "Normalization",
      "Clustering",
      "Sampling",
      "Regression",
    ],
    correctAnswer: "Normalization",
    explanation:
      "Normalization rescales numerical features, commonly into a range between 0 and 1.",
  },

  {
    difficulty: "Medium",
    question:
      "Which preprocessing technique transforms data to have mean 0 and standard deviation 1?",
    options: [
      "Standardization",
      "Normalization",
      "Encoding",
      "Sampling",
    ],
    correctAnswer: "Standardization",
    explanation:
      "Standardization converts features into z-scores using the mean and standard deviation.",
  },

  {
    difficulty: "Medium",
    question:
      "Which matrix summarizes True Positive, False Positive, True Negative, and False Negative values?",
    options: [
      "Confusion Matrix",
      "Correlation Matrix",
      "Covariance Matrix",
      "Identity Matrix",
    ],
    correctAnswer: "Confusion Matrix",
    explanation:
      "A confusion matrix evaluates classification models by comparing predicted values with actual labels.",
  },

  {
    difficulty: "Medium",
    question:
      "Which metric measures the proportion of predicted positive cases that are actually positive?",
    options: [
      "Precision",
      "Recall",
      "Accuracy",
      "F1 Score",
    ],
    correctAnswer: "Precision",
    explanation:
      "Precision = TP / (TP + FP). It measures how many predicted positive cases are actually correct.",
  },

  {
    difficulty: "Medium",
    question:
      "Which metric measures the proportion of actual positive cases correctly identified?",
    options: [
      "Recall",
      "Precision",
      "Accuracy",
      "Specificity",
    ],
    correctAnswer: "Recall",
    explanation:
      "Recall = TP / (TP + FN). It measures the ability of a model to detect actual positive cases.",
  },

  {
    difficulty: "Medium",
    question:
      "Which optimization algorithm is commonly used to minimize the loss function during training?",
    options: [
      "Gradient Descent",
      "K-Means",
      "Apriori",
      "DBSCAN",
    ],
    correctAnswer: "Gradient Descent",
    explanation:
      "Gradient Descent updates model parameters iteratively to reduce the error or loss function.",
  },

  {
    difficulty: "Medium",
    question:
      "Which technique helps reduce overfitting by adding penalties to large model weights?",
    options: [
      "Regularization",
      "Clustering",
      "Bootstrapping",
      "Normalization",
    ],
    correctAnswer: "Regularization",
    explanation:
      "Regularization techniques like L1 and L2 reduce model complexity and improve generalization.",
  },
    // =========================================
  // Hard Questions
  // =========================================

  {
    difficulty: "Hard",
    question:
      "What is the primary purpose of Principal Component Analysis (PCA)?",
    options: [
      "Reduce the dimensionality of data while preserving important information",
      "Increase the number of features",
      "Perform classification",
      "Normalize data",
    ],
    correctAnswer:
      "Reduce the dimensionality of data while preserving important information",
    explanation:
      "PCA transforms high-dimensional data into fewer dimensions while preserving maximum variance and important patterns.",
  },

  {
    difficulty: "Hard",
    question:
      "Which ensemble learning technique trains multiple models independently and combines their predictions?",
    options: [
      "Bagging",
      "Boosting",
      "Stacking",
      "Gradient Descent",
    ],
    correctAnswer: "Bagging",
    explanation:
      "Bagging trains multiple models independently on different subsets of data and combines their predictions to improve stability.",
  },

  {
    difficulty: "Hard",
    question:
      "Random Forest is an example of which Machine Learning technique?",
    options: [
      "Ensemble Learning",
      "Clustering",
      "Dimensionality Reduction",
      "Reinforcement Learning",
    ],
    correctAnswer: "Ensemble Learning",
    explanation:
      "Random Forest combines multiple decision trees using ensemble learning to improve accuracy and reduce overfitting.",
  },

  {
    difficulty: "Hard",
    question:
      "What is the key idea behind Boosting algorithms such as AdaBoost and XGBoost?",
    options: [
      "Train models sequentially, where each model corrects errors made by previous models",
      "Train all models independently",
      "Reduce the number of training samples",
      "Replace decision trees with neural networks",
    ],
    correctAnswer:
      "Train models sequentially, where each model corrects errors made by previous models",
    explanation:
      "Boosting creates strong learners by training models sequentially and focusing on previous mistakes.",
  },

  {
    difficulty: "Hard",
    question:
      "What is backpropagation primarily used for in neural networks?",
    options: [
      "Updating weights using the calculated error",
      "Reducing the dataset size",
      "Initializing model parameters",
      "Splitting training data",
    ],
    correctAnswer:
      "Updating weights using the calculated error",
    explanation:
      "Backpropagation calculates gradients of the loss function and updates neural network weights during training.",
  },

  {
    difficulty: "Hard",
    question:
      "Which activation function is commonly used in deep neural networks because it helps reduce the vanishing gradient problem?",
    options: [
      "ReLU",
      "Sigmoid",
      "Softmax",
      "Linear",
    ],
    correctAnswer: "ReLU",
    explanation:
      "ReLU (Rectified Linear Unit) is widely used because it improves training speed and reduces the vanishing gradient issue.",
  },

  {
    difficulty: "Hard",
    question:
      "Which evaluation metric measures the area under the Receiver Operating Characteristic curve?",
    options: [
      "ROC-AUC",
      "F1 Score",
      "Precision",
      "Mean Absolute Error",
    ],
    correctAnswer: "ROC-AUC",
    explanation:
      "ROC-AUC evaluates how well a classification model separates positive and negative classes.",
  },

  {
    difficulty: "Hard",
    question:
      "Which type of Machine Learning learns by interacting with an environment and receiving rewards or penalties?",
    options: [
      "Reinforcement Learning",
      "Supervised Learning",
      "Unsupervised Learning",
      "Transfer Learning",
    ],
    correctAnswer: "Reinforcement Learning",
    explanation:
      "Reinforcement Learning trains an agent to make decisions by maximizing rewards through interaction with an environment.",
  },

  {
    difficulty: "Hard",
    question:
      "Which loss function is commonly used for binary classification problems?",
    options: [
      "Binary Cross-Entropy",
      "Mean Squared Error",
      "Huber Loss",
      "Hinge Loss",
    ],
    correctAnswer: "Binary Cross-Entropy",
    explanation:
      "Binary Cross-Entropy measures the difference between predicted probabilities and actual binary labels.",
  },

  {
    difficulty: "Hard",
    question:
      "What is the primary goal of feature engineering in Machine Learning?",
    options: [
      "Create and transform meaningful features to improve model performance",
      "Reduce the size of the database",
      "Increase the number of classes",
      "Replace the learning algorithm",
    ],
    correctAnswer:
      "Create and transform meaningful features to improve model performance",
    explanation:
      "Feature engineering improves model performance by selecting, creating, and transforming useful input features.",
  },

];