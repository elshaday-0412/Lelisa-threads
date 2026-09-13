import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

bad = """        images: [newImage],"""
good = """        images: newImage ? [newImage] : [],"""

text = text.replace(bad, good)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
