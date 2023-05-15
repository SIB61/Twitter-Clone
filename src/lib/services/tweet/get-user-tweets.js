import TweetModel from "@/lib/schemas/tweet.schema";
import { mapId } from "@/shared/utils/mapId";
import { getIsLikedMany } from "./get-is-liked";
import LikeModel from "@/core/schemas/likes.schema";

export async function getUserTweets(userId, myId) {
  try {
    let tweets = await TweetModel.find({ "user.id": userId }).lean();
    tweets = tweets.map((tweet) => mapId(tweet));
    const likeIds = tweets.map((tweet) => tweet.id + myId);
    const likes = await LikeModel.find({ likeId: { $in: likeIds } }).lean();
    let likedTweetIds = likes.map((like) => like.post.toString());
    likedTweetIds = new Set(likedTweetIds);
    tweets = tweets.map((tweet) => ({
      ...tweet,
      isLiked: likedTweetIds.has(tweet.id.toString()),
    }));

    return tweets;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
