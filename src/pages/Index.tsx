
import React from "react";
import ResumeBuilder from "@/components/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">ResumeRevamp</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              How It Works
            </Button>
            <Button variant="ghost" size="sm">
              Examples
            </Button>
            <Button size="sm" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pro Features</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-4">Craft Your Perfect Resume</h1>
            <p className="text-lg text-muted-foreground">
              Build a professional resume with AI-powered suggestions to help you stand out and land your dream job.
            </p>
          </div>
          
          <ResumeBuilder />
        </div>
      </main>
      
      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ResumeRevamp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
