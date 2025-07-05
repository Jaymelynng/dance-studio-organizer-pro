import { useState } from 'react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useContractGeneration } from '@/hooks/useContractGeneration';
import { useStudents } from '@/hooks/useStudents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';

interface ContractGenerationProps {
  studentId?: string;
  onContractGenerated?: (contractData: any) => void;
}

export const ContractGeneration = ({ studentId, onContractGenerated }: ContractGenerationProps) => {
  const { templates } = useContractTemplates();
  const { generateContract, loading } = useContractGeneration();
  const { students } = useStudents();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(studentId || '');
  const [generatedContract, setGeneratedContract] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateContract = async () => {
    if (!selectedTemplate || !selectedStudent) return;
    
    try {
      const result = await generateContract(selectedTemplate, selectedStudent);
      setGeneratedContract(result);
      setShowPreview(true);
      onContractGenerated?.(result);
    } catch (error) {
      console.error('Error generating contract:', error);
    }
  };

  const activeTemplates = templates.filter(t => t.is_active);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!studentId && (
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="template">Select Contract Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {activeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.division} - {template.season})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateContract}
            disabled={loading || !selectedTemplate || !selectedStudent}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Contract'}
          </Button>
        </CardContent>
      </Card>

      {/* Contract Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Contract Preview</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button size="sm">
                  Send to Parent
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {generatedContract && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Contract Details</h3>
                <p><strong>Contract Number:</strong> {generatedContract.contract.contract_number}</p>
                <p><strong>Status:</strong> {generatedContract.contract.status}</p>
                <p><strong>Monthly Tuition:</strong> ${generatedContract.contract.monthly_tuition}</p>
                <p><strong>Registration Fee:</strong> ${generatedContract.contract.registration_fee}</p>
              </div>
              
              <div 
                className="border rounded-lg p-6 bg-white max-h-[60vh] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatedContract.html_content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};