import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config';

// The main App component will now verify the configuration is valid before initializing.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);