import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userRegisterSchema, userUpdateSchema } from "./user.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userRegisterSchema),
  UserControllers.createUser,
);
router.get("/", UserControllers.getAllUsers);

router.get(
  "/current-user",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.getCurrentUser,
);
router.put(
  "/toggle-follower",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.toggleFollowUser,
);
router.put(
  "/toggle-bookmark",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.bookmarkPost,
);
router.put(
  "/update-user",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.single("profileImage"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.userData);
    next();
  },
  validateRequest(userUpdateSchema),
  UserControllers.updateUser,
);

router.get(
  "/get-single-user/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.getSingleUser,
);

router.put(
  "/status-toggle/:id",
  auth(USER_ROLE.ADMIN),
  UserControllers.toggleStatus,
);
export const UserRoutes = router;
