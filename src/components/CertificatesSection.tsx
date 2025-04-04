
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Award
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  link?: string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  onChange: (certificates: Certificate[]) => void;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates, onChange }) => {
  const { toast } = useToast();
  const [expandedCertificates, setExpandedCertificates] = useState<string[]>([]);

  const addCertificate = () => {
    const newCertificate: Certificate = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      description: '',
      link: '',
    };
    
    const updatedCertificates = [...certificates, newCertificate];
    onChange(updatedCertificates);
    
    // Auto-expand the newly added certificate
    setExpandedCertificates([...expandedCertificates, newCertificate.id]);
  };

  const removeCertificate = (id: string) => {
    const updatedCertificates = certificates.filter(certificate => certificate.id !== id);
    onChange(updatedCertificates);
    
    // Remove from expanded certificates if it was expanded
    setExpandedCertificates(expandedCertificates.filter(certId => certId !== id));
  };

  const updateCertificate = (id: string, field: string, value: string) => {
    const updatedCertificates = certificates.map(certificate => {
      if (certificate.id === id) {
        return { ...certificate, [field]: value };
      }
      return certificate;
    });
    
    onChange(updatedCertificates);
  };

  const toggleExpand = (id: string) => {
    if (expandedCertificates.includes(id)) {
      setExpandedCertificates(expandedCertificates.filter(certId => certId !== id));
    } else {
      setExpandedCertificates([...expandedCertificates, id]);
    }
  };

  const moveCertificate = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === certificates.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedCertificates = [...certificates];
    const [movedCertificate] = updatedCertificates.splice(index, 1);
    updatedCertificates.splice(newIndex, 0, movedCertificate);
    
    onChange(updatedCertificates);
  };

  return (
    <Card className="animate-in section-transition" style={{ "--index": "4" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="resume-section-title">Certifications</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={addCertificate}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Certificate
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No certifications added</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your certifications to highlight your specialized skills and qualifications.
            </p>
            <Button onClick={addCertificate} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Certificate
            </Button>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={expandedCertificates}
            className="space-y-4"
          >
            {certificates.map((certificate, index) => (
              <AccordionItem
                value={certificate.id}
                key={certificate.id}
                className="border rounded-md p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveCertificate(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => moveCertificate(index, 'down')}
                        disabled={index === certificates.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpand(certificate.id);
                      }}
                      className="hover:no-underline flex-1"
                    >
                      <span className="text-left">
                        {certificate.name || "Untitled Certificate"}
                      </span>
                    </AccordionTrigger>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => removeCertificate(certificate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Certificate Name
                        </label>
                        <Input
                          placeholder="e.g., AWS Certified Solutions Architect"
                          value={certificate.name}
                          onChange={(e) =>
                            updateCertificate(certificate.id, 'name', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Issuing Organization
                        </label>
                        <Input
                          placeholder="e.g., Amazon Web Services"
                          value={certificate.issuer}
                          onChange={(e) =>
                            updateCertificate(certificate.id, 'issuer', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Date Issued
                        </label>
                        <Input
                          type="month"
                          value={certificate.date}
                          onChange={(e) =>
                            updateCertificate(certificate.id, 'date', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Verification Link (Optional)
                        </label>
                        <Input
                          placeholder="e.g., https://www.credential.net/credential-id"
                          value={certificate.link || ''}
                          onChange={(e) =>
                            updateCertificate(certificate.id, 'link', e.target.value)
                          }
                          className="resume-text-input"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Description (Optional)
                        </label>
                        <Textarea
                          placeholder="Briefly describe what this certification represents..."
                          value={certificate.description}
                          onChange={(e) =>
                            updateCertificate(certificate.id, 'description', e.target.value)
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

export default CertificatesSection;
