// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB4lvWpbDfr8pO1aFVHpBeQGh9uaejUJfQ',
  authDomain: 'smarthealth-cd862.firebaseapp.com',
  projectId: 'smarthealth-cd862',
  storageBucket: 'smarthealth-cd862.firebasestorage.app',
  messagingSenderId: '444230094713',
  appId: '1:444230094713:web:e295c3be3d16a56bbea9a8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
