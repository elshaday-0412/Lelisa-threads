with open('src/services/firebaseService.ts', 'r') as f:
    text = f.read()

text = text.replace("      });\n      }, { merge: true });", "      }, { merge: true });")
with open('src/services/firebaseService.ts', 'w') as f:
    f.write(text)
