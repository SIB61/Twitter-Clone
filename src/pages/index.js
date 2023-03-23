import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import localFont from "next/font/local";
import { useState } from "react";
import { Appbar } from "@/shared/components/appbar/Appbar";
import { MainLayout } from "@/core/layouts/main-layout";
import { TweetList } from "@/features/tweet/components/tweet-list/TweetList";
import { CreateTweet } from "@/features/tweet/components/create-tweet/CreateTweet";
import { Modal } from "@/shared/components/modal/Modal";
import { useToggle } from "@/shared/hooks/useToggle";
import { AuthCard } from "@/features/auth/components/auth-card/AuthCard";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

const chirp = localFont({
  src: [
    {
      path: "../../public/fonts/chirp-bold-web.woff",
      weight: "bold",
    },
    {
      path: "../../public/fonts/chirp-heavy-web.woff",
      weight: "700",
    },
    {
      path: "../../public/fonts/chirp-medium-web.woff",
      weight: "500",
    },
    {
      path: "../../public/fonts/chirp-regular-web.woff",
      weight: "normal",
    },
  ],
});
const tweets = [
  {
    user: {
      name: "Md Sabit Islam Bhuitya",
      username: "sib_61",
    },
    post: `
Teja Nidamanuru, the hero of Netherlands.
One of the crazy knocks in recent times, Netherlands was out of the game with 64/5 while chasing 250 & then the classic show started with a brilliant hundred by Teja 110*(96) to seal the game.
    `,
    totalComments: 7,
    totalLikes: 9,
  },

  {
    user: {
      name: "Md Sabit Islam Bhuitya",
      username: "sib_61",
    },
    post: `
Teja Nidamanuru, the hero of Netherlands.
One of the crazy knocks in recent times, Netherlands was out of the game with 64/5 while chasing 250 & then the classic show started with a brilliant hundred by Teja 110*(96) to seal the game.
    `,
    totalComments: 7,
    totalLikes: 9,
    imgUrl: "bg.jpg",
  },

  {
    user: {
      name: "Md Sabit Islam Bhuitya",
      username: "sib_61",
    },
    post: `
Teja Nidamanuru, the hero of Netherlands.
One of the crazy knocks in recent times, Netherlands was out of the game with 64/5 while chasing 250 & then the classic show started with a brilliant hundred by Teja 110*(96) to seal the game.
    `,
    totalComments: 7,
    totalLikes: 9,
    imgUrl: "bg.jpg",
  },

  {
    user: {
      name: "Md Sabit Islam Bhuitya",
      username: "sib_61",
    },
    post: `
Teja Nidamanuru, the hero of Netherlands.
One of the crazy knocks in recent times, Netherlands was out of the game with 64/5 while chasing 250 & then the classic show started with a brilliant hundred by Teja 110*(96) to seal the game.
    `,
    totalComments: 7,
    totalLikes: 9,
    imgUrl: "bg.jpg",
  },
];
function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, toggleModal] = useToggle();
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
          <AuthCard />
        </div>
      </div>
    </>
  );
}
Home.Layout = MainLayout;
export default Home;
