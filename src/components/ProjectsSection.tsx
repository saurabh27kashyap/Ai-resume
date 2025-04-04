
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Code
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onChange }) => {
  const { toast } = useToast();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    
    const updatedProjects = [...projects, newProject];
    onChange(updatedProjects);
    
    // Auto-expand the newly added project
    setExpandedProjects([...expandedProjects, newProject.id]);
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onChange(updatedProjects);
    
    // Remove from expanded projects if it was expanded
    setExpandedProjects(expandedProjects.filter(projectId => projectId !== id));
  };

  const updateProject = (id: string, field: string, value: string | boolean) => {
    const updatedProjects = projects.map(project => {
      if (project.id === id) {
        if (field === 'current' && value === true) {
          return { ...project, [field]: value, endDate: '' };
        }
        return { ...project, [field]: value };
      }
      return project;
    });
    
    onChange(updatedProjects);
  };

  const toggleExpand = (id: string) => {
    if (expandedProjects.includes(id)) {
      setExpandedProjects(expandedProjects.filter(projectId => projectId !== id));
    } else {
      setExpandedProjects([...expandedProjects, id]);
    }
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedProjects = [...projects];
    const [movedProject] = updatedProjects.splice(index, 1);
    updatedProjects.splice(newIndex, 0, movedProject);
    
    onChange(updatedProjects);
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "2" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="resume-section-title">Projects</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={addProject}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Code className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects added</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your projects to showcase your technical skills and accomplishments.
            </p>
            <Button onClick={addProject} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={expandedProjects}
            className="space-y-4"
          >
            {projects.map((project, index) => (
              <AccordionItem
                value={project.id}
                key={project.id}
                className="border rounded-md p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveProject(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveProject(index, 'down')}
                        disabled={index === projects.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpand(project.id);
                      }}
                      className="hover:no-underline flex-1"
                    >
                      <span className="text-left">
                        {project.title || "Untitled Project"}
                      </span>
                    </AccordionTrigger>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Project Title
                        </label>
                        <Input
                          placeholder="e.g., E-commerce Web Application"
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project.id, 'title', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Technologies Used
                        </label>
                        <Input
                          placeholder="e.g., React, Node.js, MongoDB"
                          value={project.technologies}
                          onChange={(e) =>
                            updateProject(project.id, 'technologies', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Project Link (Optional)
                        </label>
                        <Input
                          placeholder="e.g., https://github.com/yourusername/project"
                          value={project.link || ''}
                          onChange={(e) =>
                            updateProject(project.id, 'link', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Start Date
                          </label>
                          <Input
                            type="month"
                            value={project.startDate}
                            onChange={(e) =>
                              updateProject(project.id, 'startDate', e.target.value)
                            }
                            className="resume-text-input"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            End Date
                          </label>
                          <div className="space-y-2">
                            <Input
                              type="month"
                              value={project.endDate}
                              onChange={(e) =>
                                updateProject(project.id, 'endDate', e.target.value)
                              }
                              disabled={project.current}
                              className="resume-text-input"
                            />
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`current-${project.id}`}
                                checked={project.current}
                                onCheckedChange={(checked) =>
                                  updateProject(project.id, 'current', checked === true)
                                }
                              />
                              <label
                                htmlFor={`current-${project.id}`}
                                className="text-sm cursor-pointer"
                              >
                                Current/Ongoing Project
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Description
                        </label>
                        <Textarea
                          placeholder="Describe your project, its features, and your contributions..."
                          value={project.description}
                          onChange={(e) =>
                            updateProject(project.id, 'description', e.target.value)
                          }
                          className="resume-text-input min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
