import AppError from "../errors/AppError";
import { catchAsync } from "../utils/catchAsync";

export const bodyDataParsing = catchAsync(async (req, res, next) => {
  if (!req.body.postData) {
    throw new AppError(400, "Please provide data in the body under data key");
  }
  req.body = JSON.parse(req.body.postData);

  next();
});
