import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await Schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;
