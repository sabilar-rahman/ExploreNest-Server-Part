import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, emailHtml: string) => {
  const transporter = nodemailer.createTransport({
    host: config.nodemailer_host,
    port: 587,
    secure: false,
    auth: {
      user: config.user_email,
      pass: config.user_pass,
    },
  });

  await transporter.sendMail({
    from: "sabilar15-3609@diu.edu.bd", // sender address
    to,
    subject: "Reset Your Password Securely🔐", // Subject line
    text: "We received a request to reset your password. You can reset it by clicking the link below:", // plain text body
    html: emailHtml,
  });
};
