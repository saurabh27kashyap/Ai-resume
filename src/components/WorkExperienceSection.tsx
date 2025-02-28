
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Sparkles, Briefcase } from "lucide-react";
import { getAISuggestions } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

const emptyExperience = (): WorkExperience => ({
  id: crypto.randomUUID(),
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ experiences, onChange }) => {
  const { toast } = useToast();
  const [activeExperience, setActiveExperience] = useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );
  const [suggestions, setSuggestions] = useState<{[key: string]: string}>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExperience = emptyExperience();
    onChange([...experiences, newExperience]);
    setActiveExperience(newExperience.id);
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    onChange(updatedExperiences);
    
    if (activeExperience === id) {
      setActiveExperience(updatedExperiences.length > 0 ? updatedExperiences[0].id : null);
    }
  };

  const handleExperienceChange = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const improveDescription = async (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    if (!experience || !experience.description.trim()) {
      toast({
        title: "Description needed",
        description: "Please write a description first so I can improve it.",
        variant: "destructive",
      });
      return;
    }

    setLoadingId(id);
    try {
      const result = await getAISuggestions({
        text: experience.description,
        context: `Job title: ${experience.title}, Company: ${experience.company}`,
        type: 'improve'
      });
      
      if (result.length > 0) {
        setSuggestions({
          ...suggestions,
          [id]: result[0].suggestion
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const applySuggestion = (id: string) => {
    if (suggestions[id]) {
      handleExperienceChange(id, 'description', suggestions[id]);
      
      // Remove this suggestion
      const newSuggestions = { ...suggestions };
      delete newSuggestions[id];
      setSuggestions(newSuggestions);
      
      toast({
        title: "Description updated",
        description: "The AI suggestion has been applied to your work experience.",
      });
    }
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "1" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="resume-section-title">Work Experience</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No work experience added</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your work history to showcase your professional experience and career progression.
            </p>
            <Button onClick={handleAddExperience}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    activeExperience === exp.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  onClick={() => setActiveExperience(exp.id)}
                >
                  {exp.company || 'New Experience'}
                </button>
              ))}
              <button
                className="px-3 py-2 text-sm rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                onClick={handleAddExperience}
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
            
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`space-y-6 transition-opacity duration-300 ${
                  activeExperience === exp.id ? 'opacity-100' : 'hidden'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {exp.company ? `${exp.company}` : 'New Experience'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveExperience(exp.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${exp.id}`}>Company</Label>
                    <Input
                      id={`company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                    <Input
                      id={`title-${exp.id}`}
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`location-${exp.id}`}>Location</Label>
                    <Input
                      id={`location-${exp.id}`}
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                      placeholder="City, State or Remote"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${exp.id}`}
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                        placeholder="MM/YYYY"
                        className="resume-text-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${exp.id}`}
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                        placeholder="MM/YYYY or Present"
                        className="resume-text-input"
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${exp.id}`}>Description</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => improveDescription(exp.id)}
                      disabled={loadingId === exp.id}
                    >
                      <Sparkles className="h-3 w-3" />
                      {loadingId === exp.id ? "Generating..." : "Improve with AI"}
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities, achievements, and the skills you utilized in this role..."
                    className="min-h-[150px] resize-y resume-text-input"
                  />
                  
                  {suggestions[exp.id] && (
                    <div className="mt-4 p-4 border border-accent/30 bg-accent/5 rounded-md animate-fade-in">
                      <p className="text-sm font-medium mb-2">AI Suggestion:</p>
                      <p className="text-sm italic mb-4">{suggestions[exp.id]}</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newSuggestions = { ...suggestions };
                            delete newSuggestions[exp.id];
                            setSuggestions(newSuggestions);
                          }}
                        >
                          Dismiss
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => applySuggestion(exp.id)}
                        >
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {experiences.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleAddExperience}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Another Experience
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkExperienceSection;
