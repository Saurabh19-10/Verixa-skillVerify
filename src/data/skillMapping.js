export const skillMapping = {
    java: "Java",
    corejava: "Java",
  
    javascript: "JavaScript",
    js: "JavaScript",
    es6: "JavaScript",
  
    react: "React",
    reactjs: "React",
  
    mongodb: "MongoDB",
    mongo: "MongoDB",
  
    node: "Node.js",
    nodejs: "Node.js",
  
    express: "Express.js",
    expressjs: "Express.js",
  
    html: "HTML",
    html5: "HTML",
  
    css: "CSS",
    css3: "CSS",
  
    sql: "SQL",
    mysql: "SQL",
  
    python: "Python",
    py: "Python",
  
    git: "Git",
    github: "Git",
  };
  
  export const normalizeSkillName = (skill = "") => {
    const key = skill
      .toString()
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, "")
      .trim();
  
    return skillMapping[key] || skill.trim();
  };
  
  export const getSupportedSkills = () => {
    return [...new Set(Object.values(skillMapping))];
  };