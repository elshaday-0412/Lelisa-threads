import os
import re

files = []
for root, dirs, filenames in os.walk('src'):
    for f in filenames:
        if f.endswith('.tsx'):
            files.append(os.path.join(root, f))

strings = set()
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        # Find text between > and <
        matches = re.findall(r'>\s*([A-Za-z0-9][^<{]*[A-Za-z0-9\.?!])\s*<', content)
        for m in matches:
            if not m.startswith('{') and not m.endswith('}'):
                strings.add(m.strip())

print("Found", len(strings), "strings")
for s in sorted(strings):
    print(s)
