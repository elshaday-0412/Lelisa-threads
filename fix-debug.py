import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("showToast('Error', 'Failed to update garment.', 'error');", "console.error(err); showToast('Error', 'Failed to update garment: ' + (err.message || 'Unknown'), 'error');")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
