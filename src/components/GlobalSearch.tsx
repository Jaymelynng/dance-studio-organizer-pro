import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, FileText, Calendar, CreditCard, MessageSquare, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Global search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['global-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return null;

      const [studentsResult, contractsResult, communicationsResult, documentsResult] = await Promise.all([
        // Search students
        supabase
          .from('students')
          .select('id, first_name, last_name, division, status, parent:parents(first_name, last_name, email)')
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`),
        
        // Search contracts
        supabase
          .from('contracts')
          .select('id, contract_number, season, division, status, student:students(first_name, last_name)')
          .or(`contract_number.ilike.%${searchQuery}%,season.ilike.%${searchQuery}%`),
        
        // Search communications
        supabase
          .from('communications')
          .select('id, subject, status, created_at')
          .ilike('subject', `%${searchQuery}%`),
        
        // Search documents
        supabase
          .from('documents')
          .select('id, title, status, student:students(first_name, last_name)')
          .ilike('title', `%${searchQuery}%`)
      ]);

      return {
        students: studentsResult.data || [],
        contracts: contractsResult.data || [],
        communications: communicationsResult.data || [],
        documents: documentsResult.data || []
      };
    },
    enabled: searchQuery.length >= 2
  });

  const handleResultClick = (type: string, id: string) => {
    switch (type) {
      case 'student':
        navigate(`/students/${id}`);
        break;
      case 'contract':
        navigate(`/contracts`);
        break;
      case 'communication':
        navigate(`/communications`);
        break;
      case 'document':
        navigate(`/documents`);
        break;
    }
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Inactive': return 'status-inactive';
      case 'Sent': return 'status-active';
      case 'Draft': return 'status-pending';
      default: return 'bg-muted';
    }
  };

  const hasResults = searchResults && (
    searchResults.students.length > 0 ||
    searchResults.contracts.length > 0 ||
    searchResults.communications.length > 0 ||
    searchResults.documents.length > 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Global Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, contracts, communications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-[55vh] sm:max-h-[50vh] overflow-y-auto space-y-4">
            {isLoading && searchQuery.length >= 2 && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && !isLoading && !hasResults && (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}

            {searchResults && (
              <>
                {/* Students */}
                {searchResults.students.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Students ({searchResults.students.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.students.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick('student', student.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {student.first_name} {student.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {student.division}
                              </p>
                              <p className="text-xs text-muted-foreground truncate sm:hidden">
                                {student.parent?.first_name} {student.parent?.last_name}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                              <Badge className={getStatusColor(student.status || 'Pending')} variant="outline">
                                {student.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contracts */}
                {searchResults.contracts.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Contracts ({searchResults.contracts.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.contracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick('contract', contract.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{contract.contract_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {contract.student?.first_name} {contract.student?.last_name} • {contract.season}
                              </p>
                            </div>
                            <Badge className={getStatusColor(contract.status || 'Draft')}>
                              {contract.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communications */}
                {searchResults.communications.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Communications ({searchResults.communications.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.communications.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick('communication', comm.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{comm.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(comm.created_at!).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(comm.status || 'Draft')}>
                              {comm.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {searchResults.documents.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documents ({searchResults.documents.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick('document', doc.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.student?.first_name} {doc.student?.last_name}
                              </p>
                            </div>
                            <Badge className={getStatusColor(doc.status || 'Draft')}>
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {searchQuery.length < 2 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Type at least 2 characters to search</p>
                <p className="text-sm mt-2">Search across students, contracts, communications, and documents</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};