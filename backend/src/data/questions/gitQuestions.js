export const gitQuestions = [
    // =========================================
    // Easy Questions
    // =========================================
  
    {
      difficulty: "Easy",
      question:
        "What is Git?",
      options: [
        "A distributed version control system",
        "A programming language",
        "A database management system",
        "A web server",
      ],
      correctAnswer: "A distributed version control system",
      explanation:
        "Git is a distributed version control system used to track changes in source code during software development.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command initializes a new Git repository?",
      options: [
        "git init",
        "git start",
        "git create",
        "git new",
      ],
      correctAnswer: "git init",
      explanation:
        "The git init command creates a new Git repository in the current directory.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command checks the current status of a Git repository?",
      options: [
        "git status",
        "git state",
        "git info",
        "git check",
      ],
      correctAnswer: "git status",
      explanation:
        "git status displays staged, unstaged, and untracked files.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command stages all modified files for commit?",
      options: [
        "git add .",
        "git commit",
        "git push",
        "git stage",
      ],
      correctAnswer: "git add .",
      explanation:
        "git add . stages all modified and new files in the current directory.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command saves staged changes to the repository?",
      options: [
        "git commit",
        "git push",
        "git save",
        "git upload",
      ],
      correctAnswer: "git commit",
      explanation:
        "git commit records staged changes in the local repository history.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command uploads local commits to a remote repository?",
      options: [
        "git push",
        "git upload",
        "git publish",
        "git send",
      ],
      correctAnswer: "git push",
      explanation:
        "git push sends local commits to a remote repository such as GitHub.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command downloads the latest changes from a remote repository?",
      options: [
        "git pull",
        "git fetch",
        "git clone",
        "git merge",
      ],
      correctAnswer: "git pull",
      explanation:
        "git pull fetches and merges changes from a remote repository into the current branch.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command creates a copy of a remote repository on your local machine?",
      options: [
        "git clone",
        "git copy",
        "git pull",
        "git fork",
      ],
      correctAnswer: "git clone",
      explanation:
        "git clone copies an existing remote repository to your local system.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which command displays the commit history?",
      options: [
        "git log",
        "git history",
        "git commits",
        "git show",
      ],
      correctAnswer: "git log",
      explanation:
        "git log displays the complete commit history of the repository.",
    },
  
    {
      difficulty: "Easy",
      question:
        "Which Git command creates a new branch?",
      options: [
        "git branch",
        "git checkout",
        "git switch",
        "git merge",
      ],
      correctAnswer: "git branch",
      explanation:
        "git branch creates a new branch without switching to it.",
    },
  
    // =========================================
    // Medium Questions
    // =========================================
    {
        difficulty: "Medium",
        question:
          "Which Git command switches to an existing branch?",
        options: [
          "git checkout",
          "git merge",
          "git branch",
          "git init",
        ],
        correctAnswer: "git checkout",
        explanation:
          "The git checkout command switches the working directory to another existing branch.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command creates and switches to a new branch in one step?",
        options: [
          "git checkout -b",
          "git branch -a",
          "git switch",
          "git merge",
        ],
        correctAnswer: "git checkout -b",
        explanation:
          "git checkout -b creates a new branch and immediately switches to it.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command temporarily saves uncommitted changes without committing them?",
        options: [
          "git stash",
          "git save",
          "git backup",
          "git commit --temp",
        ],
        correctAnswer: "git stash",
        explanation:
          "git stash temporarily stores uncommitted changes and restores a clean working directory.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command lists all local branches?",
        options: [
          "git branch",
          "git log",
          "git show",
          "git status",
        ],
        correctAnswer: "git branch",
        explanation:
          "git branch displays all local branches and highlights the current branch.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command is used to merge one branch into another?",
        options: [
          "git merge",
          "git rebase",
          "git pull",
          "git fetch",
        ],
        correctAnswer: "git merge",
        explanation:
          "git merge combines the history of another branch into the current branch.",
      },
    
      {
        difficulty: "Medium",
        question:
          "What is the primary purpose of git fetch?",
        options: [
          "Download remote changes without merging them",
          "Upload commits to GitHub",
          "Delete remote branches",
          "Create a new repository",
        ],
        correctAnswer: "Download remote changes without merging them",
        explanation:
          "git fetch downloads new commits from the remote repository but does not merge them automatically.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command removes a local branch?",
        options: [
          "git branch -d",
          "git delete",
          "git remove",
          "git branch --remove",
        ],
        correctAnswer: "git branch -d",
        explanation:
          "git branch -d safely deletes a local branch that has already been merged.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command displays differences between files or commits?",
        options: [
          "git diff",
          "git compare",
          "git changes",
          "git status",
        ],
        correctAnswer: "git diff",
        explanation:
          "git diff shows line-by-line differences between working tree, staging area, and commits.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command shows information about a specific commit?",
        options: [
          "git show",
          "git log",
          "git diff",
          "git inspect",
        ],
        correctAnswer: "git show",
        explanation:
          "git show displays detailed information about a commit, including changes and metadata.",
      },
    
      {
        difficulty: "Medium",
        question:
          "Which Git command downloads a remote repository without creating a new commit?",
        options: [
          "git fetch",
          "git pull",
          "git clone",
          "git merge",
        ],
        correctAnswer: "git fetch",
        explanation:
          "git fetch retrieves updates from the remote repository without modifying the current branch.",
      },
    
      // =========================================
      // Hard Questions
      // =========================================
      {
        difficulty: "Hard",
        question:
          "What is the primary purpose of git rebase?",
        options: [
          "To move or replay commits onto another base branch",
          "To delete commit history",
          "To merge two repositories",
          "To create a remote branch",
        ],
        correctAnswer: "To move or replay commits onto another base branch",
        explanation:
          "git rebase rewrites commit history by replaying commits on top of another branch, creating a cleaner linear history.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which Git command applies a specific commit from one branch onto another?",
        options: [
          "git cherry-pick",
          "git merge",
          "git rebase",
          "git apply",
        ],
        correctAnswer: "git cherry-pick",
        explanation:
          "git cherry-pick copies an individual commit from one branch and applies it to another branch.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which Git command safely undoes a commit by creating a new commit?",
        options: [
          "git revert",
          "git reset",
          "git restore",
          "git checkout",
        ],
        correctAnswer: "git revert",
        explanation:
          "git revert creates a new commit that reverses the changes introduced by a previous commit without modifying history.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which Git command rewrites history by moving the branch pointer to a previous commit?",
        options: [
          "git reset",
          "git revert",
          "git restore",
          "git clean",
        ],
        correctAnswer: "git reset",
        explanation:
          "git reset moves the current branch to another commit and can modify the staging area and working directory depending on the mode used.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What does HEAD represent in Git?",
        options: [
          "The currently checked-out commit or branch",
          "The first commit in the repository",
          "The remote repository",
          "The latest merged branch",
        ],
        correctAnswer: "The currently checked-out commit or branch",
        explanation:
          "HEAD is a pointer that references the current branch or commit you are working on.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is a detached HEAD state in Git?",
        options: [
          "HEAD points directly to a commit instead of a branch",
          "The repository has no commits",
          "The remote repository is disconnected",
          "The current branch has been deleted",
        ],
        correctAnswer: "HEAD points directly to a commit instead of a branch",
        explanation:
          "In a detached HEAD state, commits can be made but are not associated with any branch unless a new branch is created.",
      },
    
      {
        difficulty: "Hard",
        question:
          "Which Git feature is commonly used to mark release versions such as v1.0.0?",
        options: [
          "Tags",
          "Branches",
          "Stash",
          "Forks",
        ],
        correctAnswer: "Tags",
        explanation:
          "Git tags are lightweight references typically used to identify release versions.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What usually causes a merge conflict in Git?",
        options: [
          "The same lines of a file are modified in different branches",
          "A repository has too many commits",
          "GitHub is offline",
          "A branch contains only one commit",
        ],
        correctAnswer: "The same lines of a file are modified in different branches",
        explanation:
          "Merge conflicts occur when Git cannot automatically determine which changes should be kept.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the purpose of interactive rebase (git rebase -i)?",
        options: [
          "To edit, squash, reorder, or remove commits before sharing history",
          "To delete a repository",
          "To clone a repository",
          "To merge remote branches automatically",
        ],
        correctAnswer: "To edit, squash, reorder, or remove commits before sharing history",
        explanation:
          "Interactive rebase helps maintain a clean commit history by allowing commits to be modified before pushing.",
      },
    
      {
        difficulty: "Hard",
        question:
          "What is the recommended Git workflow before opening a Pull Request?",
        options: [
          "Create a feature branch, commit changes, push the branch, and open a Pull Request",
          "Commit directly to the main branch",
          "Delete the main branch",
          "Run git init again",
        ],
        correctAnswer: "Create a feature branch, commit changes, push the branch, and open a Pull Request",
        explanation:
          "Using feature branches keeps the main branch stable and enables proper code review through Pull Requests.",
      },
    
    ];