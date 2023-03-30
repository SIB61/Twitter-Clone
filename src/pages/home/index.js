import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { MainLayout } from "@/core/layouts/main-layout";
import { TweetList } from "@/features/tweet/components/tweet-list/TweetList";
import { CreateTweet } from "@/features/tweet/components/create-tweet/CreateTweet";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getUserFeed } from "@/features/tweet/services/server/get-feed";
import { YouMayKnow } from "@/features/user/components/you-may-know/YouMayKnow";
import { getUsers } from "@/features/user/services/server/get-user";

export async function getServerSideProps(ctx) {
  const {user} = await getServerSession(ctx.req, ctx.res, authOptions);
  const tweetsPromise =  getUserFeed(user)
  const usersPromise =  getUsers()
  const [tweets,users] =await Promise.all([tweetsPromise,usersPromise])
  return {
    props:JSON.parse(JSON.stringify(
    {
      tweets:tweets,
      users: users,
    },
    ))
  };
}

function Page({ tweets, users }) {
  const { data, status } = useSession();
  console.log(status, data);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.home}>
        <div className="center-container">
          <div className="appbar">Home</div>
          <div className="content">
            <CreateTweet />
            <TweetList tweets={tweets} />
          </div>
        </div>
        <div className={styles.rightBar}>
          <YouMayKnow users={users}/>   
        </div>
      </div>
    </>
  );
}
Page.Layout = MainLayout;
export default Page;
