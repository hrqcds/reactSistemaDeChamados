import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

let firebaseConfig = {
    apiKey: "AIzaSyDqaCRH4Bw8Nwoatrpibv8RCAw5ROthNiM",
    authDomain: "sistema-de-chamados-1ea48.firebaseapp.com",
    projectId: "sistema-de-chamados-1ea48",
    storageBucket: "sistema-de-chamados-1ea48.appspot.com",
    messagingSenderId: "334083415258",
    appId: "1:334083415258:web:272b1bdb7e9e701bfb59e3",
    measurementId: "G-NH74XBBJNW"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase