// backend/utils/email.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email to:", options.email);

  // If Brevo API Key is configured, use the Brevo HTTP API (Port 443 - Bypasses Railway SMTP blocks)
  if (process.env.BREVO_API_KEY) {
    console.log("Using Brevo HTTP API to send email...");
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "Punto",
            email: process.env.EMAIL_USERNAME || "mon0995020@gmail.com",
          },
          to: [
            {
              email: options.email,
            },
          ],
          subject: options.subject,
          htmlContent: `<p>${options.message.replace(/\n/g, "<br>")}</p>`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      console.log("✅ Email sent successfully via Brevo HTTP API:", data);
      return data;
    } catch (error) {
      console.error("❌ ERROR SENDING EMAIL VIA BREVO API:", error);
      throw error;
    }
  }

  // Fallback to Nodemailer SMTP (for local development or if SMTP is allowed)
  console.log("Using Nodemailer SMTP fallback...");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `Punto <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully via SMTP to:", options.email);
  } catch (error) {
    console.error("❌ ERROR SENDING EMAIL VIA SMTP:", error);
    throw error;
  }
};

module.exports = sendEmail;
