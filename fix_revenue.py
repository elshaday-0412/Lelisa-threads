import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

bad = """  // Analytics calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);"""

good = """  // Analytics calculations
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0);"""

text = text.replace(bad, good)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
