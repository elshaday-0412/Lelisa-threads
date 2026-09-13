import re

with open('server.ts', 'r') as f:
    text = f.read()

bad = """      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),"""

good = """      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0),"""

text = text.replace(bad, good)

with open('server.ts', 'w') as f:
    f.write(text)
