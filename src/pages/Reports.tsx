import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FinancialReportsTab } from '@/components/reports/FinancialReportsTab';
import { StudentReportsTab } from '@/components/reports/StudentReportsTab';
import { CommunicationReportsTab } from '@/components/reports/CommunicationReportsTab';

const Reports = () => {
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
            <h1 className="text-3xl font-bold text-white">Reports Dashboard</h1>
            <p className="text-white/80">Comprehensive analytics and reports for your conservatory</p>
          </div>
        </div>
        
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            <TabsTrigger value="student">Student Reports</TabsTrigger>
            <TabsTrigger value="communication">Communication Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial" className="mt-6">
            <FinancialReportsTab />
          </TabsContent>
          
          <TabsContent value="student" className="mt-6">
            <StudentReportsTab />
          </TabsContent>
          
          <TabsContent value="communication" className="mt-6">
            <CommunicationReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;