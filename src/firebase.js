import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAON,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

export default app;
export const db = getFirestore(app);

export async function aliasExistsCheck(alias) {
  try {
    const urlsRef = collection(db, "urls");
    const q = query(urlsRef, where("url", "==", alias));

    const querySnapshot = await getDocs(q);

    const queryArr = [];

    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      queryArr.push(doc.id, " => ", doc.data());
    });
    console.log(queryArr)
    return queryArr.length > 0;
  } catch (e) {
    console.error("Error querying document: ", e);
    return e.response;
  }
}

export async function addNewUrl(enteredUrl, alias) {
  let outputAlias = alias;

  // if no alias is provided, generate a random 6 char string
  if (!outputAlias) {
    outputAlias = Math.random().toString(36).slice(7);
  }

  let outputUrl = enteredUrl;

  // ensure that url always starts with https:// or http://
  if (!enteredUrl.startsWith("https://") && !enteredUrl.startsWith("http://")) {
    outputUrl = `https://${enteredUrl}`;
  }

  try {
    const aliasExists = await aliasExistsCheck(outputAlias);
    
    if (aliasExists) {
      throw new Error("url already exists");
    } else {
      await addDoc(collection(db, "urls"), {
        url: outputUrl,
        alias: outputAlias,
      });

      return outputAlias
    }
    
  } catch (e) {
    console.error("Error adding document: ", e);
    return e.response;
  }
}

export async function retrieveUrl(alias) {
  try {
    const urlsRef = collection(db, "urls");
    const q = query(urlsRef, where("alias", "==", alias));

    const querySnapshot = await getDocs(q);

    const queryArr = [];

    querySnapshot.forEach((doc) => {
      queryArr.push(doc.data());
    });

    return queryArr[0].url;
  } catch (e) {
    console.error("Error retrieving URL: ", e);
    return e.response;
  }
}
