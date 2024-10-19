import { Types } from 'mongoose'

export interface IUser {
  _id?:string;
  name?: string;
  img?: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  verified?: boolean;
  lastLogin: Date;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}