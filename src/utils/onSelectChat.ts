import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import swal from 'sweetalert';
import { store } from '../redux/store';
import { setCurrentChat } from '../redux/currentChat/slice';

export async function onSelectChat(userId: string) {
  const combinedId = auth.currentUser!.uid > userId ? auth.currentUser!.uid + userId : userId + auth.currentUser!.uid;
  try {
    const chatDoc = await getDoc(doc(db, 'chats', combinedId));

    if (!chatDoc.exists()) {
      await setDoc(doc(db, 'chats', combinedId), { messages: [] });

      await updateDoc(doc(db, 'userChats', auth.currentUser!.uid), {
        [combinedId + '.userInfo']: {
          id: userId,
        },
        [combinedId + '.date']: Date.now(),
      });
      await updateDoc(doc(db, 'userChats', userId), {
        [combinedId + '.userInfo']: {
          id: auth.currentUser?.uid,
        },
        [combinedId + '.date']: Date.now(),
      });
    }

    // Actualizar el estado del chat actual
    store.dispatch(setCurrentChat({ chatID: combinedId, userID: userId }));

  } catch (e: any) {
    swal({
      title: "Oops ErRoR...",
      text: e.message,
      icon: "error",
    });
  }
}