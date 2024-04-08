import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  verificationEmailSchema
} from "../models/user.js";

import { validateBody, authenticate, upload } from "../middleware/index.js";

import authControllers from "../controllers/authContollers.js";

const { registerUser, verifyUserEmail, resendVerifyEmail, login, logout, getCurrent, updateSubscription, updateAvatar } =
  authControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.get("/verify/:verificationToken", verifyUserEmail);

usersRouter.post("/verify", validateBody(verificationEmailSchema), resendVerifyEmail);

usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.post("/logout", authenticate, logout);

usersRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single('avatar'),
  updateAvatar
);

export default usersRouter;
