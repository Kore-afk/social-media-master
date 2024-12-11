import React from "react"
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore"
import { auth, db, storage } from "../firebase"
import { UserDataType } from "../types/userData.type";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';

export const useUserData = (userId: string | undefined) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      const getUserDataById = async (id: string) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      };

      getUserDataById(userId).catch((error) => {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [userId]);

  return { userData, loading };
};

export const useUserAvatarUpload = (avatar: string, id: string) => {

  async function uploadAvatar() {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }

      const fileRef = ref(storage, 'userAvatars/' + userId + '.png');
      const userRef = doc(db, 'users', userId);
      if (avatar) {
        await uploadString(fileRef, avatar, 'data_url');
      }
      const photoURL = await getDownloadURL(fileRef);
      await updateDoc(userRef, {
        avatar: photoURL
      });
    } else {
      console.error("No authenticated user found");
    }
  }
  return uploadAvatar
}

export const useUserCoverImageUpload = () => {

  async function uploadCoverImage(id: string | undefined, cover: File | undefined) {
    if (id) {
      const fileRef = ref(storage, 'userCovers/' + id)
      const userRef = doc(db, 'users', id)
      await uploadBytes(fileRef, cover!, { contentType: 'image/png' }).then(async () => {
        await getDownloadURL(fileRef).then(async (coverURL) => {
          updateDoc(userRef, {
            coverImage: coverURL
          })
        })
      })
    }
  }
  return uploadCoverImage
}

