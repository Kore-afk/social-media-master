import { ChatDataType } from './../types/chatData.type';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import React from "react"
import { auth, db } from '../firebase';

export const useChats = () => {
  const [chats, setChats] = React.useState<ChatDataType[] | DocumentData>()

  async function getChats() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    onSnapshot(doc(db, 'userChats', userId), (doc) => {
      setChats(doc.data());
    });
  }

  React.useEffect(() => {
    getChats();
  }, [auth.currentUser?.uid]);

  if (chats) return Object.entries(chats)

}