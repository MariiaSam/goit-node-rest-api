import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";

import HttpError from "../helpers/HttpError.js";
import wrapper from "../helpers/wrapper.js";

import { User } from "../models/user.js";

dotenv.config();

const { SECRET_KEY } = process.env;
const avatarsDir = path.resolve("public", 'avatars');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
  });
  const { email: userEmail, subscription } = newUser;

  res.status(201).json({
    user: {
      email: userEmail,
      subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  const updatedUserSubscription = await User.findByIdAndUpdate(_id, {
    subscription,
  });
  res.json(updatedUserSubscription);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "Logout success" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const userUpdateAvatar = await User.findById(_id);

  if (!userUpdateAvatar) {
    throw HttpError(401, "Unauthorized");
  }

  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.resolve(avatarsDir, filename);
  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).write(tempUpload);

  await fs.rename(tempUpload, resultUpload)

  const avatarUrl = path.resolve('avatars', filename)
  await User.findByIdAndUpdate(_id, { avatarURL })

  res.json({ avatarUrl })
};

export default {
  registerUser: wrapper(registerUser),
  login: wrapper(login),
  getCurrent: wrapper(getCurrent),
  updateSubscription: wrapper(updateSubscription),
  logout: wrapper(logout),
  updateAvatar: wrapper(updateAvatar),
};
