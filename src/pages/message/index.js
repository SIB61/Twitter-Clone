import { MainLayout } from "@/core/layouts/main-layout";
import { dbConnect } from "@/core/utils/db";
import { getUsers } from "@/features/user/services/server/get-user.server";
import { CreatePost } from "@/shared/components/create-post/CreatePost";
import { MiniProfile } from "@/shared/components/mini-profile/MiniProfile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useCallback, useEffect, useMemo, useRef } from "react";
import styles from "../../styles/Message.module.css";
import { getServerSession } from "next-auth";
import { createOptions } from "../api/auth/[...nextauth]";
import { TbSettings } from "react-icons/tb";
import { MdOutlineForward, MdOutlineForwardToInbox } from "react-icons/md";
import { Input } from "@/shared/components/input/Input";
import { MessageBubble } from "@/features/conversation/components/MessageBubble";
import { debounce } from "@/shared/utils/debounce";
import axios from "axios";
import { useCustomState } from "@/shared/hooks/useCustomState";
import { deleteMessageNotification } from "@/features/notification/services/server/delete-message-notification.server";
import { useMessages } from "@/features/conversation/hooks/useMessages";
import { useSocket } from "@/core/Providers/SocketProvider";
import { getAllConversationsByUser } from "@/features/conversation/services/server/get-conversation.server";
import useIntersectionObserver from "@/shared/hooks/useIntersectionObserver";
import { CONNECTION, MESSAGE_SEEN, SEE_MESSAGE } from "@/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MessageActions } from "@/features/conversation/actions/message.action";
export async function getServerSideProps(ctx) {
  await dbConnect();
  const { user } = await getServerSession(
    ctx.req,
    ctx.res,
    createOptions(ctx.req)
  );
  const { room } = ctx.query;
  let receiver;
  let users = getUsers().then((result) => {
    result = result.filter((u) => u.id.toString() !== user.id.toString());
    if (room) {
      receiver = result.reduce(
        (acc, cur) => (cur.id.toString() === room ? cur : acc),
        undefined
      );
    }
    return Promise.resolve(result);
  });
  let messages = Promise.resolve([]);
  if (room) {
    const receiverId = room;
    deleteMessageNotification({
      userId: user.id,
      notificationSenderId: receiverId,
    });
    messages =  getAllConversationsByUser({
      userId: user.id,
      receiverID: receiverId,
      pageIndex: 1,
      pageSize:50
    });
  }

  const [usersResult,messagesResult] = await Promise.all([users,messages])

  const io = ctx.res.socket.server.io
  if(io && receiver){
    io.to(room).emit(MESSAGE_SEEN,{userId:user.id})
  }

  return {
    props: JSON.parse(
      JSON.stringify({
        users:  usersResult,
        previousMessages:  messagesResult,
        receiver: receiver,
      })
    ),
  };
}

export default function Page({ users, previousMessages, receiver }) {
  const router = useRouter();
  const { room } = router.query;
  const { data: session } = useSession();
  const userList = useCustomState(users);
  const [animationParent] = useAutoAnimate()
  const { messages, messageNotifications,  dispatch } =
    useMessages();

  const loaderRef = useRef();
  const isLoaderOnScreen = !!useIntersectionObserver(loaderRef, {})
    ?.isIntersecting;

  useEffect(() => {
    if (isLoaderOnScreen && !messages[room].isLastPage) {
      dispatch(MessageActions.FETCH_USER_MESSAGES,{userId:receiver.id})
    }
  }, [isLoaderOnScreen]);

  useEffect(() => {
    if (receiver?.id) {
      dispatch(MessageActions.SET_USER_MESSAGES,{userId:receiver.id,messages:previousMessages})
    }
  }, []);

  const postMessage = (message) => {
    if (message) {
      dispatch(MessageActions.SEND_MESSAGE,{
        content: { text: message },
        sender: session.user.id,
        receiver: room,
      })
    }
  };

  const onUserSearch = useCallback((e) => {
    let text = e.target.value.trim();
    const search = async () => {
      const { data } = await axios.post("/api/search",{user:text});
      userList.set(data);
    };
    if (text.length === 0) {
      userList.set(users);
    } else {
      debounce(search, 300)();
    }
  }, []);

  return (
    <MainLayout>
      <div className={styles.messageContainer}>
        <div className={styles.userList}>
          <div className={styles.userBoxHeader}>
            <div className={styles.userBoxHeaderOptionsAndText}>
              <h4>Messages</h4>
              <span className={styles.userBoxSettingsOption}>
                <TbSettings />
              </span>
              <span>
                <MdOutlineForwardToInbox />
              </span>
            </div>
            <div>
              <Input onChange={onUserSearch} placeHolder={"Search User"} />
            </div>
          </div>
          {userList.value?.map((user) => (
            <div
              className={`${styles.user} ${
                room === user.id ? styles.selected : ""
              }`}
              key={user.id}
            >
              <Link
                style={{ position: "relative", width: "100%" }}
                key={user.id}
                href={{ pathname: "/message", query: { room: user.id } }}
              >
                <MiniProfile user={user} />{" "}
                {messageNotifications.has(user.id) && (
                  <span className="notification-badge"></span>
                )}
              </Link>
            </div>
          ))}
        </div>

        {receiver ? (
          <div className={styles.chatBox}>
            <Link href={`/profile/${receiver?.id}`} className={styles.receiver}>
              <MiniProfile user={receiver} />
            </Link>
            <div ref={animationParent}>
              {messages[room]?.data.map((msg, idx) => (
                <MessageBubble key={msg?.id} message={msg} />
              ))}
              <div className={styles.pageLoader}>
              {!messages[room]?.isLastPage && <div ref={loaderRef} className="loader"></div>}
              </div>
            </div>
            <div className={styles.sendMsg}>
              <CreatePost
                submitButton="send"
                placeholder="write your message"
                onSubmit={(e) => postMessage(e.text)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <h1>Select a Message</h1>
            <p>
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
