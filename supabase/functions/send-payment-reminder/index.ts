import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentReminderRequest {
  student_ids?: string[];
  send_all_overdue?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { student_ids, send_all_overdue = true }: PaymentReminderRequest = await req.json();

    // Get overdue payment schedules
    let query = supabase
      .from('payment_schedules')
      .select(`
        *,
        contract:contracts(
          student:students(
            id,
            first_name,
            last_name,
            parent:parents(
              first_name,
              last_name,
              email
            )
          ),
          monthly_tuition,
          season,
          division
        )
      `)
      .eq('status', 'Pending')
      .lt('due_date', new Date().toISOString().split('T')[0]);

    if (student_ids && !send_all_overdue) {
      query = query.in('contract.student_id', student_ids);
    }

    const { data: overdue_payments, error } = await query;

    if (error) throw error;

    console.log('Found overdue payments:', overdue_payments?.length);

    const reminders_sent = [];

    for (const payment of overdue_payments || []) {
      if (!payment.contract?.student?.parent?.email) continue;

      const student = payment.contract.student;
      const parent = student.parent;
      const contract = payment.contract;

      // Calculate days overdue
      const daysOverdue = Math.floor(
        (new Date().getTime() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      const html_content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Dégagé Classical Conservatory</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Payment Reminder</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p>Dear ${parent.first_name} ${parent.last_name},</p>
            
            <p>This is a friendly reminder that a payment for <strong>${student.first_name} ${student.last_name}</strong> is past due.</p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #dc3545;">Payment Details</h3>
              <p style="margin: 5px 0;"><strong>Student:</strong> ${student.first_name} ${student.last_name}</p>
              <p style="margin: 5px 0;"><strong>Division:</strong> ${contract.division}</p>
              <p style="margin: 5px 0;"><strong>Season:</strong> ${contract.season}</p>
              <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${payment.amount}</p>
              <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(payment.due_date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Days Overdue:</strong> ${daysOverdue} days</p>
            </div>
            
            <p>Please submit your payment as soon as possible to avoid any late fees or interruption of services.</p>
            
            <p>If you have any questions or need to discuss payment arrangements, please don't hesitate to contact us.</p>
            
            <p>Thank you for your prompt attention to this matter.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Dégagé Classical Conservatory</strong><br>
              Administration Team
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px;">
            <p>This is an automated reminder. Please contact us if you believe this notice was sent in error.</p>
          </div>
        </div>
      `;

      // Create communication record
      const { data: communication } = await supabase
        .from('communications')
        .insert({
          subject: `Payment Reminder - ${student.first_name} ${student.last_name}`,
          html_content,
          recipient_emails: [parent.email],
          status: 'Draft'
        })
        .select()
        .single();

      if (communication) {
        // Send email via the send-email function
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            to: [parent.email],
            subject: `Payment Reminder - ${student.first_name} ${student.last_name}`,
            html_content,
            communication_id: communication.id
          })
        });

        if (emailResponse.ok) {
          reminders_sent.push({
            student_name: `${student.first_name} ${student.last_name}`,
            parent_email: parent.email,
            amount: payment.amount,
            days_overdue: daysOverdue
          });
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      reminders_sent: reminders_sent.length,
      recipients: reminders_sent
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending payment reminders:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);