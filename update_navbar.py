import re

with open('src/components/Navbar.tsx', 'r') as f:
    c = f.read()

c = c.replace(">New Arrivals<", ">{t.newArrivals}<")
c = c.replace(">Categories Gallery<", ">{t.categoriesGallery}<")
c = c.replace(">Popular Categories<", ">{t.popularCategories}<")
c = c.replace(">My Orders<", ">{t.myOrders}<")
c = c.replace(">Sign Out<", ">{t.signOut}<")
c = c.replace("> Sign In / Register<", "> {t.signIn}<")
c = c.replace('Currency: <', '{t.currencyPrefix}<')
c = c.replace('Lang: <', '{t.langPrefix}<')
c = c.replace('placeholder="Search Habesha Kemis, Tilet..."', 'placeholder={t.searchMobile}')
c = c.replace(">Navigation<", ">{t.navigation}<")
c = c.replace(">• Habesha Kemis (Women's Dresses)<", ">• {t.catHabeshaKemis}<")
c = c.replace(">• Men's Traditional Wear<", ">• {t.catMens}<")
c = c.replace(">• Wedding & Mels Couture<", ">• {t.catWedding}<")
c = c.replace(">• Axumite Filigree Jewelry<", ">• {t.catJewelry}<")

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(c)

print('Navbar updated')
