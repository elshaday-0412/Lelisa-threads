import fs from 'fs';
let c = fs.readFileSync('src/lib/firebase.ts', 'utf8');
c = c.replace("import { getFirestore } from 'firebase/firestore';", "import { getFirestore, initializeFirestore } from 'firebase/firestore';");
c = c.replace("export const db = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId);", "export const db = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true }, firebaseConfigJson.firestoreDatabaseId);");
fs.writeFileSync('src/lib/firebase.ts', c);
