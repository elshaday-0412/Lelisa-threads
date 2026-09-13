import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("images: newImage ? [newImage] : [],", "images: newImage ? [newImage] : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
