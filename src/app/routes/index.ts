import { Router } from "express";
import { UserRoutes } from '../modules/User/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { PaymentRoute } from '../modules/payment/payment.route'
import { PostRoute } from '../modules/post/post.route'
import { CommentRoute } from '../modules/comment/comment.route'

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
  {
    path: '/post',
    route: PostRoute,
  },
  {
    path: '/comment',
    route: CommentRoute,
  },
]
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
