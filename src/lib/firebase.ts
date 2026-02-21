import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | undefined;
let storage: FirebaseStorage | undefined;

export function initFirebase(config: any) {
    if (!config) return;
    try {
        app = initializeApp(config);
        storage = getStorage(app);
        console.log("Firebase initialized");
        return true;
    } catch (e) {
        console.error("Firebase init error", e);
        return false;
    }
}

export async function uploadImage(file: File): Promise<string> {
    if (!storage) throw new Error("Firebase Storage not initialized");

    const storageRef = ref(storage, 'closet-items/' + Date.now() + '-' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export function isFirebaseConfigured() {
    return !!app && !!storage;
}
