import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContractTemplatesPage } from '@/components/ContractTemplatesPage';
import { ContractGeneration } from '@/components/ContractGeneration';
import { ContractTracking } from '@/components/ContractTracking';

const ContractManagement = () => {
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
            <h1 className="text-3xl font-bold">Contract Management</h1>
            <p className="text-muted-foreground">Manage contract templates and generate student contracts</p>
          </div>
        </div>
        
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Contract Templates</TabsTrigger>
            <TabsTrigger value="generate">Generate Contracts</TabsTrigger>
            <TabsTrigger value="track">Track Contracts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            <ContractTemplatesPage />
          </TabsContent>
          
          <TabsContent value="generate" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <ContractGeneration />
            </div>
          </TabsContent>
          
          <TabsContent value="track" className="mt-6">
            <ContractTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContractManagement;