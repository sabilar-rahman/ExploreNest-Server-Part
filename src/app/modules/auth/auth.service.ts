import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser, TRegisterUser } from "./auth.interface";
import { USER_ROLE } from "../user/user.constant";
import { createToken, verifyToken } from "../../utils/jwtVerification";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../utils/sendEmail";

const registerUser = async (payload: TRegisterUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is already exist!");
  }

  payload.role = USER_ROLE.USER;

  //create new user
  const newUser = await User.create(payload);

  // jwt payload for create access and refresh token
  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    mobileNumber: newUser.mobileNumber,
    gender: newUser.gender,
    role: newUser.role,
    birthDate: newUser.birthDate,
    status: newUser.status,
    profileImage: newUser.profileImage,
  };

  // create access token and send it to the client
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expires_in as string,
  );

  // create refresh token and send it to the client
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist in our data base
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // checking if the user is blocked by the admin

  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  // jwt payload for create access and refresh token
  const jwtPayload = {
    _id: user._id!,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    gender: user.gender,
    role: user.role,
    birthDate: user.birthDate,
    status: user.status,
    profileImage: user.profileImage,
  };

  // create access token and send it to the client
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expires_in as string,
  );

  // create refresh token and send it to the client
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist in the database
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // checking if the user is blocked by the admin
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //checking if the given password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email: email });

  // check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // checking if the user is blocked by the admin
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  const jwtPayload = {
    _id: user._id!,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    gender: user.gender,
    role: user.role,
    birthDate: user.birthDate,
    status: user.status,
  };

  const resetToken = createToken(
    jwtPayload,
    config.access_secret as string,
    "10m",
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user?.email}&token=${resetToken}`;

  const emailHTML = `<div style="text-align: center; padding: 40px; background-color: #f4f4f4; font-family: Arial, sans-serif; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333; margin-bottom: 20px;">Password Reset</h2>
    <p style="color: #555; margin-bottom: 30px; font-size: 16px;">
      Click the button below to reset your password:
    </p>
    <a href="${resetUILink}" target="_blank" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease, transform 0.3s ease; font-weight: bold;" onmousedown="this.style.backgroundColor='#0056b3'; this.style.transform='scale(0.95)';" onmouseup="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';" onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';">
      Reset Password
    </a>
    <p style="color: #777; margin-top: 40px; font-size: 14px;">
      This link will expire in 10 minutes.
    </p>
  </div>
</div>
`;

  await sendEmail(user?.email as string, emailHTML);
};

const resetPassword = async (
  payload: {
    email: string;
    newPassword: string;
  },
  token: string,
) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  // check if the user is exist in the data base
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // checking if the user is blocked by the admin
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // check if the token is valid or not
  const decoded = verifyToken(
    token,
    config.access_secret as string,
  ) as JwtPayload;

  if (decoded?.email !== payload?.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
  }

  const newHashedPassword = await bcryptjs.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded?.email,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // check if the token is valid or not
  const decoded = verifyToken(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist in the database
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // checking if the user is blocked by admin
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  // jwt payload for create access token
  const jwtPayload = {
    _id: user._id!,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    gender: user.gender,
    role: user.role,
    birthDate: user.birthDate,
    status: user.status,
  };

  // create access token and send it to the client
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken,
};
