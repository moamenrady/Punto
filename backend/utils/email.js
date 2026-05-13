// backend/utils/email.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email to:", options.email);
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Punto <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: 
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ ERROR SENDING EMAIL:", error);
    throw error;
  }
};

module.exports = sendEmail;
