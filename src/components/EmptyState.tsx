import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => {
  return (
    <Card className="shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon && (
          <div className="mb-6 p-4 rounded-full bg-muted">
            {icon}
          </div>
        )}
        <CardTitle className="text-2xl mb-4 text-muted-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-lg mb-8 max-w-md">
          {description}
        </CardDescription>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction} 
            variant="elegant"
            className="px-8 py-3"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};