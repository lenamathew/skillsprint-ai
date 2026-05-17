import { useState } from 'react';
import './App.css';

function App() {
  const [resumeInput, setResumeInput] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const analyzeContent = (text) => {
    const lowerText = text.toLowerCase();
    const skills = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'vite', 'next.js', 'nuxt'],
      backend: ['node.js', 'python', 'java', 'spring', 'spring boot', 'django', 'express', 'flask', 'fastapi', '.net', 'go', 'rust', 'php', 'laravel'],
      database: ['mongodb', 'postgresql', 'mysql', 'redis', 'sqlite', 'dynamodb', 'cassandra', 'firebase'],
      cloud: ['aws', 'azure', 'docker', 'kubernetes', 'gcp', 'heroku', 'vercel', 'netlify', 'ci/cd', 'jenkins'],
      tools: ['git', 'github', 'gitlab', 'jira', 'postman', 'figma', 'linux', 'bash'],
      testing: ['jest', 'mocha', 'pytest', 'junit', 'selenium', 'cypress'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios']
    };

    const detectedSkills = {};
    Object.keys(skills).forEach(category => {
      detectedSkills[category] = skills[category].filter(skill => lowerText.includes(skill));
    });

    const hasInternship = lowerText.includes('intern');
    const hasYearsExp = lowerText.match(/(\d+)\s*year/i);
    const experienceYears = hasYearsExp ? parseInt(hasYearsExp[1]) : 0;
    const projectCount = (lowerText.match(/project/gi) || []).length;
    
    // Detect education level
    const hasBachelor = lowerText.includes('b.tech') || lowerText.includes('bachelor') || lowerText.includes('b.e') || lowerText.includes('bsc');
    const hasMaster = lowerText.includes('master') || lowerText.includes('m.tech') || lowerText.includes('msc');
    
    // Detect certifications
    const hasCertifications = lowerText.includes('certified') || lowerText.includes('certification');
    
    // Detect soft skills
    const softSkills = ['leadership', 'communication', 'teamwork', 'problem solving', 'agile', 'scrum'];
    const detectedSoftSkills = softSkills.filter(skill => lowerText.includes(skill));

    return {
      detectedSkills,
      hasInternship,
      experienceYears,
      projectCount,
      isEmpty: text.trim().length === 0,
      hasBachelor,
      hasMaster,
      hasCertifications,
      detectedSoftSkills,
      resumeText: text
    };
  };

  const generateResumeAnalysis = (analysis) => {
    if (analysis.isEmpty) return '⚠️ Please enter your resume to get analysis.';
    
    const allSkills = Object.values(analysis.detectedSkills).flat();
    let output = '📊 AI RESUME ANALYSIS\n\n';
    
    // SKILLS DETECTED
    output += '✅ SKILLS DETECTED:\n';
    if (allSkills.length > 0) {
      Object.entries(analysis.detectedSkills).forEach(([cat, skills]) => {
        if (skills.length > 0) {
          output += `• ${cat.toUpperCase()}: ${skills.join(', ')}\n`;
        }
      });
      output += `\nTotal Skills: ${allSkills.length}\n`;
    } else {
      output += '• No technical skills detected\n';
    }

    // STRENGTHS
    output += '\n💪 STRENGTHS:\n';
    const strengths = [];
    if (allSkills.length >= 8) strengths.push('Strong technical skill diversity');
    if (analysis.projectCount >= 3) strengths.push(`Good portfolio with ${analysis.projectCount} projects`);
    if (analysis.experienceYears >= 2) strengths.push(`${analysis.experienceYears} years of professional experience`);
    if (analysis.detectedSkills.frontend?.length >= 3) strengths.push('Strong frontend expertise');
    if (analysis.detectedSkills.backend?.length >= 2) strengths.push('Backend development capabilities');
    if (analysis.detectedSkills.cloud?.length >= 2) strengths.push('Cloud & DevOps knowledge');
    if (analysis.hasCertifications) strengths.push('Industry certifications');
    if (analysis.detectedSoftSkills.length >= 2) strengths.push('Good soft skills mentioned');
    
    if (strengths.length > 0) {
      strengths.forEach((s, i) => output += `${i + 1}. ${s}\n`);
    } else {
      output += '• Building foundation - keep learning!\n';
    }

    // WEAKNESSES
    output += '\n⚠️ AREAS FOR IMPROVEMENT:\n';
    const weaknesses = [];
    if (allSkills.length < 5) weaknesses.push('Limited technical skills - expand your toolkit');
    if (analysis.projectCount < 3) weaknesses.push('Need more portfolio projects (aim for 3-5)');
    if (!analysis.hasInternship && analysis.experienceYears === 0) weaknesses.push('No professional experience - seek internships');
    if (!analysis.detectedSkills.database || analysis.detectedSkills.database.length === 0) weaknesses.push('No database skills mentioned');
    if (!analysis.detectedSkills.cloud || analysis.detectedSkills.cloud.length === 0) weaknesses.push('Missing cloud/DevOps skills');
    if (!analysis.detectedSkills.testing || analysis.detectedSkills.testing.length === 0) weaknesses.push('No testing frameworks mentioned');
    if (analysis.detectedSoftSkills.length === 0) weaknesses.push('Add soft skills (leadership, communication, teamwork)');
    if (!analysis.hasBachelor && !analysis.hasMaster) weaknesses.push('Education section could be clearer');
    
    if (weaknesses.length > 0) {
      weaknesses.forEach((w, i) => output += `${i + 1}. ${w}\n`);
    } else {
      output += '• Strong profile overall!\n';
    }

    // MISSING INDUSTRY SKILLS
    output += '\n🎯 MISSING INDUSTRY SKILLS:\n';
    const missingSkills = [];
    if (!analysis.detectedSkills.tools?.includes('git')) missingSkills.push('Git/Version Control');
    if (!analysis.detectedSkills.cloud?.some(s => ['docker', 'kubernetes'].includes(s))) missingSkills.push('Docker/Kubernetes');
    if (!analysis.detectedSkills.testing || analysis.detectedSkills.testing.length === 0) missingSkills.push('Testing (Jest, Pytest, JUnit)');
    if (!analysis.detectedSkills.database || analysis.detectedSkills.database.length < 2) missingSkills.push('Multiple Database Systems');
    if (!analysis.resumeText.toLowerCase().includes('api')) missingSkills.push('REST API Development');
    if (!analysis.resumeText.toLowerCase().includes('agile') && !analysis.resumeText.toLowerCase().includes('scrum')) missingSkills.push('Agile/Scrum Methodology');
    
    if (missingSkills.length > 0) {
      missingSkills.forEach((s, i) => output += `${i + 1}. ${s}\n`);
    } else {
      output += '• Comprehensive skill coverage!\n';
    }

    // RESUME IMPROVEMENT SUGGESTIONS
    output += '\n📝 RESUME IMPROVEMENT SUGGESTIONS:\n';
    const suggestions = [];
    suggestions.push('Use action verbs (Built, Developed, Implemented, Designed)');
    suggestions.push('Quantify achievements (e.g., "Improved performance by 40%")');
    if (analysis.projectCount > 0) suggestions.push('Add GitHub links to your projects');
    suggestions.push('Include tech stack for each project/experience');
    if (!analysis.resumeText.toLowerCase().includes('http')) suggestions.push('Add portfolio website or LinkedIn URL');
    suggestions.push('Keep resume to 1-2 pages maximum');
    suggestions.push('Use consistent formatting and bullet points');
    if (analysis.experienceYears === 0 && !analysis.hasInternship) suggestions.push('Add relevant coursework or academic projects');
    
    suggestions.forEach((s, i) => output += `${i + 1}. ${s}\n`);

    // INTERNSHIP READINESS
    output += '\n🚀 INTERNSHIP READINESS:\n';
    let readinessScore = 0;
    if (allSkills.length >= 5) readinessScore += 25;
    else if (allSkills.length >= 3) readinessScore += 15;
    
    if (analysis.projectCount >= 3) readinessScore += 30;
    else if (analysis.projectCount >= 1) readinessScore += 15;
    
    if (analysis.hasInternship || analysis.experienceYears > 0) readinessScore += 25;
    
    if (analysis.hasBachelor || analysis.hasMaster) readinessScore += 10;
    
    if (analysis.detectedSoftSkills.length >= 2) readinessScore += 10;
    
    output += `Readiness Score: ${readinessScore}/100\n`;
    
    if (readinessScore >= 70) {
      output += '✅ Status: Ready for internships!\n';
      output += '💡 Action: Start applying to companies\n';
    } else if (readinessScore >= 50) {
      output += '⚠️ Status: Almost ready - needs improvement\n';
      output += '💡 Action: Build 1-2 more projects and strengthen skills\n';
    } else {
      output += '❌ Status: Needs significant preparation\n';
      output += '💡 Action: Focus on learning fundamentals and building projects\n';
    }

    return output;
  };

  const generateRoadmap = (analysis) => {
    if (analysis.isEmpty) return '⚠️ Please enter your resume to generate roadmap.';
    
    const allSkills = Object.values(analysis.detectedSkills).flat();
    const hasReact = analysis.detectedSkills.frontend?.includes('react');
    const hasJava = analysis.detectedSkills.backend?.includes('java');
    const hasPython = analysis.detectedSkills.backend?.includes('python');
    const hasNode = analysis.detectedSkills.backend?.includes('node.js');
    const isAdvanced = allSkills.length > 8 || analysis.experienceYears >= 2;
    
    let output = '🗺️ PERSONALIZED CAREER ROADMAP\n\n';
    output += `🎯 Your Profile: ${isAdvanced ? 'Advanced' : 'Intermediate'} Developer\n`;
    output += `📊 Current Level: ${analysis.experienceYears >= 2 ? 'Mid-Level' : analysis.experienceYears >= 1 ? 'Junior' : 'Entry-Level'}\n`;
    output += `💼 Focus Area: ${hasReact ? 'Frontend (React)' : hasJava ? 'Backend (Java)' : hasPython ? 'Backend (Python)' : 'Full-Stack'} Development\n\n`;
    
    // REACT-SPECIFIC ROADMAP
    if (hasReact) {
      output += '═══════════════════════════════════════\n';
      output += '🎨 REACT DEVELOPER ROADMAP\n';
      output += '═══════════════════════════════════════\n\n';
      
      output += '📅 PHASE 1 (Weeks 1-4): Advanced React Concepts\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Core Concepts:                      │\n';
      output += '│ • Custom Hooks (useDebounce, etc.)  │\n';
      output += '│ • Context API + useReducer patterns │\n';
      output += '│ • React.memo, useMemo, useCallback  │\n';
      output += '│ • Error Boundaries & Suspense       │\n';
      output += '│                                     │\n';
      output += '│ Technologies to Learn:              │\n';
      output += '│ • React Query / TanStack Query      │\n';
      output += '│ • Zustand or Redux Toolkit          │\n';
      output += '│ • React Router v6                   │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. Real-time Chat App (Socket.io)  │\n';
      output += '│ 2. E-commerce Dashboard            │\n';
      output += '│ 3. Social Media Feed with infinite │\n';
      output += '│    scroll & optimistic updates     │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 2 (Weeks 5-8): Backend Integration & APIs\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Backend Skills:                     │\n';
      output += '│ • REST API consumption              │\n';
      output += '│ • GraphQL with Apollo Client        │\n';
      output += '│ • Authentication (JWT, OAuth)       │\n';
      output += '│ • File uploads & image handling     │\n';
      output += '│                                     │\n';
      output += '│ Learn:                              │\n';
      output += '│ • Node.js + Express basics          │\n';
      output += '│ • MongoDB or PostgreSQL             │\n';
      output += '│ • API design principles             │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. Full-stack Blog with CMS        │\n';
      output += '│ 2. Task Management App (MERN)      │\n';
      output += '│ 3. Video Streaming Platform         │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 3 (Weeks 9-12): Deployment & Advanced Topics\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ DevOps & Deployment:                │\n';
      output += '│ • Vercel / Netlify deployment       │\n';
      output += '│ • Docker containerization           │\n';
      output += '│ • CI/CD with GitHub Actions         │\n';
      output += '│ • Environment variables & secrets   │\n';
      output += '│                                     │\n';
      output += '│ Advanced Topics:                    │\n';
      output += '│ • Next.js (SSR, SSG, ISR)          │\n';
      output += '│ • TypeScript integration            │\n';
      output += '│ • Testing (Jest, React Testing Lib) │\n';
      output += '│ • Performance optimization          │\n';
      output += '│                                     │\n';
      output += '│ AI Integration Ideas:               │\n';
      output += '│ 1. ChatGPT-powered chatbot          │\n';
      output += '│ 2. AI image generator (DALL-E API)  │\n';
      output += '│ 3. Smart recommendation system      │\n';
      output += '└─────────────────────────────────────┘\n\n';
    }
    
    // JAVA-SPECIFIC ROADMAP
    else if (hasJava) {
      output += '═══════════════════════════════════════\n';
      output += '☕ JAVA BACKEND DEVELOPER ROADMAP\n';
      output += '═══════════════════════════════════════\n\n';
      
      output += '📅 PHASE 1 (Weeks 1-4): Spring Boot Mastery\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Core Concepts:                      │\n';
      output += '│ • Spring Boot fundamentals          │\n';
      output += '│ • Dependency Injection & IoC        │\n';
      output += '│ • Spring MVC architecture           │\n';
      output += '│ • RESTful API design                │\n';
      output += '│                                     │\n';
      output += '│ Technologies:                       │\n';
      output += '│ • Spring Boot 3.x                   │\n';
      output += '│ • Spring Data JPA                   │\n';
      output += '│ • Hibernate ORM                     │\n';
      output += '│ • Maven/Gradle                      │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. REST API for Library Management  │\n';
      output += '│ 2. Employee Management System       │\n';
      output += '│ 3. Blog API with CRUD operations    │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 2 (Weeks 5-8): Database & Security\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Database Skills:                    │\n';
      output += '│ • MySQL/PostgreSQL advanced queries │\n';
      output += '│ • Database design & normalization   │\n';
      output += '│ • Transactions & ACID properties    │\n';
      output += '│ • Connection pooling                │\n';
      output += '│                                     │\n';
      output += '│ Security:                           │\n';
      output += '│ • Spring Security                   │\n';
      output += '│ • JWT authentication                │\n';
      output += '│ • OAuth 2.0 & SSO                   │\n';
      output += '│ • Password encryption (BCrypt)      │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. E-commerce Backend with Auth     │\n';
      output += '│ 2. Banking System API               │\n';
      output += '│ 3. Multi-tenant SaaS application    │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 3 (Weeks 9-12): Microservices & DSA\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Microservices:                      │\n';
      output += '│ • Spring Cloud                      │\n';
      output += '│ • Service discovery (Eureka)        │\n';
      output += '│ • API Gateway                       │\n';
      output += '│ • Message queues (RabbitMQ/Kafka)   │\n';
      output += '│                                     │\n';
      output += '│ DSA Practice (LeetCode/HackerRank): │\n';
      output += '│ • Arrays & Strings (50 problems)    │\n';
      output += '│ • LinkedList & Trees (40 problems)  │\n';
      output += '│ • Dynamic Programming (30 problems) │\n';
      output += '│ • System Design basics              │\n';
      output += '│                                     │\n';
      output += '│ Deployment:                         │\n';
      output += '│ • Docker containerization           │\n';
      output += '│ • AWS EC2/ECS deployment            │\n';
      output += '│ • CI/CD with Jenkins                │\n';
      output += '└─────────────────────────────────────┘\n\n';
    }
    
    // PYTHON-SPECIFIC ROADMAP
    else if (hasPython) {
      output += '═══════════════════════════════════════\n';
      output += '🐍 PYTHON DEVELOPER ROADMAP\n';
      output += '═══════════════════════════════════════\n\n';
      
      output += '📅 PHASE 1 (Weeks 1-4): Backend Frameworks\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Framework Mastery:                  │\n';
      output += '│ • Django REST Framework             │\n';
      output += '│ • FastAPI for modern APIs           │\n';
      output += '│ • Flask for microservices           │\n';
      output += '│ • SQLAlchemy ORM                    │\n';
      output += '│                                     │\n';
      output += '│ Core Concepts:                      │\n';
      output += '│ • Async/await programming           │\n';
      output += '│ • Decorators & context managers     │\n';
      output += '│ • Type hints & Pydantic             │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. FastAPI Blog with Auth           │\n';
      output += '│ 2. Django E-commerce Platform       │\n';
      output += '│ 3. REST API for IoT devices         │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 2 (Weeks 5-8): Data & AI Integration\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Data Science Skills:                │\n';
      output += '│ • Pandas for data manipulation      │\n';
      output += '│ • NumPy for numerical computing     │\n';
      output += '│ • Data visualization (Matplotlib)   │\n';
      output += '│                                     │\n';
      output += '│ AI/ML Integration:                  │\n';
      output += '│ • OpenAI API integration            │\n';
      output += '│ • LangChain for LLM apps            │\n';
      output += '│ • Scikit-learn basics               │\n';
      output += '│ • Computer Vision (OpenCV)          │\n';
      output += '│                                     │\n';
      output += '│ Project Ideas:                      │\n';
      output += '│ 1. AI Chatbot with RAG              │\n';
      output += '│ 2. Image Classification API         │\n';
      output += '│ 3. Sentiment Analysis Dashboard     │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 3 (Weeks 9-12): Production & Scale\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Production Skills:                  │\n';
      output += '│ • Celery for background tasks       │\n';
      output += '│ • Redis caching                     │\n';
      output += '│ • PostgreSQL optimization           │\n';
      output += '│ • API rate limiting                 │\n';
      output += '│                                     │\n';
      output += '│ Testing & Quality:                  │\n';
      output += '│ • Pytest for unit testing           │\n';
      output += '│ • Code coverage & linting           │\n';
      output += '│ • Load testing (Locust)             │\n';
      output += '│                                     │\n';
      output += '│ Deployment:                         │\n';
      output += '│ • Docker + Docker Compose           │\n';
      output += '│ • AWS Lambda serverless             │\n';
      output += '│ • Heroku/Railway deployment         │\n';
      output += '└─────────────────────────────────────┘\n\n';
    }
    
    // GENERIC FULL-STACK ROADMAP
    else {
      output += '═══════════════════════════════════════\n';
      output += '🚀 FULL-STACK DEVELOPER ROADMAP\n';
      output += '═══════════════════════════════════════\n\n';
      
      output += '📅 PHASE 1 (Weeks 1-4): Foundation Building\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Frontend Essentials:                │\n';
      output += '│ • HTML5, CSS3, JavaScript ES6+      │\n';
      output += '│ • React.js fundamentals             │\n';
      output += '│ • Responsive design & Flexbox/Grid  │\n';
      output += '│ • Tailwind CSS or Bootstrap         │\n';
      output += '│                                     │\n';
      output += '│ Backend Basics:                     │\n';
      output += '│ • Node.js + Express.js              │\n';
      output += '│ • RESTful API design                │\n';
      output += '│ • MongoDB basics                    │\n';
      output += '│                                     │\n';
      output += '│ Tools:                              │\n';
      output += '│ • Git & GitHub                      │\n';
      output += '│ • VS Code setup                     │\n';
      output += '│ • Postman for API testing           │\n';
      output += '│                                     │\n';
      output += '│ Project: Build a Todo App (MERN)    │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 2 (Weeks 5-8): Intermediate Skills\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Advanced Frontend:                  │\n';
      output += '│ • State management (Redux/Zustand)  │\n';
      output += '│ • React Router                      │\n';
      output += '│ • API integration & error handling  │\n';
      output += '│                                     │\n';
      output += '│ Backend Development:                │\n';
      output += '│ • Authentication (JWT, sessions)    │\n';
      output += '│ • Database relationships            │\n';
      output += '│ • File uploads & cloud storage      │\n';
      output += '│                                     │\n';
      output += '│ Projects:                           │\n';
      output += '│ 1. Social Media Clone               │\n';
      output += '│ 2. E-commerce Store                 │\n';
      output += '│ 3. Real-time Chat Application       │\n';
      output += '└─────────────────────────────────────┘\n\n';
      
      output += '📅 PHASE 3 (Weeks 9-12): Professional Level\n';
      output += '┌─────────────────────────────────────┐\n';
      output += '│ Production Skills:                  │\n';
      output += '│ • Docker & containerization         │\n';
      output += '│ • CI/CD pipelines                   │\n';
      output += '│ • Cloud deployment (AWS/Vercel)     │\n';
      output += '│ • Performance optimization          │\n';
      output += '│                                     │\n';
      output += '│ Testing:                            │\n';
      output += '│ • Unit testing (Jest)               │\n';
      output += '│ • Integration testing               │\n';
      output += '│ • E2E testing (Cypress)             │\n';
      output += '│                                     │\n';
      output += '│ Final Project:                      │\n';
      output += '│ Build a production-ready SaaS app   │\n';
      output += '│ with authentication, payments,      │\n';
      output += '│ and full deployment                 │\n';
      output += '└─────────────────────────────────────┘\n\n';
    }
    
    // COMMON RECOMMENDATIONS
    output += '💡 DAILY PRACTICE ROUTINE:\n';
    output += '• 2 hours: Coding/Building projects\n';
    output += '• 1 hour: DSA practice (LeetCode/HackerRank)\n';
    output += '• 30 min: Reading documentation/articles\n';
    output += '• 30 min: Contributing to open source\n\n';
    
    output += '📚 LEARNING RESOURCES:\n';
    output += '• Documentation: Official docs (best resource)\n';
    output += '• YouTube: Traversy Media, Web Dev Simplified\n';
    output += '• Courses: Udemy, freeCodeCamp, Coursera\n';
    output += '• Practice: LeetCode, HackerRank, CodeWars\n';
    output += '• Community: Dev.to, Stack Overflow, Reddit\n\n';
    
    output += '🎯 SUCCESS METRICS:\n';
    output += '• Complete 3-5 portfolio projects\n';
    output += '• Solve 100+ DSA problems\n';
    output += '• Contribute to 2-3 open source projects\n';
    output += '• Build strong GitHub profile\n';
    output += '• Network with 50+ developers on LinkedIn\n';
    
    return output;
  };

  const generateProjectSuggestions = (analysis) => {
    if (analysis.isEmpty) return '⚠️ Please enter your resume for project suggestions.';
    
    let output = '💡 Project Suggestions\n\n';
    const projects = [
      { title: '🎨 Collaboration Whiteboard', tech: 'React, WebSocket, Node.js', level: 'Intermediate' },
      { title: '🔐 Auth System', tech: 'Node.js, JWT, Redis', level: 'Advanced' },
      { title: '🛒 E-commerce Platform', tech: 'React, Node.js, MongoDB', level: 'Intermediate' },
      { title: '📝 Task Manager', tech: 'React, Express, PostgreSQL', level: 'Beginner' }
    ];
    
    projects.forEach((p, i) => {
      output += `${i + 1}. ${p.title}\n   Tech: ${p.tech}\n   Level: ${p.level}\n\n`;
    });
    
    output += '💪 TIPS:\n• Deploy all projects\n• Write good README\n• Add tests';
    return output;
  };

  const generateMockInterview = (analysis) => {
    if (analysis.isEmpty) return '⚠️ Please enter your resume for interview questions.';
    
    let output = '🎤 Mock Interview\n\n📋 TECHNICAL:\n\n';
    
    if (analysis.detectedSkills.frontend && analysis.detectedSkills.frontend.length > 0) {
      output += '1️⃣ React Question:\n   Q: "Explain useMemo vs useCallback"\n\n';
      output += '   💭 Points:\n   • useMemo for values\n   • useCallback for functions\n\n';
    }
    
    if (analysis.detectedSkills.backend && analysis.detectedSkills.backend.length > 0) {
      output += '2️⃣ Backend Question:\n   Q: "Design a scalable REST API"\n\n';
      output += '   💭 Points:\n   • Load balancing\n   • Caching strategy\n\n';
    }
    
    output += '3️⃣ Algorithm:\n   Q: "Find two numbers that sum to target"\n\n';
    output += '   💭 Approach:\n   • Brute force: O(n²)\n   • Optimized: O(n) hash map\n\n';
    
    output += '🗣️ BEHAVIORAL:\n';
    output += '1. Tell me about a challenging project\n';
    output += '2. How do you handle disagreements?\n';
    output += '3. Describe learning a new technology\n\n';
    
    output += '💡 TIPS:\n• Practice on whiteboard\n• Explain your thinking\n• Ask questions\n• Research the company';
    
    return output;
  };

  const handleAnalyze = (type) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeContent(resumeInput);
      let output = '';
      if (type === 'resume') output = generateResumeAnalysis(analysis);
      else if (type === 'roadmap') output = generateRoadmap(analysis);
      else if (type === 'projects') output = generateProjectSuggestions(analysis);
      else if (type === 'interview') output = generateMockInterview(analysis);
      else output = 'Analysis complete!';
      setAnalysisOutput(output);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileUpload(files[0]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileUpload(files[0]);
  };

  const handleFileUpload = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      alert('Please upload PDF, DOC, DOCX, or TXT file');
      return;
    }

    setUploadedFile(file);
    
    // Extract text from file
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      
      // For text files, use content directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setResumeInput(content);
      }
      // For PDF files, extract text (basic extraction)
      else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Note: This is a simplified approach. For production, use a library like pdf.js
        // For now, we'll show a message and use sample text as fallback
        alert('PDF text extraction: Please copy and paste your resume text into the textarea for best results.\n\nFor now, using sample data to demonstrate the feature.');
        const sampleText = 'John Doe - Software Engineer\n\nEXPERIENCE:\n• 2 years in React and Node.js\n• Built 5+ full-stack applications\n• E-commerce platform (10K+ users)\n\nSKILLS:\n• Frontend: React, TypeScript, JavaScript\n• Backend: Node.js, Express, Python\n• Database: MongoDB, PostgreSQL\n• Tools: Git, Docker, AWS\n\nPROJECTS:\n1. Chat App - React, Socket.io\n2. E-commerce - MERN Stack\n3. Task Manager - React, Express\n\nEDUCATION:\nB.Tech Computer Science (2020-2024)\n\nINTERNSHIP:\nSoftware Dev Intern at Tech Corp (2023)';
        setResumeInput(sampleText);
      }
      // For DOC/DOCX files
      else if (file.name.match(/\.(doc|docx)$/i)) {
        // Note: Extracting text from DOC/DOCX requires specialized libraries
        // For now, we'll show a message and use sample text as fallback
        alert('Word document detected: Please copy and paste your resume text into the textarea for best results.\n\nFor now, using sample data to demonstrate the feature.');
        const sampleText = 'John Doe - Software Engineer\n\nEXPERIENCE:\n• 2 years in React and Node.js\n• Built 5+ full-stack applications\n• E-commerce platform (10K+ users)\n\nSKILLS:\n• Frontend: React, TypeScript, JavaScript\n• Backend: Node.js, Express, Python\n• Database: MongoDB, PostgreSQL\n• Tools: Git, Docker, AWS\n\nPROJECTS:\n1. Chat App - React, Socket.io\n2. E-commerce - MERN Stack\n3. Task Manager - React, Express\n\nEDUCATION:\nB.Tech Computer Science (2020-2024)\n\nINTERNSHIP:\nSoftware Dev Intern at Tech Corp (2023)';
        setResumeInput(sampleText);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again or paste your resume text directly.');
    };
    
    // Read file as text
    reader.readAsText(file);
  };

  const removeFile = () => setUploadedFile(null);

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 AI-Powered Career Acceleration</div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">SkillSprint AI</span>
          </h1>
          <p className="hero-subtitle">
            Your intelligent career mentor that analyzes your skills, creates personalized roadmaps, 
            and prepares you for success in the tech industry
          </p>
          <button className="cta-button" onClick={() => document.getElementById('interactive').scrollIntoView({ behavior: 'smooth' })}>
            Get Started Free →
          </button>
        </div>
        <div className="hero-decoration">
          <div className="floating-card card-1">💼</div>
          <div className="floating-card card-2">🎯</div>
          <div className="floating-card card-3">🚀</div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Powerful Features to Accelerate Your Career</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Resume Analysis</h3>
            <p>AI-powered insights to optimize your resume and highlight your strengths effectively</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Personalized Roadmap</h3>
            <p>Custom learning paths tailored to your goals and current skill level</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Project Suggestions</h3>
            <p>Get relevant project ideas that showcase your skills to potential employers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Mock Interviews</h3>
            <p>Practice with AI-generated interview questions and get instant feedback</p>
          </div>
        </div>
      </section>

      <section className="interactive" id="interactive">
        <h2 className="section-title">Try It Now</h2>
        
        <div className="upload-section">
          <div 
            className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'uploaded' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="upload-success">
                <div className="success-icon">✓</div>
                <div className="file-info">
                  <p className="file-name">📄 {uploadedFile.name}</p>
                  <p className="file-size">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  <p className="success-message">Resume extracted successfully!</p>
                </div>
                <button className="remove-file-btn" onClick={removeFile}>Remove File</button>
              </div>
            ) : (
              <>
                <div className="upload-icon">📤</div>
                <h3>Upload Your Resume</h3>
                <p>Drag and drop your resume here, or click to browse</p>
                <p className="upload-hint">Supports PDF, DOC, DOCX, TXT</p>
                <input type="file" id="file-input" className="file-input" accept=".pdf,.doc,.docx,.txt" onChange={handleFileInputChange} />
                <label htmlFor="file-input" className="upload-button">Choose File</label>
              </>
            )}
          </div>
        </div>

        <div className="interactive-container">
          <div className="input-panel">
            <h3>Your Resume / Skills</h3>
            <textarea
              className="resume-input"
              placeholder="Paste your resume or describe your skills here..."
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
            />
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => handleAnalyze('resume')} disabled={isAnalyzing}>
                📊 Analyze Resume
              </button>
              <button className="action-btn secondary" onClick={() => handleAnalyze('roadmap')} disabled={isAnalyzing}>
                🗺️ Generate Roadmap
              </button>
              <button className="action-btn secondary" onClick={() => handleAnalyze('projects')} disabled={isAnalyzing}>
                💡 Suggest Projects
              </button>
              <button className="action-btn secondary" onClick={() => handleAnalyze('interview')} disabled={isAnalyzing}>
                🎤 Mock Interview
              </button>
            </div>
          </div>
          
          <div className="output-panel">
            <h3>AI Analysis</h3>
            <div className="analysis-output">
              {isAnalyzing ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Analyzing your profile with AI...</p>
                  <p className="loading-subtext">This may take a few seconds</p>
                </div>
              ) : analysisOutput ? (
                <pre className="output-text">{analysisOutput}</pre>
              ) : (
                <div className="placeholder">
                  <div className="placeholder-icon">🤖</div>
                  <p>Your AI-powered analysis will appear here</p>
                  <p className="placeholder-hint">Upload a resume or enter your information to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 SkillSprint AI - Empowering Your Career Journey</p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
