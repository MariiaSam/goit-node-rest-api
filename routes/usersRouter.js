import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { validateBody, authenticate } from "../middleware/index.js";

import authControllers from "../controllers/authContollers.js";

const { registerUser, login, logout, getCurrent, updateSubscription } =
  authControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.post("/logout", authenticate, logout);

usersRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default usersRouter;
