
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PersonalInfoSection from "./PersonalInfoSection";
import WorkExperienceSection from "./WorkExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ResumePreview from "./ResumePreview";
import AISuggestions from "./AISuggestions";
import { Download, Eye, Edit } from "lucide-react";

interface ResumeData {
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
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    website: '',
  },
  workExperience: [],
  education: [],
  skills: [],
};

const ResumeBuilder: React.FC = () => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };
  
  const updateWorkExperience = (experiences: ResumeData['workExperience']) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: experiences,
    }));
  };
  
  const updateEducation = (education: ResumeData['education']) => {
    setResumeData(prev => ({
      ...prev,
      education,
    }));
  };
  
  const updateSkills = (skills: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills,
    }));
  };
  
  const updateSummary = (summary: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        summary,
      },
    }));
  };
  
  const downloadResume = async () => {
    const resumeElement = document.getElementById('resume-preview');
    
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Could not find resume element to download.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // US Letter size in mm: 215.9 x 279.4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });
      
      const imgWidth = 215.9;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf` 
        : 'Resume.pdf';
      
      pdf.save(fileName);
      
      toast({
        title: "Success!",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem downloading your resume. Please try again.",
        variant: "destructive",
      });
      console.error("Error downloading resume:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Resume
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <Button
            onClick={downloadResume}
            className="flex items-center gap-2"
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
        
        <TabsContent value="edit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PersonalInfoSection
                personalInfo={resumeData.personalInfo}
                onChange={updatePersonalInfo}
              />
              
              <WorkExperienceSection
                experiences={resumeData.workExperience}
                onChange={updateWorkExperience}
              />
              
              <EducationSection
                education={resumeData.education}
                onChange={updateEducation}
              />
              
              <SkillsSection
                skills={resumeData.skills}
                onChange={updateSkills}
              />
            </div>
            
            <div className="space-y-6">
              <AISuggestions
                resumeData={resumeData}
                onUpdateSummary={updateSummary}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="flex justify-center">
          <div id="resume-preview">
            <ResumePreview resumeData={resumeData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
