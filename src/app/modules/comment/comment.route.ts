import express from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { CommentValidations } from "./comment.validation";
import { CommentControllers } from "./comment.controller";

const router = express.Router();

router.post(
  "/create-comment",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(CommentValidations.createCommentValidationSchema),
  CommentControllers.createComment,
);
router.get("/:id", CommentControllers.getCommentsForIndividualPost);
router.put(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(CommentValidations.updateCommentValidationSchema),
  CommentControllers.updateMyComment,
);
router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CommentControllers.deleteMyComment,
);
export const CommentRoutes = router;
