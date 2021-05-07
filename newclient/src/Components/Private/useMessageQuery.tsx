import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../..";
import { ChatRoom, MessageInterface } from "../../Interfaces";
import { baseurl } from "../../routes";

export default function useMessageQuery(
  room: ChatRoom,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>
) {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState<number>();
  const [empty, setEmpty] = useState<boolean>();
  const [scroll, setScroll] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver>();
  const setRefFirstMessage = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCount((count) => count + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    setMessages([]);
    setCount(0);
    setMaxCount(0);
    setScroll(true);
  }, [room]);

  useEffect(() => {
    const eventName = `remote-message-${room.id}`;
    socket.on(eventName, (message: MessageInterface) => {
      setScroll(true);
      setMessages((old: any) => [...old, message]);
    });

    const fetchMessages = async () => {
      const msgRes = await axios.get(
        `${baseurl}/chat/messages/fetch/${room.id}/0`,
        { withCredentials: true }
      );

      if (msgRes.data.messages) {
        setEmpty(false);
        setMessages(msgRes.data.messages);
        setMaxCount(msgRes.data.count);
      } else {
        setEmpty(true);
      }
      setLoading(false);
    };
    fetchMessages();

    return () => {
      socket.off(eventName);
    };
  }, [room]);

  useEffect(() => {
    const fetchMore = async () => {
      if (count) {
        const msgRes = await axios.get<MessageInterface[]>(
          `${baseurl}/chat/messages/fetch/${room.id}/${count}`,
          { withCredentials: true }
        );

        setScroll(false);
        setMessages((prevMessages: any) => {
          return [
            ...(new Set([
              ...msgRes.data.map((m) => m),
              ...prevMessages,
            ]) as any),
          ];
        });
      }
    };

    fetchMore();
  }, [count]);

  return { messages, loading, setRefFirstMessage, maxCount, empty, scroll };
}
