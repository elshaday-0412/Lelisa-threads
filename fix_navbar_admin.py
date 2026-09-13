import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

bad = "user?.role === 'admin'"
good = "user?.role === 'ADMIN'"

text = text.replace(bad, good)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
