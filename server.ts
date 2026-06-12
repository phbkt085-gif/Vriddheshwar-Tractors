import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

// Email Helper
async function sendEnquiryEmail(enquiry: { name: string; phone: string; model?: string; message?: string }) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST || 'smtp.office365.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const receiver = process.env.RECEIVER_EMAIL || user;

  if (!user || !pass) {
    console.warn("Email credentials missing. Notification not sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass }
  });

  const mailOptions = {
    from: `"Vrudheshwar Tractors Website" <${user}>`,
    to: receiver,
    subject: `New Lead: ${enquiry.name}`,
    text: `
      You have a new enquiry from the website:
      
      Name: ${enquiry.name}
      Phone: ${enquiry.phone}
      Model Interested: ${enquiry.model || 'Not specified'}
      Message: ${enquiry.message || 'None'}
      
      Date: ${new Date().toLocaleString()}
    `,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e11d48;">New Tractor Enquiry</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Model Interested:</strong> ${enquiry.model || 'Not specified'}</p>
        <p><strong>Message:</strong> ${enquiry.message || 'None'}</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">Received at: ${new Date().toLocaleString()}</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/enquiries", async (req, res) => {
    try {
      const { name, phone, model, message } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone are required" });
      }

      let dbSuccess = false;
      try {
        const supabase = getSupabase();
        const result = await supabase
          .from('enquiries')
          .insert([{ name, phone, model, message }])
          .select();
        
        if (result.error) {
          if (result.error.code === '42501') {
             console.log("Supabase RLS Error: New row violates row-level security. " +
               "Fix: Go to Supabase -> SQL Editor and run: ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY; " +
               "OR ensure you are using the 'service_role' key in Settings -> Secrets.");
          } else {
             console.log("Supabase info: Database save skipped or failed.", result.error.message);
          }
        } else {
          dbSuccess = true;
          console.log("Supabase: Enquiry saved to database successfully.");
        }
      } catch (err: any) {
        console.log("Supabase info: Connection skipped.", err.message);
      }

      // Always attempt email notification
      await sendEnquiryEmail({ name, phone, model, message });

      return res.status(200).json({ 
        success: true, 
        dbSaved: dbSuccess,
        message: dbSuccess ? "Enquiry saved and notification sent." : "Enquiry received (notification sent, but DB save failed)."
      });
    } catch (error: any) {
      console.error("Server error:", error);
      // Fallback for when keys are not configured yet
      if (error.message.includes("SUPABASE_URL")) {
        return res.status(500).json({ 
          error: "Database configuration missing. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Settings -> Secrets." 
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
