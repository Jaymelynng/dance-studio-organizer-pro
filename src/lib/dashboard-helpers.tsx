import React from "react";
import { 
  FileText, 
  DollarSign, 
  UserCheck,
  AlertCircle
} from "lucide-react";

export const getDivisionColor = (division: string) => {
  switch (division) {
    case "Professional":
      return "division-professional";
    case "Pre-Professional":
      return "division-pre-professional";
    case "Supplemental":
      return "division-supplemental";
    default:
      return "bg-muted";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "status-active";
    case "Pending":
      return "status-pending";
    case "Inactive":
      return "status-inactive";
    default:
      return "bg-muted";
  }
};

export const getTaskIcon = (type: string) => {
  switch (type) {
    case "signature":
      return <FileText className="h-4 w-4 text-warning" />;
    case "payment":
      return <DollarSign className="h-4 w-4 text-destructive" />;
    case "document":
      return <FileText className="h-4 w-4 text-primary" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export const getActivityIcon = (type: string) => {
  switch (type) {
    case "enrollment":
      return <UserCheck className="h-4 w-4 text-success" />;
    case "payment":
      return <DollarSign className="h-4 w-4 text-success" />;
    case "contract":
      return <FileText className="h-4 w-4 text-warning" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "text-destructive border-destructive bg-destructive/10";
    case "medium":
      return "text-warning border-warning bg-warning/10";
    case "low":
      return "text-muted-foreground border-muted-foreground bg-muted/10";
    default:
      return "text-muted-foreground";
  }
};