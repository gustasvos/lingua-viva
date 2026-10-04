import path from "path";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
    credential: cert(
        path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!)
    ),
});

export const firebaseAuth = getAuth(app);