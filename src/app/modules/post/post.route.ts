import express, { NextFunction, Request, Response } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { PostValidations } from "./post.validation";
import { PostControllers } from "./post.controller";
import { multerUpload } from "../../config/multer.config";
import { bodyDataParsing } from "../../middleware/bodyDataParsing";

const router = express.Router();

router.post(
  "/create-post",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.fields([{ name: "postImages" }]),
  bodyDataParsing,
  validateRequest(PostValidations.createPostValidationSchema),
  PostControllers.createPost,
);
router.get("/get-all", PostControllers.getAllPosts);
router.get("/get-single/:id", PostControllers.getPostById);
router.put(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.fields([{ name: "postImages" }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.postData);
    next();
  },
  validateRequest(PostValidations.updatePostValidationSchema),
  PostControllers.updatePost,
);
router.delete("/:id", PostControllers.deletePost);
router.put(
  "/voting/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PostControllers.votePost,
);

router.get(
  "/get-current-user-post",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PostControllers.getCurrentUserPost,
);

export const PostRoutes = router;
