import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL, PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua", 
  port: 465,
  secure: true,    
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL };
  await transporter.sendMail(email);
  return true;
};

export default sendEmail;
