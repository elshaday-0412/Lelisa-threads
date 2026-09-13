import re

with open('src/pages/Home.tsx', 'r') as f:
    c = f.read()

c = c.replace(">Curated Galleries<", ">{t.curatedGalleries}<")
c = c.replace(">Explore Traditional Collections<", ">{t.exploreTraditionalCollections}<")
c = c.replace("View All 8 Categories", "{t.viewAllCategories}")

with open('src/pages/Home.tsx', 'w') as f:
    f.write(c)
print("Home.tsx updated")
