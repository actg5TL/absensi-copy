    // supabase/functions/send-leave-notification/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Nodemailer from 'npm:nodemailer@6.9.9';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts'; // Pastikan path ini benar

console.log('Function send-leave-notification initialized.');

// Ambil kredensial SMTP dari environment variables (yang di-set di Supabase Dashboard)
const GMAIL_SMTP_USER = Deno.env.get('GMAIL_SMTP_USERNAME');
const GMAIL_SMTP_PASS = Deno.env.get('GMAIL_SMTP_PASSWORD');
const GMAIL_SMTP_HOST = Deno.env.get('GMAIL_SMTP_HOST') || 'smtp.gmail.com';
const GMAIL_SMTP_PORT = parseInt(Deno.env.get('GMAIL_SMTP_PORT') || '587', 10);

// Ambil konfigurasi Supabase dari environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function getNotificationRecipientEmail(): Promise<string[] | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.');
    return null;
  }

  const tableName = 'app_settings';
  const keyColumn = 'setting_key';
  const keyValueToSearch = 'email_recipients';
  // PENTING: Sesuaikan 'setting_value' jika nama kolom untuk alamat email di tabel Anda berbeda
  const valueColumnToSelect = 'setting_value'; 

  const fetchURL = `${SUPABASE_URL}/rest/v1/${tableName}?${keyColumn}=eq.${keyValueToSearch}&select=${valueColumnToSelect}`;
  console.log(`Attempting to fetch recipient email from: ${fetchURL}`);

  try {
    const response = await fetch(
      fetchURL,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          // Minta satu objek jika datanya unik, ini lebih efisien
          // Jika 'email_recipients' tidak unik atau Anda ingin memastikan selalu array, hapus header Accept ini
          'Accept': 'application/vnd.pgrst.object+json', 
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to fetch recipient email. Status: ${response.status}. Response: ${errorBody}`);
      if (response.status === 404 || response.status === 406) { // 406 jika tidak ada row dan Accept header diset
         console.error(`Hint: Check if table '${tableName}', key_column '${keyColumn}' with value '${keyValueToSearch}', and value_column '${valueColumnToSelect}' are correct and data exists.`);
      }
      return null;
    }

    const data = await response.json();

    // Helper function to validate and trim a single email string
    const validateSingleEmail = (emailCandidate: any): string | null => {
      if (typeof emailCandidate === 'string') {
        const trimmedEmail = emailCandidate.trim();
        if (trimmedEmail.length > 0) {
          console.log(`Validated recipient email: '${trimmedEmail}'`);
          return trimmedEmail;
        } else {
          console.warn(`Extracted email string was empty or whitespace only after trimming. Original: '${emailCandidate}'`);
          return null;
        }
      }
      console.warn(`Email candidate was not a string or was null/undefined: ${JSON.stringify(emailCandidate)}`);
      return null;
    };

    const processRecipientData = (recipientData: any): string[] | null => {
      if (recipientData && typeof recipientData === 'object' && recipientData !== null) {
        // Assuming we want the email for 'leave_request'
        const leaveRequestEmails = recipientData.leave_request;
        if (Array.isArray(leaveRequestEmails) && leaveRequestEmails.length > 0) {
          const validEmails = leaveRequestEmails
            .map(email => validateSingleEmail(email)) // Validate each email
            .filter(email => email !== null) as string[]; // Filter out nulls

          if (validEmails.length > 0) {
            console.log(`Processed recipient emails for 'leave_request': ${JSON.stringify(validEmails)}`);
            return validEmails;
          } else {
            console.warn(`No valid emails found in 'leave_request' array after validation. Original array: ${JSON.stringify(leaveRequestEmails)}`);
            return null;
          }
        } else {
          console.warn(`'leave_request' array not found or empty in recipient data: ${JSON.stringify(recipientData)}`);
          return null;
        }
      } else {
        // If recipientData itself is a string, try to validate it directly (fallback for old format)
        if (typeof recipientData === 'string') {
            console.warn('Recipient data was a string, attempting to validate directly (fallback). This will return a single-element array if valid.');
            const singleEmail = validateSingleEmail(recipientData);
            return singleEmail ? [singleEmail] : null;
        }
        console.warn(`Recipient data in '${valueColumnToSelect}' was not a valid object or string: ${JSON.stringify(recipientData)}`);
        return null;
      }
    };

    // Jika menggunakan 'Accept': 'application/vnd.pgrst.object+json', data adalah objek tunggal
    if (data && typeof data === 'object' && data !== null && valueColumnToSelect in data) {
      // data[valueColumnToSelect] should contain the object like {"attendance":["..."],"leave_request":["..."]}
      return processRecipientData(data[valueColumnToSelect]);
    } else {
      // Fallback jika Accept header tidak digunakan atau data tidak sesuai format objek tunggal
      console.warn('Attempting to parse recipient email: Data format was not a single object as expected, or the key was missing. Trying array format.');
      console.log('Received data (raw):', JSON.stringify(data)); 
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null && valueColumnToSelect in data[0]) {
        // data[0][valueColumnToSelect] should contain the object
        return processRecipientData(data[0][valueColumnToSelect]);
      }
      console.error(`Could not extract email data from column '${valueColumnToSelect}' in the received data. Ensure this column exists, contains the email config, and the key '${keyValueToSearch}' is present in table '${tableName}'.`);
      return null;
    }
  } catch (error) {
    console.error('Error during getNotificationRecipientEmail execution:', error);
    return null;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    // Validasi environment variables SMTP
    if (!GMAIL_SMTP_USER || !GMAIL_SMTP_PASS) {
      console.error('Missing one or more required SMTP environment variables.');
      return new Response(JSON.stringify({ error: 'SMTP configuration missing on server.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Ambil email penerima notifikasi
  // Get recipient email(s) from database
  const recipientEmails = await getNotificationRecipientEmail(); // Changed variable name

  if (!recipientEmails || recipientEmails.length === 0) { // Updated check
    console.error("No valid recipient emails configured or found. Aborting email send.");
    return new Response(JSON.stringify({ error: "No valid recipient emails configured." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Parse request body
    const {
      applicantName,
      applicantEmail,
      department,
      leaveType,
      startDate,
      endDate,
      reason,
      additionalDetails,
    } = await req.json();

    console.log('Received leave request data:', { applicantName, leaveType });

    // Setup Nodemailer transporter
    const transporter = Nodemailer.createTransport({
      host: GMAIL_SMTP_HOST,
      port: GMAIL_SMTP_PORT,
      secure: GMAIL_SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: GMAIL_SMTP_USER,
        pass: GMAIL_SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
    from: `"${applicantName}" <${GMAIL_SMTP_USER}>`,
    to: recipientEmails, // Nodemailer accepts an array of strings for 'to'
    subject: `Pengajuan Izin Baru: ${applicantName} - ${leaveType}`,
      html: `
        <h2>Notifikasi Izin Baru</h2>
        <p><strong>Nama:</strong> ${applicantName || 'N/A'}</p>
        <p><strong>Email:</strong> ${applicantEmail || 'N/A'}</p>
        <p><strong>Departemen:</strong> ${department || 'N/A'}</p>
        <p><strong>Jenis Izin:</strong> ${leaveType}</p>
        <p><strong>Tanggal Mulai:</strong> ${new Date(startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Tanggal Selesai:</strong> ${new Date(endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Alasan:</strong></p>
        <p>${reason || 'Tidak ada alasan yang diberikan.'}</p>
        ${additionalDetails ? `<p><strong>Detail Tambahan:</strong></p><p>${additionalDetails}</p>` : ''}
        <hr>
        <p><em>Email ini dikirim otomatis oleh sistem Absensi & Izin Karyawan.</em></p>
      `,
    };

    // Kirim email
    console.log(`Attempting to send email to ${JSON.stringify(recipientEmails)}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId, info.response);

    return new Response(JSON.stringify({ message: 'Leave request notification sent successfully.', details: info.messageId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing request or sending email:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Failed to send leave notification.', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
