import express from "express";
import { UserController } from "./user.controller";
import {
  updateUserValidationSchema,
} from "./user.validation";
import auth from "./../../middlewares/auth";

// import { USER_ROLE } from "./user.utils";


import validateRequest from "../../middlewares/ValidateRequest";
import { USER_ROLE } from "./user.utils";

const router = express.Router();

// router.post(
//   "/",
//   // auth(USER_ROLE.admin),
//   validateRequest(createUserValidationSchema),
//   UserController.createUser
// );

router.get(
  "/",
  // auth(USER_ROLE.admin),
  UserController.getAllUsers
);

router.get("/:email", UserController.findUserByEmail);

// get user by id,

router.get(
  "/:id",
  // auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.findUserById
);

router.put(
  "/:id",
  // auth(USER_ROLE.admin),
  validateRequest(updateUserValidationSchema),
  UserController.updateUserById
);

router.delete(
  "/:id",
  // auth(USER_ROLE.admin),
  UserController.deleteUserById
);

router.post(
  "/:userId/follow",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.followUser
);
router.post(
  "/:userId/unfollow",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.unFollowUser
);

router.put("/update-role/:id", UserController.updateUserRole);



router.get("/current-user",UserController.getCurrentUser);


export const UserRoutes = router;
