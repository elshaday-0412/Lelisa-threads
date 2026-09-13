import re

with open('src/components/Footer.tsx', 'r') as f:
    c = f.read()

c = c.replace('>Global Express Delivery<', '>{t.expressDelivery}<')
c = c.replace('>Addis Ababa, Europe, & North America<', '>{t.footerExpressDesc}<')
c = c.replace('>Authentic Craftsmanship<', '>{t.artisanCrafted}<')
c = c.replace('>Handwoven by master artisans in Ethiopia<', '>{t.footerArtisanDesc}<')
c = c.replace('>Bespoke Custom Fitting<', '>{t.bespokeFitting}<')
c = c.replace('>Tailored measurements for weddings & Mels<', '>{t.bespokeFittingDesc}<')
c = c.replace('>Preserving the sacred weaving heritage of Shemma and Tilet. Crafted for celebrations, weddings, and modern elegance.<', '>{t.footerDesc}<')
c = c.replace('>Collections<', '>{t.collectionsHeader}<')
c = c.replace('>Habesha Kemis<', '>{t.catHabeshaKemis}<')
c = c.replace('>T-Shirts & Shirts<', '>{t.catTShirts}<')
c = c.replace('>Sweaters (Shurabii)<', '>{t.catSweaters}<')
c = c.replace(">Children's Wear<", ">{t.catChildrens}<")
c = c.replace('>Netela & Gabi Wraps<', '>{t.catScarves}<')
c = c.replace('>Traditional Bags<', '>{t.catBags}<')
c = c.replace('>Cultural Heritage<', '>{t.culturalHeritageHeader}<')
c = c.replace('>Gondar & Lalibela Tilet<', '>{t.gondarLalibela}<')
c = c.replace('>Tigray Raya & Axum Zuria<', '>{t.tigrayAxum}<')
c = c.replace('>Oromo Woyya & Abba Gadaa<', '>{t.oromoWoyya}<')
c = c.replace('>Harari Ge-Gara Silk<', '>{t.harariSilk}<')
c = c.replace('>Gurage Enset Kemis<', '>{t.gurageEnset}<')
c = c.replace('>VIP Heritage Circle<', '>{t.vipHeritageCircle}<')
c = c.replace('>Receive private notifications for seasonal weaves and bespoke bridal releases.<', '>{t.vipDesc}<')
c = c.replace('placeholder="Your email address"', 'placeholder={t.emailPlaceholder}')

with open('src/components/Footer.tsx', 'w') as f:
    f.write(c)

print('Footer updated')
