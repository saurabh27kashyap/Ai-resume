
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, GraduationCap } from "lucide-react";
import { getAISuggestions } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const { toast } = useToast();
  const [activeEducation, setActiveEducation] = useState<string | null>(
    education.length > 0 ? education[0].id : null
  );

  const handleAddEducation = () => {
    const newEducation = emptyEducation();
    onChange([...education, newEducation]);
    setActiveEducation(newEducation.id);
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    onChange(updatedEducation);
    
    if (activeEducation === id) {
      setActiveEducation(updatedEducation.length > 0 ? updatedEducation[0].id : null);
    }
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string | boolean) => {
    const updatedEducation = education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updatedEducation);
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "2" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="resume-section-title">Education</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {education.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No education added</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your educational background to highlight your academic achievements and qualifications.
            </p>
            <Button onClick={handleAddEducation}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {education.map((edu) => (
                <button
                  key={edu.id}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    activeEducation === edu.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  onClick={() => setActiveEducation(edu.id)}
                >
                  {edu.institution || 'New Education'}
                </button>
              ))}
              <button
                className="px-3 py-2 text-sm rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                onClick={handleAddEducation}
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
            
            {education.map((edu) => (
              <div
                key={edu.id}
                className={`space-y-6 transition-opacity duration-300 ${
                  activeEducation === edu.id ? 'opacity-100' : 'hidden'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {edu.institution ? `${edu.institution}` : 'New Education'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveEducation(edu.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                    <Input
                      id={`institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                      placeholder="University or School Name"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                    <Input
                      id={`degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                    <Input
                      id={`field-${edu.id}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science, Business, etc."
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`location-${edu.id}`}>Location</Label>
                    <Input
                      id={`location-${edu.id}`}
                      value={edu.location}
                      onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                      placeholder="City, State"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                      className="resume-text-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${edu.id}`}
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                      placeholder="MM/YYYY or Expected MM/YYYY"
                      className="resume-text-input"
                      disabled={edu.current}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description-${edu.id}`}>Description (Optional)</Label>
                  <Textarea
                    id={`description-${edu.id}`}
                    value={edu.description}
                    onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                    placeholder="Relevant coursework, honors, achievements, or activities..."
                    className="min-h-[100px] resize-y resume-text-input"
                  />
                </div>
              </div>
            ))}
            
            {education.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleAddEducation}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Another Education
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
