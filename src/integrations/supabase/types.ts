export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          communication_id: string | null
          contract_id: string | null
          created_at: string | null
          description: string
          document_id: string | null
          id: string
          metadata: Json | null
          parent_id: string | null
          payment_id: string | null
          status: string | null
          student_id: string | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          communication_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          description: string
          document_id?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          payment_id?: string | null
          status?: string | null
          student_id?: string | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          communication_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          description?: string
          document_id?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          payment_id?: string | null
          status?: string | null
          student_id?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activities_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_recipients: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          communication_id: string | null
          created_at: string | null
          email: string
          id: string
          opened_at: string | null
          parent_id: string | null
          status: Database["public"]["Enums"]["communication_status"] | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          communication_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          opened_at?: string | null
          parent_id?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          communication_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          opened_at?: string | null
          parent_id?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_recipients_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_recipients_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          created_at: string | null
          delivery_stats: Json | null
          html_content: string
          id: string
          plain_content: string | null
          recipient_emails: string[]
          scheduled_for: string | null
          sender_email: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["communication_status"] | null
          subject: string
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_stats?: Json | null
          html_content: string
          id?: string
          plain_content?: string | null
          recipient_emails: string[]
          scheduled_for?: string | null
          sender_email?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject: string
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_stats?: Json | null
          html_content?: string
          id?: string
          plain_content?: string | null
          recipient_emails?: string[]
          scheduled_for?: string | null
          sender_email?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          created_at: string
          division: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          season: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          division: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          season: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          division?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          season?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          contract_end_date: string | null
          contract_number: string
          contract_start_date: string | null
          contract_terms: Json | null
          created_at: string | null
          director_signature_date: string | null
          division: Database["public"]["Enums"]["division_type"]
          id: string
          monthly_tuition: number
          notes: string | null
          parent_signature_date: string | null
          registration_fee: number
          season: string
          status: Database["public"]["Enums"]["contract_status"] | null
          student_id: string | null
          student_signature_date: string | null
          termination_date: string | null
          termination_reason: string | null
          updated_at: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_number: string
          contract_start_date?: string | null
          contract_terms?: Json | null
          created_at?: string | null
          director_signature_date?: string | null
          division: Database["public"]["Enums"]["division_type"]
          id?: string
          monthly_tuition: number
          notes?: string | null
          parent_signature_date?: string | null
          registration_fee: number
          season: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          student_id?: string | null
          student_signature_date?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_number?: string
          contract_start_date?: string | null
          contract_terms?: Json | null
          created_at?: string | null
          director_signature_date?: string | null
          division?: Database["public"]["Enums"]["division_type"]
          id?: string
          monthly_tuition?: number
          notes?: string | null
          parent_signature_date?: string | null
          registration_fee?: number
          season?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          student_id?: string | null
          student_signature_date?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      document_responses: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          ip_address: unknown | null
          parent_id: string | null
          parent_signature: string | null
          parent_signature_date: string | null
          response_data: Json
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: unknown | null
          parent_id?: string | null
          parent_signature?: string | null
          parent_signature_date?: string | null
          response_data: Json
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: unknown | null
          parent_id?: string | null
          parent_signature?: string | null
          parent_signature_date?: string | null
          response_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "document_responses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_responses_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          requires_signature: boolean | null
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          requires_signature?: boolean | null
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          requires_signature?: boolean | null
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          html_content: string
          id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          student_id: string | null
          template_id: string | null
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          html_content: string
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          student_id?: string | null
          template_id?: string | null
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          html_content?: string
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          student_id?: string | null
          template_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      payment_categories: {
        Row: {
          created_at: string | null
          default_amount: number | null
          description: string | null
          division_specific: boolean | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_amount?: number | null
          description?: string | null
          division_specific?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_amount?: number | null
          description?: string | null
          division_specific?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_schedules: {
        Row: {
          amount: number
          category_id: string | null
          contract_id: string | null
          created_at: string | null
          due_date: string
          id: string
          payment_type: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "payment_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_schedules_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          id: string
          late_fee: number | null
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_schedule_id: string | null
          student_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_schedule_id?: string | null
          student_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_schedule_id?: string | null
          student_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "payment_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_schedule_id_fkey"
            columns: ["payment_schedule_id"]
            isOneToOne: false
            referencedRelation: "payment_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          dance_experience: string | null
          date_of_birth: string | null
          dietary_restrictions: string | null
          division: Database["public"]["Enums"]["division_type"]
          first_name: string
          goals: string | null
          grade_level: string | null
          id: string
          last_name: string
          medical_notes: string | null
          parent_id: string | null
          school_name: string | null
          status: Database["public"]["Enums"]["student_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dance_experience?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          division: Database["public"]["Enums"]["division_type"]
          first_name: string
          goals?: string | null
          grade_level?: string | null
          id?: string
          last_name: string
          medical_notes?: string | null
          parent_id?: string | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["student_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dance_experience?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          division?: Database["public"]["Enums"]["division_type"]
          first_name?: string
          goals?: string | null
          grade_level?: string | null
          id?: string
          last_name?: string
          medical_notes?: string | null
          parent_id?: string | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["student_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      tuition_rates: {
        Row: {
          created_at: string | null
          division: Database["public"]["Enums"]["division_type"]
          effective_date: string | null
          id: string
          is_active: boolean | null
          monthly_tuition: number
          registration_fee: number
          season: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          division: Database["public"]["Enums"]["division_type"]
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_tuition: number
          registration_fee: number
          season?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          division?: Database["public"]["Enums"]["division_type"]
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_tuition?: number
          registration_fee?: number
          season?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wellness_partners: {
        Row: {
          contact_info: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          specialty: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          specialty: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          specialty?: string
        }
        Relationships: []
      }
      wellness_services: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          notes: string | null
          partner_id: string | null
          service_date: string | null
          service_type: string
          student_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          service_date?: string | null
          service_type: string
          student_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          service_date?: string | null
          service_type?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wellness_services_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "wellness_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wellness_services_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_contract_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_monthly_tuition: {
        Args: { div: Database["public"]["Enums"]["division_type"] }
        Returns: number
      }
      get_registration_fee: {
        Args: { div: Database["public"]["Enums"]["division_type"] }
        Returns: number
      }
    }
    Enums: {
      activity_type:
        | "enrollment"
        | "payment"
        | "contract"
        | "communication"
        | "document"
        | "system"
      communication_status:
        | "Draft"
        | "Sent"
        | "Delivered"
        | "Opened"
        | "Clicked"
        | "Replied"
        | "Failed"
      contract_status:
        | "Draft"
        | "Sent"
        | "Signed"
        | "Active"
        | "Expired"
        | "Terminated"
      division_type: "Professional" | "Pre-Professional" | "Supplemental"
      document_status: "Draft" | "Published" | "Sent" | "Completed" | "Expired"
      payment_method: "Square" | "Venmo" | "Check" | "Cash" | "Bank Transfer"
      payment_status: "Pending" | "Paid" | "Overdue" | "Partial" | "Refunded"
      student_status: "Active" | "Pending" | "Inactive" | "Withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "enrollment",
        "payment",
        "contract",
        "communication",
        "document",
        "system",
      ],
      communication_status: [
        "Draft",
        "Sent",
        "Delivered",
        "Opened",
        "Clicked",
        "Replied",
        "Failed",
      ],
      contract_status: [
        "Draft",
        "Sent",
        "Signed",
        "Active",
        "Expired",
        "Terminated",
      ],
      division_type: ["Professional", "Pre-Professional", "Supplemental"],
      document_status: ["Draft", "Published", "Sent", "Completed", "Expired"],
      payment_method: ["Square", "Venmo", "Check", "Cash", "Bank Transfer"],
      payment_status: ["Pending", "Paid", "Overdue", "Partial", "Refunded"],
      student_status: ["Active", "Pending", "Inactive", "Withdrawn"],
    },
  },
} as const
