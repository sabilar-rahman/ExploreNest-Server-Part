import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PostRoutes } from "../modules/post/post.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { PaymentRoute } from "../modules/payment/payment.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
