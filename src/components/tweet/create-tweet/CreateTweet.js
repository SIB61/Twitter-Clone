import styles from "./CreateTweet.module.css";
import {  useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useSession } from "next-auth/react";
import { useAutoResizeTextArea } from "@/hooks/useAutoResizeTextArea";
import { useLoading } from "@/hooks/useLoading";
import { postTweet } from "@/features/tweet/services/client/create-tweet.client";
import { LoadingBar } from "@/components/common/loading-bar/LoadingBar";
import { Avator } from "@/components/common/avatar/Avatar";
import { FileInput } from "@/components/common/file-reader/FileReader";
import { ImgIcon } from "@/components/common/icons/ImgIcon";
export function CreateTweet({ expanded, onComplete = () => {} }) {
  const [expand, setExpand] = useState(expanded);
  const [post, setPost] = useState();
  const textAreaRef = useAutoResizeTextArea(post);
  const loading = useLoading();
  const {data:session} = useSession()
  const [image, setImage] = useState();
  const twitPost = async () => {
    if (post || image) {
      loading.start();
      try {
        const tweet = await postTweet({text:post,image:image?.file})
        await loading.complete()
        onComplete(tweet)
      } catch (err) {
        console.log(err)
        await loading.complete()
      }
      setPost("");
      setImage(undefined);
    }
  };

  return (
    <>

    <LoadingBar loading={loading.loading}/>
    <div className={styles.createPost}>
      <Avator size="48" src={session?.user?.image}/>
      <div className={styles.fields}>
        {expand && (
          <select defaultValue="everyone" className={styles.audience}>
            <option>Everyone</option>
          </select>
        )}
        <textarea
          ref={textAreaRef}
          placeholder="What's happening"
          className={styles.textarea}
          onClick={() => {
            if (!expand) {
              setExpand(true);
            }
          }}
          value={post}
          onChange={(e) => setPost(e.target.value)}
        ></textarea>

        {image && (
          <div className={styles.image}>
            <img src={image.src} alt="img" />
            <button
              onClick={() => setImage(undefined)}
              className={`btn btn-ghost`}
            >
              <RxCross1 />
            </button>
          </div>
        )}

        {expand && (
          <>
            <select
              defaultValue="everyone"
              className={styles.audience}
              style={{ border: "none", marginLeft: "0" }}
            >
              <option value="everyone">Everyone can reply</option>
            </select>
            <div className="h-divider"></div>
          </>
        )}
        <div className={styles.actions}>
          <div className={styles.attachment}>
            <FileInput
              id={"file" + Math.random() * 100}
              onSelect={(e) => setImage(e)}
            >
              <div className="btn btn-icon">
                <ImgIcon color="rgb(29, 155, 240)" width="22" />
              </div>
            </FileInput>
          </div>
          <div>
            <button
              onClick={twitPost}
              className={"btn btn-primary"}
              style={{ padding: "0.7rem 1rem", fontSize: "1rem" }}
            >
              Tweet
            </button>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}