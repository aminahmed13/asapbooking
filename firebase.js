import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCPUW1FW1KWzk4mjbVxeeqYqe6JfXRxUnQ",
  authDomain: "asapbooking-b9576.firebaseapp.com",
  projectId: "asapbooking-b9576",
  storageBucket: "asapbooking-b9576.appspot.com",
  messagingSenderId: "1075554800082",
  appId: "1:1075554800082:web:01969c5fefc492e2a6780b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       const messaging = getMessaging(app);
//       getToken(messaging, {
//         vapidKey:
//           "BKYnDD9MsraeKlwXZ7V7GJJnoaQ9ahZjatmzgUeulRMdlfbm7Bp6Ddl_46Fgh3WsNXIEEToLyvthrbblZc-RGQI",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("current token: ", currentToken);
//         } else {
//           console.log("cant get token");
//         }
//       });
//     } else {
//       console.log("Permission not granted");
//     }
//   });
// }

// requestPermission();
export { auth, db };
