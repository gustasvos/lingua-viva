import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const firebaseApp = initializeApp({
    apiKey: 'AIzaSyBDT_TIsHFo1aQ96_YZ87fNjooOu44wIgs',
    authDomain: 'lingua-viva-e14a1.firebaseapp.com',
    projectId: 'lingua-viva-e14a1',
});

export const firebaseAuth = getAuth(firebaseApp);
export { GoogleAuthProvider, signInWithCredential };