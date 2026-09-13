import fs from 'fs';
let content = fs.readFileSync('src/services/firebaseService.ts', 'utf8');

if (!content.includes('uploadProductImage')) {
  content = content.replace("import { auth, db } from '../lib/firebase.js';", "import { auth, db, storage } from '../lib/firebase.js';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase/storage';");

  const storageService = `
export const FirestoreStorageService = {
  async uploadProductImage(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = \`product-\${Date.now()}.\${fileExtension}\`;
    const storageRef = ref(storage, \`products/\${fileName}\`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
};
`;
  content += storageService;
  fs.writeFileSync('src/services/firebaseService.ts', content);
}
