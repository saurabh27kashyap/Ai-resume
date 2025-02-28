
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProps {
  resumeData: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
      linkedin?: string;
      website?: string;
    };
    workExperience: Array<{
      id: string;
      company: string;
      title: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>;
    skills: string[];
  };
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  const { personalInfo, workExperience, education, skills } = resumeData;

  return (
    <Card className="resume-paper overflow-auto animate-scale-in">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-resume-primary mb-1">
            {personalInfo.name || "Your Name"}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-resume-secondary">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            
            {personalInfo.phone && (
              <>
                {personalInfo.location && <span className="text-resume-primary">•</span>}
                <span>{personalInfo.phone}</span>
              </>
            )}
            
            {personalInfo.email && (
              <>
                {(personalInfo.location || personalInfo.phone) && (
                  <span className="text-resume-primary">•</span>
                )}
                <span>{personalInfo.email}</span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-resume-accent mt-1">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            
            {personalInfo.website && (
              <>
                {personalInfo.linkedin && <span className="text-resume-primary">•</span>}
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-md font-semibold text-resume-primary uppercase tracking-wider mb-2">
              Professional Summary
            </h2>
            <Separator className="mb-3" />
            <p className="text-sm text-resume-secondary">
              {personalInfo.summary}
            </p>
          </div>
        )}
        
        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md font-semibold text-resume-primary uppercase tracking-wider mb-2">
              Work Experience
            </h2>
            <Separator className="mb-3" />
            
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-resume-primary">
                        {exp.title || "Position Title"}
                      </h3>
                      <h4 className="text-sm font-medium text-resume-secondary">
                        {exp.company || "Company Name"}
                        {exp.location && `, ${exp.location}`}
                      </h4>
                    </div>
                    
                    {(exp.startDate || exp.endDate) && (
                      <p className="text-xs text-resume-secondary whitespace-nowrap">
                        {exp.startDate || "Start Date"} – {exp.endDate || "Present"}
                      </p>
                    )}
                  </div>
                  
                  {exp.description && (
                    <p className="text-sm text-resume-secondary mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md font-semibold text-resume-primary uppercase tracking-wider mb-2">
              Education
            </h2>
            <Separator className="mb-3" />
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-resume-primary">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <h4 className="text-sm font-medium text-resume-secondary">
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </h4>
                    </div>
                    
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-xs text-resume-secondary whitespace-nowrap">
                        {edu.startDate || "Start Date"} – {edu.endDate || "Present"}
                      </p>
                    )}
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm text-resume-secondary mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-md font-semibold text-resume-primary uppercase tracking-wider mb-2">
              Skills
            </h2>
            <Separator className="mb-3" />
            
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm text-resume-secondary bg-resume-hover px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
