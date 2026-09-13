import re

with open('server.ts', 'r') as f:
    text = f.read()

text = text.replace("o.status !== 'cancelled'", "o.status !== 'CANCELLED'")

with open('server.ts', 'w') as f:
    f.write(text)
