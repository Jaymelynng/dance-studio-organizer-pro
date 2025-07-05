import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html_content: string;
  template_id?: string;
  communication_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { to, subject, html_content, template_id, communication_id }: EmailRequest = await req.json();

    console.log('Sending email to:', to);

    const emailResponse = await resend.emails.send({
      from: "Dégagé Classical Conservatory <cody@degageclassical.com>",
      to: to,
      subject: subject,
      html: html_content,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update communication status if provided
    if (communication_id) {
      await supabase
        .from('communications')
        .update({ 
          status: 'Sent', 
          sent_at: new Date().toISOString(),
          delivery_stats: { sent: to.length, delivered: 0, opened: 0, clicked: 0 }
        })
        .eq('id', communication_id);

      // Create activity log
      await supabase
        .from('activities')
        .insert({
          type: 'communication',
          description: `Email sent: "${subject}" to ${to.length} recipient(s)`,
          communication_id: communication_id,
          status: 'success'
        });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: emailResponse.data?.id,
      recipients: to.length 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending email:", error);
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