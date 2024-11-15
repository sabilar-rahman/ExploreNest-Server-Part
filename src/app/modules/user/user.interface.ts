import mongoose, { Model } from "mongoose";
import { GENDER, USER_ROLE, USER_STATUS } from "./user.constant";

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  gender: keyof typeof GENDER;
  role: keyof typeof USER_ROLE;
  profileImage: string;
  passwordChangedAt?: Date;
  status: keyof typeof USER_STATUS;
  isVerified: boolean;
  birthDate: string;
  bio?: string;
  address?: string;
  followers?: mongoose.Types.ObjectId[];
  following?: mongoose.Types.ObjectId[];
  bookmarkPosts?: mongoose.Types.ObjectId[];
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
