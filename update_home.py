import re

with open('src/pages/Home.tsx', 'r') as f:
    c = f.read()

c = c.replace(">Just Arrived From Shemma Looms<", ">{t.justArrived}<")
c = c.replace(">New Arrivals &amp; Seasonal Weaves<", ">{t.newArrivalsSeasonal}<")
c = c.replace("Shop All New Arrivals", "{t.shopAllNew}")
c = c.replace(">The Art of Shemma<", ">{t.artOfShemma}<")
c = c.replace(">From the Artisan's Loom to Your Celebratory Moment<", ">{t.fromArtisans}<")
c = c.replace(">Every Habesha Threads garment begins with pure Ethiopian cotton spun by hand into delicate thread. Master weavers then loom the Shemma on traditional wooden looms, while skilled embroiderers stitch the Tilet pattern—a labor of love taking up to 4 weeks per dress.<", ">{t.everyGarment}<")
c = c.replace(">4+ Weeks<", ">{t.handweavingTime}<")
c = c.replace(">Handweaving &amp; Embroidery Time<", ">{t.handweavingDesc}<")
c = c.replace(">100% Organic<", ">{t.organicCotton}<")
c = c.replace(">Ethiopian High-Grade Cotton<", ">{t.organicCottonDesc}<")
c = c.replace(">Cultural Guarantee<", ">{t.culturalGuarantee}<")
c = c.replace(">&ldquo;Wearing our heritage with pride across the globe.&rdquo;<", '>&ldquo;{t.culturalGuaranteeDesc}&rdquo;<')
c = c.replace(">Voices of our Heritage Circle<", ">{t.voicesTitle}<")
c = c.replace(">Loved by Habeshas Worldwide<", ">{t.lovedBy}<")
c = c.replace(">&ldquo;I ordered the Sheba Royal Gold Habesha Kemis for my wedding Mels ceremony in Washington DC. The tailoring was flawless and the Tilet gold threads glimmered in every photo!&rdquo;<", '>&ldquo;{t.test1Desc}&rdquo;<')
c = c.replace(">Helen Mekonnen<", ">{t.test1Name}<")
c = c.replace(">Washington, DC<", ">{t.test1Loc}<")
c = c.replace(">&ldquo;The Lalibela Embroidered Traditional Suit for my husband fit like bespoke Savile Row tailoring. High-grade cotton and the embroidery is authentic. We will be ordering again.&rdquo;<", '>&ldquo;{t.test2Desc}&rdquo;<')
c = c.replace(">Bethelhem &amp; Dawit<", ">{t.test2Name}<")
c = c.replace(">Addis Ababa, Ethiopia<", ">{t.test2Loc}<")
c = c.replace(">&ldquo;The 24K Gold-Plated Filigree Cross Necklace is an absolute work of art. It reminds me of the ancient Axum crosses my grandmother wore. Truly stunning craftsmanship.&rdquo;<", '>&ldquo;{t.test3Desc}&rdquo;<')
c = c.replace(">Yared Kassahun<", ">{t.test3Name}<")
c = c.replace(">London, UK<", ">{t.test3Loc}<")
c = c.replace(">Explore Region<", ">{t.exploreRegion}<")

with open('src/pages/Home.tsx', 'w') as f:
    f.write(c)

print('Home updated')
