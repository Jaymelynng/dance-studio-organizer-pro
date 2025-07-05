import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunicationTemplatesTab } from '@/components/template-center/CommunicationTemplatesTab';
import { DocumentTemplatesTab } from '@/components/template-center/DocumentTemplatesTab';
import { ContractTemplatesTab } from '@/components/template-center/ContractTemplatesTab';

const TemplateCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Template Center</h1>
            <p className="text-white/80">Manage communication, document, and contract templates</p>
          </div>
        </div>
        
        <Tabs defaultValue="communication" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="communication">Communication Templates</TabsTrigger>
            <TabsTrigger value="documents">Document Templates</TabsTrigger>
            <TabsTrigger value="contracts">Contract Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="communication" className="mt-6">
            <CommunicationTemplatesTab />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <DocumentTemplatesTab />
          </TabsContent>
          
          <TabsContent value="contracts" className="mt-6">
            <ContractTemplatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemplateCenter;