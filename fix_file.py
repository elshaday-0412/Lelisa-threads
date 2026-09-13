import re

with open('src/services/firebaseService.ts', 'r') as f:
    text = f.read()

# I will find all instances of `await setDoc(docRef, { ...` and fix their ends.
# Actually, I can just use a stack based bracket matcher to find unclosed `{` and insert `});`

def fix_unclosed_calls(text):
    lines = text.split('\n')
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        out.append(line)
        # Look for places where we need to close setDoc or updateDoc
        if "updatedAt: new Date().toISOString()" in line:
            # Check next line to see if it closes the object
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if not next_line.startswith("})") and not next_line.startswith("};") and not next_line.startswith("]"):
                    out.append("      });") # Add standard closing
        elif "createdAt: order.createdAt || new Date().toISOString()" in line:
             if i + 1 < len(lines) and not lines[i+1].strip().startswith("})"):
                  out.append("      });")
        i += 1
    return '\n'.join(out)

new_text = fix_unclosed_calls(text)
with open('src/services/firebaseService.ts', 'w') as f:
    f.write(new_text)

