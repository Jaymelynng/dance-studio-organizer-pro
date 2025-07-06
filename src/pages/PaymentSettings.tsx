import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentCategoryManager from '@/components/PaymentCategoryManager';
import TuitionRatesManager from '@/components/TuitionRatesManager';

const PaymentSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-4 sm:p-6">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Payment Settings</h1>
            <p className="text-white/80">Manage payment categories and tuition rates</p>
          </div>
        </div>

        <div className="space-y-6">
          <TuitionRatesManager />
          <PaymentCategoryManager />
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;