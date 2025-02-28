
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAISuggestions } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

interface PersonalInfoSectionProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    website?: string;
  };
  onChange: (field: string, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo, onChange }) => {
  const { toast } = useToast();
  const [isImproving, setIsImproving] = React.useState(false);
  const [suggestedSummary, setSuggestedSummary] = React.useState("");
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field, e.target.value);
  };
  
  const improveSummary = async () => {
    if (!personalInfo.summary.trim()) {
      toast({
        title: "Summary needed",
        description: "Please write a summary first so I can improve it.",
        variant: "destructive",
      });
      return;
    }
    
    setIsImproving(true);
    try {
      const suggestions = await getAISuggestions({
        text: personalInfo.summary,
        type: 'improve'
      });
      
      if (suggestions.length > 0) {
        setSuggestedSummary(suggestions[0].suggestion);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };
  
  const applySuggestion = () => {
    if (suggestedSummary) {
      onChange('summary', suggestedSummary);
      setSuggestedSummary("");
      toast({
        title: "Summary updated",
        description: "The AI suggestion has been applied to your summary.",
      });
    }
  };
  
  return (
    <Card className="animate-in section-transition" style={{ "--index": "0" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="resume-section-title">Personal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={personalInfo.name} 
              onChange={handleChange('name')} 
              placeholder="Jane Doe"
              className="resume-text-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={personalInfo.email} 
              onChange={handleChange('email')} 
              placeholder="jane.doe@example.com"
              className="resume-text-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              value={personalInfo.phone} 
              onChange={handleChange('phone')} 
              placeholder="(123) 456-7890"
              className="resume-text-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={personalInfo.location} 
              onChange={handleChange('location')} 
              placeholder="City, State"
              className="resume-text-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn (optional)</Label>
            <Input 
              id="linkedin" 
              value={personalInfo.linkedin || ''} 
              onChange={handleChange('linkedin')} 
              placeholder="linkedin.com/in/janedoe"
              className="resume-text-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input 
              id="website" 
              value={personalInfo.website || ''} 
              onChange={handleChange('website')} 
              placeholder="janedoe.com"
              className="resume-text-input"
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={improveSummary}
              disabled={isImproving}
            >
              <Sparkles className="h-3 w-3" />
              {isImproving ? "Generating..." : "Improve with AI"}
            </Button>
          </div>
          <Textarea 
            id="summary" 
            value={personalInfo.summary} 
            onChange={handleChange('summary')} 
            placeholder="Write a brief summary of your professional background, skills, and career objectives..."
            className="min-h-[120px] resize-y resume-text-input"
          />
          
          {suggestedSummary && (
            <div className="mt-4 p-4 border border-accent/30 bg-accent/5 rounded-md animate-fade-in">
              <p className="text-sm font-medium mb-2">AI Suggestion:</p>
              <p className="text-sm italic mb-4">{suggestedSummary}</p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSuggestedSummary("")}
                >
                  Dismiss
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={applySuggestion}
                >
                  Apply Suggestion
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
