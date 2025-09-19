// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA88qaWBsecMoZEKIec_U_T46hIGLtn-A8",
  authDomain: "chello-3b3c7.firebaseapp.com",
  projectId: "chello-3b3c7",
  storageBucket: "chello-3b3c7.appspot.com",
  messagingSenderId: "865361402567",
  appId: "1:865361402567:web:47d777de919ecdf536fce2"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);

export const getfstore = getFirestore(app);
export default app 
