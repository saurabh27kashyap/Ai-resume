
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

// Gemini API key - in production, this should be stored in environment variables
// and accessed securely through a backend service
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual API key

// Function to get AI suggestions using Gemini API
export async function getAISuggestions({ text, context, type }: AIRequestParams): Promise<AISuggestion[]> {
  try {
    // If no API key is provided, fall back to mock suggestions
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Using mock AI suggestions. For real suggestions, configure your Gemini API key.");
      return getMockAISuggestions({ text, context, type });
    }

    // Prepare the prompt based on suggestion type
    let prompt = "";
    switch (type) {
      case 'improve':
        prompt = `Improve this resume text to make it more impactful and professional: "${text}"
        If context is provided, consider this context: ${context || "No context provided"}
        Return exactly three suggestions in this JSON format:
        [
          {
            "suggestion": "improved version 1",
            "reason": "reason for this improvement"
          },
          {
            "suggestion": "improved version 2",
            "reason": "reason for this improvement"
          },
          {
            "suggestion": "improved version 3",
            "reason": "reason for this improvement"
          }
        ]`;
        break;
      case 'keywords':
        prompt = `Suggest relevant keywords and industry terms to add to this resume text to make it more ATS-friendly: "${text}"
        Return suggestions in this JSON format:
        [
          {
            "suggestion": "text with added keyword 1",
            "reason": "reason for adding this keyword"
          },
          {
            "suggestion": "text with added keyword 2",
            "reason": "reason for adding this keyword"
          }
        ]`;
        break;
      case 'general':
        prompt = `Give general improvement suggestions for this resume text: "${text}"
        Return suggestions in this JSON format:
        [
          {
            "suggestion": "improved version",
            "reason": "reason for this improvement"
          }
        ]`;
        break;
    }

    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the generated text from the response
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    // The text might include markdown backticks or other non-JSON content, so we need to extract just the JSON part
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse Gemini response");
    }
    
    const suggestions = JSON.parse(jsonMatch[0]);
    
    // Map the suggestions to the expected format
    return suggestions.map((suggestion: any) => ({
      id: crypto.randomUUID(),
      original: text,
      suggestion: suggestion.suggestion,
      reason: suggestion.reason
    }));
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    // Fall back to mock suggestions if there's an error
    return getMockAISuggestions({ text, context, type });
  }
}

// Fallback function for mock suggestions when API is not available
function getMockAISuggestions({ text, context, type }: AIRequestParams): AISuggestion[] {
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
}

export async function generateResumeSummary(resumeData: any): Promise<string> {
  try {
    // If no API key is provided, fall back to mock summary
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Using mock resume summary. For real summary, configure your Gemini API key.");
      return getMockResumeSummary(resumeData);
    }

    // Extract relevant information from resume data
    const name = resumeData.personalInfo?.name || "";
    const workExperience = resumeData.workExperience || [];
    const education = resumeData.education || [];
    const skills = resumeData.skills || [];
    
    // Create a prompt that includes the essential resume information
    const prompt = `
      Create a professional summary paragraph for a resume with these details:
      
      Name: ${name}
      Skills: ${skills.join(", ")}
      
      Work Experience:
      ${workExperience.map((exp: any) => 
        `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
         ${exp.description}`
      ).join("\n")}
      
      Education:
      ${education.map((edu: any) => 
        `- ${edu.degree} in ${edu.field} from ${edu.institution}`
      ).join("\n")}
      
      Write a concise, professional summary paragraph (maximum 3-4 sentences) that highlights strengths, experience, and career focus.
    `;
    
    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;
    
    return summary.trim();
  } catch (error) {
    console.error("Error generating resume summary:", error);
    // Fall back to mock summary if there's an error
    return getMockResumeSummary(resumeData);
  }
}

// Fallback function for mock summary when API is not available
function getMockResumeSummary(resumeData: any): string {
  const name = resumeData.personalInfo?.name || "the candidate";
  const recentRole = resumeData.workExperience?.[0]?.title || "professional";
  const skills = resumeData.skills?.join(", ") || "various skills";
  
  return `${name} is a dedicated ${recentRole} with expertise in ${skills}. With a proven track record of delivering results and a commitment to excellence, ${name.split(' ')[0]} brings valuable experience and a forward-thinking approach to solving complex challenges.`;
}

export async function optimizeResumeForJob(resumeData: any, jobDescription: string): Promise<any> {
  try {
    // If no API key is provided, fall back to mock optimization
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Using mock job optimization. For real optimization, configure your Gemini API key.");
      return getMockOptimization(resumeData, jobDescription);
    }
    
    // Extract relevant information from resume data
    const name = resumeData.personalInfo?.name || "";
    const summary = resumeData.personalInfo?.summary || "";
    const workExperience = resumeData.workExperience || [];
    const education = resumeData.education || [];
    const skills = resumeData.skills || [];
    
    // Create a prompt that includes the essential resume information and job description
    const prompt = `
      Compare this resume information:
      
      Name: ${name}
      Professional Summary: ${summary}
      
      Work Experience:
      ${workExperience.map((exp: any) => 
        `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
         ${exp.description}`
      ).join("\n")}
      
      Education:
      ${education.map((edu: any) => 
        `- ${edu.degree} in ${edu.field} from ${edu.institution}`
      ).join("\n")}
      
      Skills: ${skills.join(", ")}
      
      To this job description:
      ${jobDescription}
      
      Return a JSON object with the following:
      {
        "optimizationScore": [a number between 0-100 representing match percentage],
        "keywordMatches": [array of keywords from the resume that match well with the job description],
        "missingKeywords": [array of important keywords from the job description that are not in the resume]
      }
    `;
    
    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse Gemini response");
    }
    
    const optimization = JSON.parse(jsonMatch[0]);
    
    return {
      ...resumeData,
      optimizationScore: optimization.optimizationScore,
      keywordMatches: optimization.keywordMatches,
      missingKeywords: optimization.missingKeywords
    };
  } catch (error) {
    console.error("Error optimizing resume for job:", error);
    // Fall back to mock optimization if there's an error
    return getMockOptimization(resumeData, jobDescription);
  }
}

// Fallback function for mock optimization when API is not available
function getMockOptimization(resumeData: any, jobDescription: string): any {
  return {
    ...resumeData,
    optimizationScore: 85,
    keywordMatches: ["collaboration", "leadership", "problem-solving"],
    missingKeywords: ["agile methodology", "cross-functional teams"]
  };
}
