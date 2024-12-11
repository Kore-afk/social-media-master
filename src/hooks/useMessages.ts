import { DocumentData } from 'firebase/firestore';
import React from "react"
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAppSelector } from "./redux-hooks";
import { MessageDataType } from "../types/messageData.type";

export const useMessages = () => {
  const [messages, setMessages] = React.useState<DocumentData | MessageDataType>([])
  const chatID = useAppSelector(state => state.currentChat.chatID)

  async function getMessages() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    onSnapshot(doc(db, 'chats', chatID!), (doc) => {
      doc.exists() && setMessages(doc.data());
    });
  }
  React.useEffect(() => {
    getMessages();
  }, [chatID]);

  return messages.messages

}