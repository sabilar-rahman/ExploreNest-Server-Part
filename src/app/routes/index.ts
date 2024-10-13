import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { PostRoutes } from "../modules/post/post.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { BookingsRoutes } from "../modules/booking/booking.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/",
    route: UserRoutes,
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
    path: "/bookings",
    route: BookingsRoutes,
  },

  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
