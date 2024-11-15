import { GENDER, USER_ROLE } from "../user/user.constant";
import { TUser } from "../user/user.interface";

export type TLoginUser = Pick<TUser, "email" | "password">;

export type TRegisterUser = Pick<
  TUser,
  | "name"
  | "email"
  | "password"
  | "mobileNumber"
  | "gender"
  | "role"
  | "birthDate"
>;
