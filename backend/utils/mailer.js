const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS,
  },
});

const sendLeadNotification = async (leadData) => {
  try {
    const mailOptions = {
      from: `"Arvies Website" <${process.env.MAIL_USER}>`,
      to: "arviesgroup@gmail.com", 
      subject: "📩 New Lead Received",
      html: `
        <h2>New Lead Details</h2>
        <p><b>Name:</b> ${leadData.name}</p>
        <p><b>Email:</b> ${leadData.email}</p>
        <p><b>Phone:</b> ${leadData.phone}</p>
        <p><b>Message:</b> ${leadData.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Notification email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendLeadNotification;
