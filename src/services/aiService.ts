
interface AIRequestParams {
  text: string;
  context?: string;
  type: 'improve' | 'keywords' | 'general';
}

interface AISuggestion {
  original: string;
  suggestion: string;
  reason: string;
  id: string;
}

export async function getAISuggestions({ text, context, type }: AIRequestParams): Promise<AISuggestion[]> {
  try {
    // In a real application, this would be an API call to your backend
    // For now, we'll simulate the AI suggestions
    const API_KEY = "AIzaSyC33xoR4J48PKL8T846voF9Yv_o9Z_Wg8g"; // Would be stored securely in production
    
    // In this demo version, we'll return mock suggestions
    // In a real implementation, you would make an API call to an AI service
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const mockSuggestions: Record<string, AISuggestion[]> = {
      improve: [
        {
          id: crypto.randomUUID(),
          original: text,
          suggestion: text.length > 20
            ? `${text.charAt(0).toUpperCase() + text.slice(1).replace(/\.$/, "")} with a focus on quantifiable achievements and outcomes.`
            : `Consider expanding this with more specific details and achievements.`,
          reason: "Adding specific achievements makes your resume more impactful"
        },
        {
          id: crypto.randomUUID(),
          original: text,
          suggestion: text.replace(/managed|responsible for|worked on/gi, match => {
            const replacements: Record<string, string> = {
              'managed': 'led',
              'responsible for': 'spearheaded',
              'worked on': 'developed'
            };
            return replacements[match.toLowerCase()] || match;
          }),
          reason: "Using stronger action verbs demonstrates leadership and initiative"
        }
      ],
      keywords: [
        {
          id: crypto.randomUUID(),
          original: text,
          suggestion: text + (text.length > 0 ? " Proficient in industry-standard methodologies and tools." : "Consider adding relevant technical skills and methodologies."),
          reason: "Including industry keywords improves visibility to ATS systems"
        }
      ],
      general: [
        {
          id: crypto.randomUUID(),
          original: text,
          suggestion: text.length > 30 
            ? `${text.split(' ').slice(0, text.split(' ').length * 0.8).join(' ')}...` 
            : text + " Consider expanding this section with more relevant details.",
          reason: text.length > 100 
            ? "Keeping content concise improves readability" 
            : "Adding more relevant information strengthens your profile"
        }
      ]
    };
    
    return mockSuggestions[type] || [];
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return [];
  }
}

export async function generateResumeSummary(resumeData: any): Promise<string> {
  // This would connect to your AI service in production
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const name = resumeData.personalInfo?.name || "the candidate";
  const recentRole = resumeData.workExperience?.[0]?.title || "professional";
  const skills = resumeData.skills?.join(", ") || "various skills";
  
  return `${name} is a dedicated ${recentRole} with expertise in ${skills}. With a proven track record of delivering results and a commitment to excellence, ${name.split(' ')[0]} brings valuable experience and a forward-thinking approach to solving complex challenges.`;
}

export async function optimizeResumeForJob(resumeData: any, jobDescription: string): Promise<any> {
  // This would connect to your AI service in production
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock optimized resume data
  return {
    ...resumeData,
    optimizationScore: 85,
    keywordMatches: ["collaboration", "leadership", "problem-solving"],
    missingKeywords: ["agile methodology", "cross-functional teams"]
  };
}
