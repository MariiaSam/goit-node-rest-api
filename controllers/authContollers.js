import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";

import HttpError from "../helpers/HttpError.js";
import wrapper  from "../helpers/wrapper.js";
import dotenv from "dotenv";

import { User } from "../models/user.js";


dotenv.config();

const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if(user){
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});
    const { email: userEmail, subscription } = newUser;

    res.status(201).json({
        user: {
          email: userEmail,
          subscription,
        },
      });
}
