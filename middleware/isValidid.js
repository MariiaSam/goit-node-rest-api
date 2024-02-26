import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(404, "Not found"));
  }
  next();
};

export default isValidId;
