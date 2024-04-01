import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import wrapper from "../helpers/wrapper.js";
import sendEmail from "../helpers/sendEmail.js";

import { User } from "../models/user.js";

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken
  });

  const { email: userEmail, subscription } = newUser;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify your email</a>`
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: userEmail,
      subscription,
    },
  });
};

const verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    res.status(400).json({
      message: "Verification has already been passed",
    });
  }

  const { verificationToken } = user;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: ` <a
        target="_blank"
        href="${BASE_URL}/api/users/verify/${verificationToken}"
      >
        Click here to verify your email
      </a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

  const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    if (!user.verify) {
      throw HttpError(401, "Email isn't verified");
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

    if (!req.file) {
      throw HttpError(400, "No file uploaded");
    }

    const { path: tempUpload, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    image.resize(250, 250).write(tempUpload);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = `/avatars/${filename}`;

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  };

  export default {
    registerUser: wrapper(registerUser),
    verifyUserEmail: wrapper(verifyUserEmail),
    resendVerifyEmail: wrapper(resendVerifyEmail),
    login: wrapper(login),
    getCurrent: wrapper(getCurrent),
    updateSubscription: wrapper(updateSubscription),
    logout: wrapper(logout),
    updateAvatar: wrapper(updateAvatar),
  };
