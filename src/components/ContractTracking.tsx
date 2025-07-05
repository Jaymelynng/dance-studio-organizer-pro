import { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Check, Clock, AlertCircle, Mail, Eye } from 'lucide-react';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Signed': return 'bg-blue-100 text-blue-800';
    case 'Sent': return 'bg-yellow-100 text-yellow-800';
    case 'Draft': return 'bg-gray-100 text-gray-800';
    case 'Expired': return 'bg-red-100 text-red-800';
    case 'Terminated': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const SignatureStatus = ({ date, label }: { date: string | null, label: string }) => {
  if (date) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Check className="h-4 w-4" />
        <span className="text-sm">{label}: {format(new Date(date), 'MMM d, yyyy')}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-yellow-600">
      <Clock className="h-4 w-4" />
      <span className="text-sm">{label}: Pending</span>
    </div>
  );
};

export const ContractTracking = () => {
  const { contracts, loading, updateContractStatus } = useContracts();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const filteredContracts = contracts.filter(contract => 
    statusFilter === 'all' || contract.status === statusFilter
  );

  const getSignatureProgress = (contract: any) => {
    const signatures = [
      contract.parent_signature_date,
      contract.student_signature_date,
      contract.director_signature_date
    ].filter(Boolean);
    return `${signatures.length}/3`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contract Tracking</h2>
          <p className="text-muted-foreground">Monitor contract status and signatures</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contracts</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Signed">Signed</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Contracts ({filteredContracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract #</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signatures</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No contracts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono text-sm">
                      {contract.contract_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {contract.students.first_name} {contract.students.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.season}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {contract.students.parents.first_name} {contract.students.parents.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.students.parents.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{contract.division}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)} variant="secondary">
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {getSignatureProgress(contract)}
                        </span>
                        {getSignatureProgress(contract) === '3/3' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(contract.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedContract(contract)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Contract Details - {selectedContract?.contract_number}</DialogTitle>
                            </DialogHeader>
                            {selectedContract && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Student Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <p><strong>Name:</strong> {selectedContract.students.first_name} {selectedContract.students.last_name}</p>
                                      <p><strong>Division:</strong> {selectedContract.division}</p>
                                      <p><strong>Season:</strong> {selectedContract.season}</p>
                                      <p><strong>Monthly Tuition:</strong> ${selectedContract.monthly_tuition}</p>
                                      <p><strong>Registration Fee:</strong> ${selectedContract.registration_fee}</p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Parent Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <p><strong>Name:</strong> {selectedContract.students.parents.first_name} {selectedContract.students.parents.last_name}</p>
                                      <p><strong>Email:</strong> {selectedContract.students.parents.email}</p>
                                      <p><strong>Phone:</strong> {selectedContract.students.parents.phone || 'Not provided'}</p>
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Signature Status</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <SignatureStatus 
                                      date={selectedContract.parent_signature_date} 
                                      label="Parent Signature"
                                    />
                                    <SignatureStatus 
                                      date={selectedContract.student_signature_date} 
                                      label="Student Signature"
                                    />
                                    <SignatureStatus 
                                      date={selectedContract.director_signature_date} 
                                      label="Director Signature"
                                    />
                                  </CardContent>
                                </Card>
                                
                                <div className="flex justify-between">
                                  <div className="flex gap-2">
                                    <Select
                                      value={selectedContract.status}
                                      onValueChange={(value) => updateContractStatus(selectedContract.id, value as 'Draft' | 'Sent' | 'Signed' | 'Active' | 'Expired' | 'Terminated')}
                                    >
                                      <SelectTrigger className="w-40">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Sent">Sent</SelectItem>
                                        <SelectItem value="Signed">Signed</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                        <SelectItem value="Terminated">Terminated</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <Button variant="outline">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send to Parent
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};