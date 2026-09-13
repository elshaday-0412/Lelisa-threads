import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

bad_buyers = """    orders.forEach(order => {
      order.items.forEach(item => {"""

good_buyers = """    orders.filter(o => o.status !== 'cancelled').forEach(order => {
      order.items.forEach(item => {"""

text = text.replace(bad_buyers, good_buyers)

bad_avg = """  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;"""

good_avg = """  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;"""

text = text.replace(bad_avg, good_avg)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
