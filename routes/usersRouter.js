import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { middlewares } from "../middleware/index.js";

import userControllers from "../controllers/userControllers.js";

const { registerUser, login, logout, getCurrent, updateSubscription } =
  userControllers;

const userRouter = express.Router();

userRouter.post(
  "/register",
  middlewares.validateBody(registerSchema),
  registerUser
);

userRouter.post("/login", middlewares.validateBody(loginSchema), login);

userRouter.get("/current", middlewares.authenticate, getCurrent);

userRouter.post("/logout", middlewares.authenticate, logout);

userRouter.patch(
  "/",
  middlewares.authenticate,
  middlewares.validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default authRouter;
