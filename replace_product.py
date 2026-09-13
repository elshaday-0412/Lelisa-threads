import re

with open('src/pages/ProductDetails.tsx', 'r') as f:
    c = f.read()

c = c.replace(">Weaving Story & Specifications<", ">{t.weavingStorySpecs}<")
c = c.replace(">Weaving Story &amp; Specifications<", ">{t.weavingStorySpecs}<")
c = c.replace(">Shemma Care Instructions<", ">{t.shemmaCareInstructions}<")
c = c.replace("Customer Reviews (", "{t.customerReviewsTab} (")
c = c.replace(">How to Care for your Habesha Kemis &amp; Traditional Wear<", ">{t.howToCare}<")
c = c.replace(">Hand Washing Recommended:<", ">{t.handWashing}<")
c = c.replace(">Wash gently in cold water using a mild pH-neutral liquid soap. Avoid harsh detergents or bleach that can fade Tilet embroidery.<", ">{t.handWashingDesc}<")
c = c.replace(">Dry Cleaning:<", ">{t.dryCleaning}<")
c = c.replace(">For garments with heavy metallic 24K gold thread Tilet or velvet accents, professional dry cleaning is strongly advised.<", ">{t.dryCleaningDesc}<")
c = c.replace(">Ironing:<", ">{t.ironing}<")
c = c.replace(">Press on a low-to-medium heat setting while the garment is slightly damp, or use a cloth barrier over the Tilet border.<", ">{t.ironingDesc}<")
c = c.replace(">Storage:<", ">{t.storage}<")
c = c.replace(">Store folded in a breathable cotton garment bag away from direct sunlight.<", ">{t.storageDesc}<")
c = c.replace(">Authentic Shemma Heritage<", ">{t.authenticShemmaHeritage}<")

with open('src/pages/ProductDetails.tsx', 'w') as f:
    f.write(c)
print("ProductDetails.tsx updated")
