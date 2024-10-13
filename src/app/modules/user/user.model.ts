import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    image: { type: String, required: false },
    address: { type: String, required: false },
    status: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
    // followers: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
    // following: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],

    followers: [{ type: Schema.Types.ObjectId, ref: "user", required: false }],
    following: [{ type: Schema.Types.ObjectId, ref: "user" , required: false}],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;

  return userObject;
};

// Static method to find user by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("user", userSchema);
