import express from "express";
import { postControllers } from "./post.controller";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// post routes

router.get("/all-posts", postControllers.getAllPosts);

router.get("/single-post/:id", postControllers.getSinglePost);

// router.post(
//   "/create-post",
//   multerUpload.fields([{ name: "image" }]),
//   parseBody,
//   postControllers.createPost
// );

router.post(
  "/create-post",
  multerUpload.single("image"),
  parseBody,
  postControllers.createPost
);

// router.put(
//   "/update-post/:id",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   postControllers.updatePost
// );

router.put(
  "/update-post/:id",
  multerUpload.single("image"),
  parseBody,
  postControllers.updatePost
);

router.delete(
  "/delete-post/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  postControllers.deletePost
);

// upvote and downvote
router.post("/upvote/:id", postControllers.upVotePost);
router.post("/downvote/:id", postControllers.downVotePost);

// popular post get
router.get("/popular", postControllers.getPopularPosts);

// post by authors
router.get("/posts-by-author/:id", postControllers.getPostsByAuthor);

// active & inactive
router.get(
  "/all-active-inactive-posts",
  auth(USER_ROLE.admin),
  postControllers.getAllAcInacPosts
);

export const PostRoutes = router;
