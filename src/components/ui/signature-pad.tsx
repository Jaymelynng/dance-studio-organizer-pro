import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Check, X } from 'lucide-react';

interface SignaturePadProps {
  onSignature: (signature: string) => void;
  onCancel?: () => void;
  title?: string;
  placeholder?: string;
  required?: boolean;
}

export const SignaturePad = ({ 
  onSignature, 
  onCancel, 
  title = "Digital Signature", 
  placeholder = "Sign here",
  required = false 
}: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/tablet
    setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // High DPI
    canvas.height = rect.height * 2;
    context.scale(2, 2);

    // Configure drawing style
    context.strokeStyle = '#2c3e50';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Clear canvas with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(event);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    
    setIsDrawing(false);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.beginPath();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureData = canvas.toDataURL('image/png');
    onSignature(signatureData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {required && <span className="text-destructive text-sm">*Required</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-muted-foreground text-lg">
                  {isMobile ? 'Use your finger to sign' : placeholder}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={clearSignature}
              disabled={!hasSignature}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
            
            <Button
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Save Signature
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};