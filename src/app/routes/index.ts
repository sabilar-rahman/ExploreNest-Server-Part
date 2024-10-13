import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route";

import { PostRoute } from "../modules/post/post.route";
import { CommentRoute } from "../modules/comment/comment.route";
import { UserRoutes } from "../modules/user/user.route";
import { PaymentRoute } from "../modules/payment/payment.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoute,
  },
  {
    path: "/comment",
    route: CommentRoute,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
