import { MainLayout } from "@/core/layouts/main-layout";
import { dbConnect } from "@/core/utils/db";
import { TweetList } from "@/features/tweet/components/tweet-list/TweetList";
import { getTweetById } from "@/features/tweet/services/server/get-tweet-by-id";
import { getUserTweets } from "@/features/tweet/services/server/get-user-tweets";
import { ProfileLayout } from "@/features/user/components/profile-layout/ProfileLayout";
import { getFollowings } from "@/features/user/services/server/get-followings";
import { getIsFollowing } from "@/features/user/services/server/get-is-following";
import { getUserById } from "@/features/user/services/server/get-user";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { MiniProfile } from "@/shared/components/mini-profile/MiniProfile";
import { UserList } from "@/shared/components/user-list/UserList";
import { getNestedLayout } from "@/shared/utils/getNestedLayout";
import { getServerSession } from "next-auth";

export async function getServerSideProps(ctx) {
  try {
    await dbConnect();
    const { userId } = ctx.params;
    const { user: myUser } = await getServerSession(
      ctx.req,
      ctx.res,
      authOptions
    );
    const user = getUserById(userId);
    const isFollowing = getIsFollowing({
      followerId: myUser.id,
      followedId: userId,
    });
    const followings = getFollowings(userId);
    let [userRes, isFollowingRes, followingsRes] = await Promise.all([
      user,
      isFollowing,
      followings,

    ]);
    userRes.isFollowing = isFollowingRes
    return {
      props: JSON.parse(
        JSON.stringify({
          user: userRes,
          followings: followingsRes,
        })
      ),
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/home",
      },
    };
  }
}

function Page({ followings,user }) {
  return (
    <MainLayout>
      <ProfileLayout user={user}>
        <div className="col" style={{ gap:'1rem', padding:'1rem' }}>
          {
            followings.map(following=>(<MiniProfile user={following} action={<button className="btn btn-bordered btn-ghost">unfollow</button>}/>))
          }
        </div>
      </ProfileLayout>
    </MainLayout>
  );
}

export default Page;
