import { useState } from 'react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useContractGeneration } from '@/hooks/useContractGeneration';
import { useStudents } from '@/hooks/useStudents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DigitalSignature } from '@/components/contract-templates/DigitalSignature';
import { FileText, Download, Send, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContractGenerationProps {
  studentId?: string;
  onContractGenerated?: (contractData: any) => void;
}

interface Signature {
  data: string;
  timestamp: string;
  ipAddress?: string;
}

export const ContractGeneration = ({ studentId, onContractGenerated }: ContractGenerationProps) => {
  const { templates } = useContractTemplates();
  const { generateContract, loading } = useContractGeneration();
  const { students } = useStudents();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(studentId || '');
  const [generatedContract, setGeneratedContract] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [parentSignature, setParentSignature] = useState<Signature | undefined>();
  const [studentSignature, setStudentSignature] = useState<Signature | undefined>();
  const [directorSignature, setDirectorSignature] = useState<Signature | undefined>();
  const [contractStatus, setContractStatus] = useState<'draft' | 'sent' | 'partial' | 'completed'>('draft');

  const handleSignature = (type: 'parent' | 'student' | 'director', signatureData: string) => {
    const signature: Signature = {
      data: signatureData,
      timestamp: new Date().toISOString(),
      ipAddress: 'localhost' // In production, get actual IP
    };

    switch (type) {
      case 'parent':
        setParentSignature(signature);
        break;
      case 'student':
        setStudentSignature(signature);
        break;
      case 'director':
        setDirectorSignature(signature);
        break;
    }

    // Update contract status based on signatures
    updateContractStatus();
  };

  const updateContractStatus = () => {
    const student = students.find(s => s.id === selectedStudent);
    const studentIs18Plus = student && new Date().getFullYear() - new Date(student.date_of_birth || '').getFullYear() >= 18;
    
    const requiredSignatures = [parentSignature, directorSignature];
    if (studentIs18Plus) requiredSignatures.push(studentSignature);
    
    const completedSignatures = requiredSignatures.filter(Boolean).length;
    const totalRequired = requiredSignatures.length;
    
    if (completedSignatures === 0) {
      setContractStatus('draft');
    } else if (completedSignatures === totalRequired) {
      setContractStatus('completed');
    } else {
      setContractStatus('partial');
    }
  };

  const getStatusBadge = () => {
    switch (contractStatus) {
      case 'completed':
        return <Badge className="bg-green-500">Fully Signed</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partially Signed</Badge>;
      case 'sent':
        return <Badge variant="outline">Sent for Signature</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

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
  const selectedStudentData = students.find(s => s.id === selectedStudent);
  const studentIs18Plus = selectedStudentData && 
    new Date().getFullYear() - new Date(selectedStudentData.date_of_birth || '').getFullYear() >= 18;

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
            {loading ? 'Generating...' : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Contract
              </>
            )}
          </Button>

          {generatedContract && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Contract
              </Button>
              <Button
                variant="outline"
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Parent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Preview & Signature Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>Contract Preview & Signature</span>
                {getStatusBadge()}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button size="sm" disabled={contractStatus !== 'completed'}>
                  <Send className="h-4 w-4 mr-2" />
                  {contractStatus === 'completed' ? 'Email Final Contract' : 'Complete Signatures First'}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {generatedContract && (
            <div className="space-y-6">
              {/* Contract Details */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Contract Number:</span>
                    <p>{generatedContract.contract.contract_number}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <p>{generatedContract.contract.status}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Monthly Tuition:</span>
                    <p>${generatedContract.contract.monthly_tuition}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Registration Fee:</span>
                    <p>${generatedContract.contract.registration_fee}</p>
                  </div>
                </div>
              </div>

              {/* Contract Content */}
              <div className="border rounded-lg bg-white">
                <div 
                  className="p-8 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedContract.html_content }}
                />
              </div>

              {/* Digital Signatures Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Digital Signatures</h3>
                <DigitalSignature
                  parentSignature={parentSignature}
                  studentSignature={studentSignature}
                  directorSignature={directorSignature}
                  onParentSign={(sig) => handleSignature('parent', sig)}
                  onStudentSign={(sig) => handleSignature('student', sig)}
                  onDirectorSign={(sig) => handleSignature('director', sig)}
                  studentIs18Plus={studentIs18Plus}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};