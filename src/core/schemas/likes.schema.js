import { LIKE_SCHEMA, TWEET_SCHEMA, USER_SCHEMA } from "@/constants";
import mongoose from "mongoose";
export const likeId = "likeId";
const likeSchema = new mongoose.Schema({
  likeId:{type:String,index:true,required:true},
  post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:TWEET_SCHEMA,
    required:true
  },
  user:{
    id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    name: String,
    image:String
  },
},
{
    timestamps:true
}

);

const LikeModel = mongoose?.models?.Like || mongoose.model(LIKE_SCHEMA, likeSchema);
export default LikeModel;
