import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionBuilder } from './SectionBuilder';
import { ContractSectionData } from './ContractSection';
import { CompanyInfoCard } from './CompanyInfoCard';
import { SeasonInfoCard } from './SeasonInfoCard';
import { EnrollmentTermsCard } from './EnrollmentTermsCard';
import { TuitionFeesCard } from './TuitionFeesCard';

export interface EnglishFormData {
  // Basic contract info
  companyName: string;
  season: string;
  seasonStartDate: string;
  seasonEndDate: string;
  directorEmail: string;
  studioContact: string;
  
  // Financial terms
  terminationNotice: string;
  dismissalPeriod: string;
  professionalFee: string;
  preProFee: string;
  supplementalFee: string;
  paymentDueDate: string;
  invoiceSendDate: string;
  lateFee: string;
  lateGracePeriod: string;
  
  // Content sections - this is the new part
  contractSections: ContractSectionData[];
}

interface EnglishEditorProps {
  formData: EnglishFormData;
  onChange: (field: keyof EnglishFormData, value: any) => void;
}

export const EnglishEditor = ({ formData, onChange }: EnglishEditorProps) => {
  const handleSectionsChange = (sections: ContractSectionData[]) => {
    onChange('contractSections', sections);
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content" className="font-semibold">📝 Edit Contract Content</TabsTrigger>
        <TabsTrigger value="basic">⚙️ Basic Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6">
        <CompanyInfoCard
          companyName={formData.companyName}
          directorEmail={formData.directorEmail}
          studioContact={formData.studioContact}
          onChange={onChange}
        />

        <SeasonInfoCard
          seasonStartDate={formData.seasonStartDate}
          seasonEndDate={formData.seasonEndDate}
          onChange={onChange}
        />

        <EnrollmentTermsCard
          terminationNotice={formData.terminationNotice}
          dismissalPeriod={formData.dismissalPeriod}
          onChange={onChange}
        />

        <TuitionFeesCard
          professionalFee={formData.professionalFee}
          preProFee={formData.preProFee}
          supplementalFee={formData.supplementalFee}
          paymentDueDate={formData.paymentDueDate}
          invoiceSendDate={formData.invoiceSendDate}
          lateFee={formData.lateFee}
          lateGracePeriod={formData.lateGracePeriod}
          onChange={onChange}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Contract Content Builder
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This is where you build the main content of your contract. Add sections like policies, 
              terms, and requirements. Each section can be customized with your own text.
            </p>
          </CardHeader>
          <CardContent>
            <SectionBuilder
              sections={formData.contractSections || []}
              onSectionsChange={handleSectionsChange}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};