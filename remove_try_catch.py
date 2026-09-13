with open('src/services/firebaseService.ts', 'r') as f:
    text = f.read()

# Instead of blindly removing try/catch, I'll just change console.warn to console.error and maybe throw the error.

text = text.replace("console.warn('Firestore user registration setDoc notice:', fsErr);", "console.error('Firestore user registration setDoc notice:', fsErr); throw fsErr;")
text = text.replace("console.warn('Firestore doc sync notice during Google login:', fsErr);", "console.error('Firestore doc sync notice during Google login:', fsErr); throw fsErr;")
text = text.replace("console.warn('Firestore doc fetch notice during email login:', fsErr);", "console.error('Firestore doc fetch notice during email login:', fsErr); throw fsErr;")
text = text.replace("console.warn('Firestore update notice during password link:', fsErr);", "console.error('Firestore update notice during password link:', fsErr); throw fsErr;")

with open('src/services/firebaseService.ts', 'w') as f:
    f.write(text)
