import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add types
types_insertion = """
  // Home new
  justArrived: string;
  newArrivalsSeasonal: string;
  shopAllNew: string;
  artOfShemma: string;
  fromArtisans: string;
  everyGarment: string;
  handweavingTime: string;
  handweavingDesc: string;
  organicCotton: string;
  organicCottonDesc: string;
  culturalGuarantee: string;
  culturalGuaranteeDesc: string;
  voicesTitle: string;
  lovedBy: string;
  test1Desc: string;
  test1Name: string;
  test1Loc: string;
  test2Desc: string;
  test2Name: string;
  test2Loc: string;
  test3Desc: string;
  test3Name: string;
  test3Loc: string;
  exploreRegion: string;
"""

c = c.replace('emailPlaceholder: string;\n}', 'emailPlaceholder: string;\n' + types_insertion + '}')

en_insertion = """
    justArrived: 'Just Arrived From Shemma Looms',
    newArrivalsSeasonal: 'New Arrivals & Seasonal Weaves',
    shopAllNew: 'Shop All New Arrivals',
    artOfShemma: 'The Art of Shemma',
    fromArtisans: 'From the Artisan\\'s Loom to Your Celebratory Moment',
    everyGarment: 'Every Wanofi Design garment begins with pure Ethiopian cotton spun by hand into delicate thread. Master weavers then loom the Shemma on traditional wooden looms, while skilled embroiderers stitch the Tilet pattern—a labor of love taking up to 4 weeks per dress.',
    handweavingTime: '4+ Weeks',
    handweavingDesc: 'Handweaving & Embroidery Time',
    organicCotton: '100% Organic',
    organicCottonDesc: 'Ethiopian High-Grade Cotton',
    culturalGuarantee: 'Cultural Guarantee',
    culturalGuaranteeDesc: 'Wearing our heritage with pride across the globe.',
    voicesTitle: 'Voices of our Heritage Circle',
    lovedBy: 'Loved by Habeshas Worldwide',
    test1Desc: 'I ordered the Sheba Royal Gold Habesha Kemis for my wedding Mels ceremony in Washington DC. The tailoring was flawless and the Tilet gold threads glimmered in every photo!',
    test1Name: 'Helen Mekonnen',
    test1Loc: 'Washington, DC',
    test2Desc: 'The Lalibela Embroidered Traditional Suit for my husband fit like bespoke Savile Row tailoring. High-grade cotton and the embroidery is authentic. We will be ordering again.',
    test2Name: 'Bethelhem & Dawit',
    test2Loc: 'Addis Ababa, Ethiopia',
    test3Desc: 'The 24K Gold-Plated Filigree Cross Necklace is an absolute work of art. It reminds me of the ancient Axum crosses my grandmother wore. Truly stunning craftsmanship.',
    test3Name: 'Yared Kassahun',
    test3Loc: 'London, UK',
    exploreRegion: 'Explore Region',
"""

c = c.replace("emailPlaceholder: 'Your email address',\n  },", "emailPlaceholder: 'Your email address'," + en_insertion + "  },")

am_insertion = """
    justArrived: 'አዲስ ከሸማኔዎች የደረሱ',
    newArrivalsSeasonal: 'አዲስ የገቡ እና የወቅቱ አልባሳት',
    shopAllNew: 'ሁሉንም አዲስ የገቡ ይመልከቱ',
    artOfShemma: 'የሸማ ጥበብ',
    fromArtisans: 'ከሽማኔው እጅ እስከ ክብረ በዓልዎ',
    everyGarment: 'እያንዳንዱ የዋኖፊ ዲዛይን ልብስ የሚጀምረው በእጅ በተፈተለ ንጹህ የኢትዮጵያ ጥጥ ነው። የተካኑ ሸማኔዎች ባህላዊ የሸማ መሣሪያን በመጠቀም ሲሸምኑ፣ ጥበብ ሰሪዎች ደግሞ የጥበብ ንድፉን በጥንቃቄ ይሰፋሉ—ለአንድ ቀሚስ እስከ 4 ሳምንታት የሚፈጅ የጥበብ ስራ።',
    handweavingTime: '4+ ሳምንታት',
    handweavingDesc: 'የሽመና እና የጥልፍ ጊዜ',
    organicCotton: '100% ተፈጥሯዊ ጥጥ',
    organicCottonDesc: 'ከፍተኛ ጥራት ያለው የኢትዮጵያ ጥጥ',
    culturalGuarantee: 'የባህል ዋስትና',
    culturalGuaranteeDesc: 'ባህላችንን በዓለም ዙሪያ በኩራት መልበስ።',
    voicesTitle: 'ከደንበኞቻችን አስተያየት',
    lovedBy: 'በዓለም ዙሪያ በሚገኙ ኢትዮጵያውያን የተወደደ',
    test1Desc: 'የሳባ ወርቃማ ሀበሻ ቀሚስ ለሠርጌ መልስ ዝግጅት ዋሽንግተን ዲሲ አዝዤ ነበር። ስፌቱ ፍፁም ነበረ እናም የጥበቡ ወርቃማ ክሮች በፎቶዎች ላይ ያንፀባርቁ ነበር!',
    test1Name: 'ሄለን መኮንን',
    test1Loc: 'ዋሽንግተን ዲሲ',
    test2Desc: 'የላሊበላ ባህላዊ የጥልፍ ልብስ ለባለቤቴ በጣም በሚያምር ሁኔታ ልኩን ጠብቆ ተሰፍቶለታል። ንጹህ ጥጥ እና እውነተኛ ጥልፍ። እንደገና እንደምናዝ ምንም ጥርጥር የለውም።',
    test2Name: 'ቤተልሔም እና ዳዊት',
    test2Loc: 'አዲስ አበባ፣ ኢትዮጵያ',
    test3Desc: 'በ24 ካራት ወርቅ የተለበጠው የአክሱም መስቀል የአንገት ሀብል እውነተኛ የጥበብ ስራ ነው። አያቴ ታደርገው የነበረውን ጥንታዊ የአክሱም መስቀል ያስታውሰኛል። አስደናቂ እደ-ጥበብ ነው።',
    test3Name: 'ያሬድ ካሳሁን',
    test3Loc: 'ለንደን፣ እንግሊዝ',
    exploreRegion: 'ስለ ክልሉ ይወቁ',
"""

c = c.replace("emailPlaceholder: 'የኢሜይል አድራሻዎ',\n  },", "emailPlaceholder: 'የኢሜይል አድራሻዎ'," + am_insertion + "  },")

om_insertion = """
    justArrived: 'Haaraa Harka Ogeessotaarraa Dhufe',
    newArrivalsSeasonal: 'Uffata Haaraa fi Yeroo Cidhaa',
    shopAllNew: 'Uffata Haaraa Hunda Ilaali',
    artOfShemma: 'Aadaa Dhahaa',
    fromArtisans: 'Harka Ogeessotaarraa Hanga Sirna Kabajaa Keessaniitti',
    everyGarment: 'Uffanni Wanofi Design hundi kan jalqabu jirbii Itoophiyaa harkaadhaan fo\\'ame irraati. Ogeessonni dhahaa uffata kana harkaadhaan erga dhahanii booda, ogeessonni xillee gosa bareedaa itti godhu—uffata tokkoof hanga torbee 4 fudhata.',
    handweavingTime: 'Torbee 4+',
    handweavingDesc: 'Yeroo Dhahaa fi Xillee',
    organicCotton: '100% Uumamaa',
    organicCottonDesc: 'Jirbii Itoophiyaa Qulqullina Olaanaa Qabu',
    culturalGuarantee: 'Wabii Aadaa',
    culturalGuaranteeDesc: 'Aadaa keenya addunyaa guutuutti boonsuudhaan uffachuu.',
    voicesTitle: 'Yaada Maamiltoota Keenyaa',
    lovedBy: 'Itoophiyyota Addunyaa Guutuun Kan Jaallatame',
    test1Desc: 'Uffata aadaa Sahaabaa Warqee sirna deebii kootiif Washington DC-tti ajajeen ture. Safarri isaa baay\\'ee sirrii ture, akkasumas halluun warqee xillee isaa suuraa hunda irratti ni ifa ture!',
    test1Name: 'Helen Makonnin',
    test1Loc: 'Washington DC',
    test2Desc: 'Uffanni aadaa Laalibelaa abbaa manaa kootiif hodhame haalaan safara isaa eegee bareedeera. Jirbii qulqulluu fi xillee sirrii ta\\'eedha. Irra deebi\\'a ni ajajna.',
    test2Name: 'Betelehem fi Daawit',
    test2Loc: 'Finfinnee, Itoophiyaa',
    test3Desc: 'Faayni mormaa Fannoo Aksum warqee 24K tiin hojjetame hojii aadaa addaati. Fannoo Aksum durii akkoon koo godhattu na yaadachiisa. Dhugumatti hojii harkaa ajaa\\'ibaati.',
    test3Name: 'Yaared Kaasaahun',
    test3Loc: 'Landan, UK',
    exploreRegion: 'Naannoo Kana Barsiifadhu',
"""

c = c.replace("emailPlaceholder: 'Teessoo iimeeylii keessan',\n  }\n};", "emailPlaceholder: 'Teessoo iimeeylii keessan'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)

print("translations.ts updated successfully with Home keys")
