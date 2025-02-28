
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Check, X, AlertCircle } from "lucide-react";
import { optimizeResumeForJob, generateResumeSummary } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from '@/components/ui/textarea';

interface AISuggestionsProps {
  resumeData: any;
  onUpdateSummary: (summary: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ resumeData, onUpdateSummary }) => {
  const { toast } = useToast();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  const handleGenerateSummary = async () => {
    const requiredFields = [resumeData.personalInfo?.name, resumeData.workExperience?.[0]?.title];
    
    if (requiredFields.some(field => !field)) {
      toast({
        title: "More information needed",
        description: "Please add your name and at least one work experience first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingSummary(true);
    try {
      const summary = await generateResumeSummary(resumeData);
      setGeneratedSummary(summary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate a summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleOptimizeForJob = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description needed",
        description: "Please enter a job description to optimize for.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    try {
      const results = await optimizeResumeForJob(resumeData, jobDescription);
      setOptimizationResults(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const applySummary = () => {
    if (generatedSummary) {
      onUpdateSummary(generatedSummary);
      toast({
        title: "Summary applied",
        description: "The AI-generated summary has been added to your resume.",
      });
      setGeneratedSummary("");
    }
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "4" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="resume-section-title">AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Generate Summary</TabsTrigger>
            <TabsTrigger value="optimize">Optimize for Job</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="p-4 border rounded-md bg-secondary/50">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Professional Summary Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI analyze your resume data and generate a professional summary highlighting your key strengths and experiences.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={isGeneratingSummary}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingSummary ? "Generating..." : "Generate Summary"}
                </Button>
              </div>
            </div>
            
            {generatedSummary && (
              <div className="p-4 border border-primary/20 rounded-md bg-primary/5 animate-fade-in">
                <h3 className="text-sm font-medium mb-2">AI-Generated Summary:</h3>
                <p className="text-sm italic mb-4">{generatedSummary}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGeneratedSummary("")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={applySummary}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Apply to Resume
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-4">
            <div className="p-4 border rounded-md bg-secondary/50">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Resume Job Optimizer</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste a job description below and let AI analyze how well your resume matches the requirements.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <Textarea
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] resize-y"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleOptimizeForJob} 
                    disabled={isOptimizing}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isOptimizing ? "Analyzing..." : "Analyze Match"}
                  </Button>
                </div>
              </div>
            </div>
            
            {optimizationResults && (
              <div className="p-4 border border-primary/20 rounded-md bg-primary/5 animate-fade-in space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Match Score</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {optimizationResults.optimizationScore}%
                    </div>
                    <span className="text-sm">
                      Your resume matches {optimizationResults.optimizationScore}% of the job requirements
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Matching Keywords</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizationResults.keywordMatches.map((keyword: string, i: number) => (
                      <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {optimizationResults.missingKeywords.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {optimizationResults.missingKeywords.map((keyword: string, i: number) => (
                          <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Consider adding these keywords to your resume if they're relevant to your experience.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
