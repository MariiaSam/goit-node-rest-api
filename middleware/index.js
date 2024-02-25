import isValidId from "./isValidid.js";
import mongooseError from "./mongooseError.js";
import validateBody from "./validateBody.js";

export const middlewares = {
  isValidId,
  mongooseError,
  validateBody,
};
