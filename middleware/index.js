import isValidId from "./isValidid.js";
import mongooseError from "./mongooseError.js";
import validateBody from "./validateBody.js";
import authenticate from "./authenticate.js";

export const middlewares = {
  isValidId,
  mongooseError,
  validateBody,
  authenticate
};