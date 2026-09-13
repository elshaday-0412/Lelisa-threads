import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "setNewSizes(product.sizes ? product.sizes.join(', ') : 'S, M, L, XL');",
    "setNewSizes(Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes ? String(product.sizes) : 'S, M, L, XL'));"
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
