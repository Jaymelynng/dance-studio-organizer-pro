import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Badge } from '@/components/ui/badge';
import { PenTool, Calendar, User, Check } from 'lucide-react';

interface Signature {
  data: string;
  timestamp: string;
  ipAddress?: string;
}

interface DigitalSignatureProps {
  parentSignature?: Signature;
  studentSignature?: Signature;
  directorSignature?: Signature;
  onParentSign?: (signature: string) => void;
  onStudentSign?: (signature: string) => void;
  onDirectorSign?: (signature: string) => void;
  studentIs18Plus?: boolean;
  readonly?: boolean;
}

export const DigitalSignature = ({
  parentSignature,
  studentSignature,
  directorSignature,
  onParentSign,
  onStudentSign,
  onDirectorSign,
  studentIs18Plus = false,
  readonly = false
}: DigitalSignatureProps) => {
  const [activeSignature, setActiveSignature] = useState<'parent' | 'student' | 'director' | null>(null);

  const handleSignature = (type: 'parent' | 'student' | 'director', signatureData: string) => {
    switch (type) {
      case 'parent':
        onParentSign?.(signatureData);
        break;
      case 'student':
        onStudentSign?.(signatureData);
        break;
      case 'director':
        onDirectorSign?.(signatureData);
        break;
    }
    setActiveSignature(null);
  };

  const SignatureSection = ({ 
    type, 
    signature, 
    title, 
    required = false 
  }: { 
    type: 'parent' | 'student' | 'director';
    signature?: Signature;
    title: string;
    required?: boolean;
  }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>{title}</span>
            {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </div>
          {signature && (
            <Badge variant="default" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Signed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {signature ? (
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 border">
              <img 
                src={signature.data} 
                alt={`${title} signature`}
                className="max-w-full h-auto max-h-32 mx-auto"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Signed: {new Date(signature.timestamp).toLocaleString()}</span>
              </div>
              {signature.ipAddress && (
                <span>IP: {signature.ipAddress}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg p-8 border-2 border-dashed border-muted-foreground/30 text-center">
              <PenTool className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                {readonly ? 'Signature pending' : 'Click to sign digitally'}
              </p>
            </div>
            {!readonly && (
              <Button
                onClick={() => setActiveSignature(type)}
                className="w-full"
                variant="outline"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Sign {title.split(' ')[0]}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SignatureSection
          type="parent"
          signature={parentSignature}
          title="Parent/Guardian Signature"
          required
        />
        
        {studentIs18Plus && (
          <SignatureSection
            type="student"
            signature={studentSignature}
            title="Student Signature"
            required
          />
        )}
        
        <SignatureSection
          type="director"
          signature={directorSignature}
          title="Director Signature"
          required
        />
      </div>

      {/* Signature Dialog */}
      <Dialog open={activeSignature !== null} onOpenChange={(open) => !open && setActiveSignature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeSignature === 'parent' && 'Parent/Guardian Signature'}
              {activeSignature === 'student' && 'Student Signature'}
              {activeSignature === 'director' && 'Director Signature'}
            </DialogTitle>
          </DialogHeader>
          
          {activeSignature && (
            <SignaturePad
              title={`${activeSignature === 'parent' ? 'Parent/Guardian' : 
                     activeSignature === 'student' ? 'Student' : 'Director'} Signature`}
              onSignature={(data) => handleSignature(activeSignature, data)}
              onCancel={() => setActiveSignature(null)}
              required
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};