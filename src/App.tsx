import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentEnrollment from "./pages/StudentEnrollment";
import ContractManagement from "./pages/ContractManagement";
import ContractTemplateEditor from "./pages/ContractTemplateEditor";
import StudentProfile from "./pages/StudentProfile";
import Communications from "./pages/Communications";
import Documents from "./pages/Documents";
import Calendar from "./pages/Calendar";
import PaymentCenter from "./pages/PaymentCenter";
import TemplateCenter from "./pages/TemplateCenter";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/enroll" element={<StudentEnrollment />} />
          <Route path="/contracts" element={<ContractManagement />} />
          <Route path="/contracts/edit/:id" element={<ContractTemplateEditor />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/payments" element={<PaymentCenter />} />
          <Route path="/templates" element={<TemplateCenter />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
