import fs from 'fs';
let c = fs.readFileSync('src/lib/firebase.ts', 'utf8');
c = c.replace(
  "export const db = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true }, firebaseConfigJson.firestoreDatabaseId);",
  "let dbInstance;\ntry {\n  dbInstance = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true }, firebaseConfigJson.firestoreDatabaseId);\n} catch (e) {\n  dbInstance = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId);\n}\nexport const db = dbInstance;"
);
fs.writeFileSync('src/lib/firebase.ts', c);
