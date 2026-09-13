import re

with open('server.ts', 'r') as f:
    text = f.read()

bad = """    res.json({
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0),
      totalOrders: orders.length,
      recentOrders: orders.slice(0, 8)
    });"""

good = """    res.json({
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0),
      totalOrders: orders.filter(o => o.status !== 'cancelled').length,
      recentOrders: orders.slice(0, 8)
    });"""

text = text.replace(bad, good)

with open('server.ts', 'w') as f:
    f.write(text)
