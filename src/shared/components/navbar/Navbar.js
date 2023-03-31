import { FaHashtag, FaRegUser, FaSearch } from "react-icons/fa";
import { CgFeed, CgMore, CgMoreO, CgProfile } from "react-icons/cg";
import styles from "./Navbar.module.css";
import { RiHashtag, RiHome7Fill, RiHomeLine } from "react-icons/ri";
import { GrInbox, GrNotification } from "react-icons/gr";
import { BiHash, BiHomeCircle } from "react-icons/bi";
import { CiCircleMore, CiCircleRemove } from "react-icons/ci";
import Link from "next/link";
import TwitterLogo from "public/images/Twitter-logo.png";
import Dp from "public/images/dp.jpg";
import Image from "next/image";
import { Avator } from "@/features/user/components/avatar/Avatar";
import { useToggle } from "@/shared/hooks/useToggle";
import { Modal } from "../modal/Modal";
import { CreateTweet } from "@/features/tweet/components/create-tweet/CreateTweet";
import { useContext } from "react";
import { ModalContext } from "@/core/layouts/main-layout";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const authenticatedOptions = [
  {
    title: "Home",
    route: (...params) => "/",
    icon: BiHomeCircle,
  },
  {
    title: "Explore",
    route: (...params) => "/",
    icon: RiHashtag,
  },

  {
    title: "Notifications",
    route: (...params) => "/",
    icon: GrNotification,
  },

  {
    title: "Messages",
    route: (...params) => "/",
    icon: GrInbox,
  },

  {
    title: "Profile",
    route: (...params) => "/profile/"+params[0],
    icon: FaRegUser,
  },

  {
    title: "More",
    route: (...params) => "/",
    icon: CgMoreO,
  },
];

const unAuthenticatedOptions = [
  {
    title: "Explore",
    route: (...params)=> "/",
    icon: RiHashtag,
  },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const options =
    status === "authenticated" ? authenticatedOptions : unAuthenticatedOptions;
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.logoItem}>
            <Image alt="jhi" src={TwitterLogo} className={styles.logo} />
          </li>

          {options.map((v, i) => (
            <li key={i}>
              <Link href={v.route(session?.user?.id)} className={styles.navOptions}>
                <div className={styles.navItem} style={{ fontWeight: "500" }}>
                  {<v.icon className={styles.navIcon} />}
                  <span className={styles.navText}>{v.title}</span>
                </div>
              </Link>
            </li>
          ))}

          {status === "authenticated" && (
            <>

              <li>
                <button className={'btn btn-bordered brn-ghost'}  onClick={()=>signOut()}>
                  Sign out
                </button>
              </li>

              <li>
                <Link className={styles.tweetButton} href="?page=create-tweet" shallow>
                  Tweet
                </Link>
              </li>
              <li className={styles.profile}>
                <Avator alt="avatar" src={session.user.image} size="48" />
                <div>
                  <p className={styles.name}>{session.user.name}</p>
                  <p className={styles.username}>@{session.user.username}</p>
                </div>
                <CgMore />
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}