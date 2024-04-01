import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_EMAIL, META_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua", 
  port: 465,
  secure: true,    
  auth: {
    user: META_EMAIL,
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: META_EMAIL };
  await transporter.sendMail(email);
  return true;
};

export default sendEmail;
