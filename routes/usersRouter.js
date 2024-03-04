import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { validateBody, authenticate } from "../middleware/index.js";

import userControllers from "../controllers/userControllers.js";

const { registerUser, login, logout, getCurrent, updateSubscription } =
  userControllers;

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(registerSchema),
  registerUser
);

userRouter.post("/login", validateBody(loginSchema), login);

userRouter.get("/current", authenticate, getCurrent);

userRouter.post("/logout", authenticate, logout);

userRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default authRouter;
