import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../utils/getSocket";
import { useCustomState } from "@/shared/hooks/useCustomState";
export const MessageContext = createContext();
const newMessages = {};
export function MessageProvider({ children }) {
  const messages = useCustomState({});
  const [socket, setSocket] = useState(undefined);
  const { data: session } = useSession();
  const messageNotifications = useCustomState(new Set())
  // const newMessages = useCustomState({});
  useEffect(() => {
    const socketInitializer = async () => {
      if (!socket) {
        const socketClient = await getSocket();
        setSocket(socketClient);
      }

      socket?.on("newMessage", (message) => {
        messageNotifications.set(value=>{
          value.add(message.sender)
          return value
        })
        messages.set((curr) => {
          if (!newMessages[message.id]) {
            if (curr[message.sender]) {
              curr[message.sender].unshift(message);
            } else {
              curr[message.sender] = [message];
            }
            newMessages[message.id] = message;
          }
          return { ...curr };
        });
      });
    };
    socketInitializer();
    return () => socket?.removeAllListeners();
  }, [socket]);

  useEffect(() => {
    if (session && session.user) socket?.emit("join", session.user.id);
  }, [session, socket]);

  const sendMessage = (message) => {
    socket.emit("sendMessage", message);
    messages.set((curr) => {
      return {
        ...curr,
        [message.receiver]: [message, ...curr[message.receiver]],
      };
    });
  };

  return (
    <MessageContext.Provider
      value={{ messages, messageNotifications, sendMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
}
