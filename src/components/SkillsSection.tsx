
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAISuggestions } from "@/services/aiService";

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    if (skills.includes(newSkill.trim())) {
      toast({
        title: "Skill already exists",
        description: "This skill is already in your list.",
        variant: "destructive",
      });
      return;
    }
    
    onChange([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      onChange([...skills, skill]);
    }
    setSuggestedSkills(suggestedSkills.filter(s => s !== skill));
  };

  const generateSkillSuggestions = async () => {
    setIsGenerating(true);
    try {
      // In a real application, we would analyze the resume data
      // and suggest relevant skills
      
      // Mock skill suggestions
      const relevantIndustrySkills = [
        "TypeScript", "React Native", "NextJS", "GraphQL", "MongoDB", 
        "AWS", "Docker", "Kubernetes", "CI/CD", "Agile Methodologies",
        "Problem Solving", "Team Leadership", "Project Management",
        "UX/UI Design", "RESTful APIs", "Microservices"
      ];
      
      // Filter out skills that the user already has
      const filteredSuggestions = relevantIndustrySkills
        .filter(skill => !skills.includes(skill))
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 5); // Take 5 random skills
      
      setSuggestedSkills(filteredSuggestions);
      
      if (filteredSuggestions.length === 0) {
        toast({
          title: "No new skills to suggest",
          description: "Try adding more details to your work experience for better suggestions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate skill suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "3" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="resume-section-title">Skills</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={generateSkillSuggestions}
            disabled={isGenerating}
          >
            <Sparkles className="h-3 w-3" />
            {isGenerating ? "Generating..." : "Suggest Skills"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 && suggestedSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No skills added</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your technical and professional skills to highlight your capabilities and expertise.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center gap-1 group"
                  >
                    {skill}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full opacity-50 group-hover:opacity-100"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {suggestedSkills.length > 0 && (
              <div className="space-y-3 p-4 border border-accent/30 bg-accent/5 rounded-md animate-fade-in">
                <p className="text-sm font-medium">Suggested Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => handleAddSuggestedSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill (e.g., JavaScript, Project Management)"
                className="resume-text-input"
              />
              <Button
                variant="outline"
                className="shrink-0"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
