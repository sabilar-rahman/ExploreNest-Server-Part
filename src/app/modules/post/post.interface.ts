import { Types } from "mongoose";
// import { TComment } from "../comment/comment.interface";

// interface Voter {
//   user: Types.ObjectId;
//   vote: "upvote" | "downvote";
// }

export type TPost = {
 
  author: Types.ObjectId;
  title: string;
  content?: string;
  category: string;
  image?: string;
  // comments: [TComment];

  commentCount: number;

  // upVotes: number
  // downVotes: number
  

  upvote: Types.ObjectId[]; // Array of user IDs that have upvoted the post
  downvote: Types.ObjectId[]; // Array of user IDs that have downvoted the post
  // voters: Voter[];
  premium?: boolean;
  // createdAt?: Date;
  // updatedAt?: Date;

  delete?: boolean;
};
