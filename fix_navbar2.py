import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

bad = "{user.role === 'admin' ? 'ADMIN PORTAL' : t.myOrders}"
good = "{user.role.toLowerCase() === 'admin' ? 'ADMIN PORTAL' : t.myOrders}"
text = text.replace(bad, good)

bad2 = "if (user.role === 'admin') {"
good2 = "if (user.role.toLowerCase() === 'admin') {"
text = text.replace(bad2, good2)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
