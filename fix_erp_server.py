import re

with open('server.ts', 'r') as f:
    text = f.read()

bad = """    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']),"""
good = """    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : (item.images ? [item.images] : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'])),"""

text = text.replace(bad, good)

with open('server.ts', 'w') as f:
    f.write(text)
