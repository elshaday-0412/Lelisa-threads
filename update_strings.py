import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add types
types_insertion = """
  // More Elements
  curatedGalleries: string;
  exploreTraditionalCollections: string;
  viewAllCategories: string;
  weavingStorySpecs: string;
  shemmaCareInstructions: string;
  customerReviewsTab: string;
  howToCare: string;
  handWashing: string;
  handWashingDesc: string;
  dryCleaning: string;
  dryCleaningDesc: string;
  ironing: string;
  ironingDesc: string;
  storage: string;
  storageDesc: string;
  authenticShemmaHeritage: string;
  habeshaHeritageCircle: string;
  welcome: string;
  emailLabel: string;
  roleLabel: string;
  myOrdersTab: string;
  favoritesTab: string;
  addressesProfileTab: string;
  cancellationsSupport: string;
  cancellationsSupportDesc: string;
  favoritesEmpty: string;
  favoritesEmptyDesc: string;
  browseCatalog: string;
"""

c = c.replace('codCancelFee: string;\n}', 'codCancelFee: string;\n' + types_insertion + '}')

en_insertion = """
    curatedGalleries: 'Curated Galleries',
    exploreTraditionalCollections: 'Explore Traditional Collections',
    viewAllCategories: 'View All 8 Categories',
    weavingStorySpecs: 'Weaving Story & Specifications',
    shemmaCareInstructions: 'Shemma Care Instructions',
    customerReviewsTab: 'Customer Reviews',
    howToCare: 'How to Care for your Habesha Kemis & Traditional Wear',
    handWashing: 'Hand Washing Recommended:',
    handWashingDesc: 'Wash gently in cold water using a mild pH-neutral liquid soap. Avoid harsh detergents or bleach that can fade Tilet embroidery.',
    dryCleaning: 'Dry Cleaning:',
    dryCleaningDesc: 'For garments with heavy metallic 24K gold thread Tilet or velvet accents, professional dry cleaning is strongly advised.',
    ironing: 'Ironing:',
    ironingDesc: 'Press on a low-to-medium heat setting while the garment is slightly damp, or use a cloth barrier over the Tilet border.',
    storage: 'Storage:',
    storageDesc: 'Store folded in a breathable cotton garment bag away from direct sunlight.',
    authenticShemmaHeritage: 'Authentic Shemma Heritage',
    habeshaHeritageCircle: 'Habesha Heritage Circle',
    welcome: 'Welcome,',
    emailLabel: 'Email:',
    roleLabel: 'Role:',
    myOrdersTab: 'My Orders',
    favoritesTab: 'Favorites',
    addressesProfileTab: 'Addresses & Profile',
    cancellationsSupport: 'Cancellations & Support',
    cancellationsSupportDesc: 'You can instantly cancel your order below if its status is still RECEIVED (NEW). Once it changes to "Preparing" or "Shipped", please contact our support team to request a manual cancellation. Refunds for Chapa digital payments are processed within 3-5 business days back to your original payment method. Cash on Delivery orders can be safely cancelled before dispatch.',
    favoritesEmpty: 'Your Favorites is Empty',
    favoritesEmptyDesc: 'Save your favorite kemis, suits, and necklaces for upcoming weddings.',
    browseCatalog: 'Browse Catalog',
"""

c = c.replace("codCancelFee: 'If you wish to cancel at the door, a small 150 ETB delivery fee may apply to compensate our drivers.',\n  },", "codCancelFee: 'If you wish to cancel at the door, a small 150 ETB delivery fee may apply to compensate our drivers.'," + en_insertion + "  },")

am_insertion = """
    curatedGalleries: 'የተመረጡ ማዕከለ-ስዕላት',
    exploreTraditionalCollections: 'ባህላዊ ስብስቦችን ያስሱ',
    viewAllCategories: 'ሁሉንም 8ቱን መደቦች ይመልከቱ',
    weavingStorySpecs: 'የሽመና ታሪክ እና ዝርዝር መረጃ',
    shemmaCareInstructions: 'የሸማ እንክብካቤ መመሪያዎች',
    customerReviewsTab: 'የደንበኛ ግምገማዎች',
    howToCare: 'የሀበሻ ቀሚስዎን እና ባህላዊ ልብሶችን እንዴት እንደሚንከባከቡ',
    handWashing: 'በእጅ ማጠብ ይመከራል፡',
    handWashingDesc: 'ለስላሳ እና ፒኤች-ሚዛኑን የጠበቀ ፈሳሽ ሳሙና በመጠቀም በቀዝቃዛ ውሃ በቀስታ ያጠቡት። የጥበብ ጥልፍን ሊያደበዝዙ የሚችሉ ጠንካራ ሳሙናዎችን ወይም በረኪናን ያስወግዱ።',
    dryCleaning: 'በደረቅ እጥበት (ድራይ ክሊኒንግ)፡',
    dryCleaningDesc: 'ለከባድ ብረታማ 24 ካራት የወርቅ ክር ጥበብ ወይም ቬልቬት ለተጨመረባቸው አልባሳት፣ ሙያዊ የደረቅ እጥበት በጥብቅ ይመከራል።',
    ironing: 'መተኮስ፡',
    ironingDesc: 'ልብሱ ትንሽ ርጥብ እያለ በዝቅተኛ ወይም መካከለኛ ሙቀት ይተኩሱ፣ ወይም በጥበቡ ላይ የጨርቅ መከላከያ ይጠቀሙ።',
    storage: 'አቀማመጥ፡',
    storageDesc: 'ከቀጥታ የፀሐይ ብርሃን ርቆ አየር በሚያስገባ የጥጥ ልብስ መያዣ ውስጥ አጥፈው ያስቀምጡ።',
    authenticShemmaHeritage: 'እውነተኛ የሸማ ቅርስ',
    habeshaHeritageCircle: 'የሀበሻ የቅርስ ክበብ',
    welcome: 'እንኳን ደህና መጡ፣',
    emailLabel: 'ኢሜይል፡',
    roleLabel: 'ሚና፡',
    myOrdersTab: 'የኔ ትዕዛዞች',
    favoritesTab: 'የተመረጡ',
    addressesProfileTab: 'አድራሻ እና መለያ',
    cancellationsSupport: 'ስረዛዎች እና ድጋፍ',
    cancellationsSupportDesc: 'ትዕዛዝዎ አሁንም "አዲስ" ሁኔታ ላይ ከሆነ ከታች ወዲያውኑ መሰረዝ ይችላሉ። አንዴ ወደ "እየተዘጋጀ" ወይም "ተልኳል" ከተቀየረ እባክዎ መሰረዝ ከፈለጉ የድጋፍ ቡድናችንን ያነጋግሩ። የቻፓ ዲጂታል ክፍያዎች ተመላሽ ገንዘብ በ3-5 የስራ ቀናት ውስጥ ወደ መጀመሪያው የክፍያ መንገድዎ ይመለሳል። በር ላይ ማድረስ ትዕዛዞችን ከመላካቸው በፊት በአስተማማኝ ሁኔታ መሰረዝ ይችላሉ።',
    favoritesEmpty: 'የምኞት ዝርዝርዎ ባዶ ነው',
    favoritesEmptyDesc: 'ለሚመጡት ሰርጎች የሚወዷቸውን ቀሚሶች፣ ልብሶች እና የአንገት ሀብሎች እዚህ ያስቀምጡ።',
    browseCatalog: 'አልባሳትን ያስሱ',
"""

c = c.replace("codCancelFee: 'በሩ ላይ ለማሰረዝ ከፈለጉ፣ ለአሽከርካሪዎቻችን ማካካሻ አነስተኛ የ150 ብር የማድረሻ ክፍያ ሊጠየቁ ይችላሉ።',\n  },", "codCancelFee: 'በሩ ላይ ለማሰረዝ ከፈለጉ፣ ለአሽከርካሪዎቻችን ማካካሻ አነስተኛ የ150 ብር የማድረሻ ክፍያ ሊጠየቁ ይችላሉ።'," + am_insertion + "  },")

om_insertion = """
    curatedGalleries: 'Kuusaa Filatamaa',
    exploreTraditionalCollections: 'Walitti qabama Aadaa Barsiifadhaa',
    viewAllCategories: 'Gosoota 8n Hunda Ilaali',
    weavingStorySpecs: 'Seenaa Dhahaa fi Ibsa',
    shemmaCareInstructions: 'Qajeelfama Kunuunsa Shemmaa',
    customerReviewsTab: 'Yaada Maamiltootaa',
    howToCare: 'Uffata Aadaa Keessan Akkamitti Kunuunsuu Qabdu',
    handWashing: 'Harkaan Miiccuun Gorfama:',
    handWashingDesc: 'Bishaan qabbanaa\'aa fi saamunaa dhangala\'aa laafaa ta\'een suuta miiccaa. Saamunaa jabaa ykn berekinaa halluu xillee balleessuu danda\'an irraa fagaadhaa.',
    dryCleaning: 'Qulqulleessa Gogaa (Dry Cleaning):',
    dryCleaningDesc: 'Uffata xillee warqee 24K ulfaataa ykn velvet qabuuf, qulqulleessi gogaa ogummaa baay\'ee gorfama.',
    ironing: 'Kulaa ykn Filaa:',
    ironingDesc: 'Yeroo uffanni xinnoo jiidu ho\\'a xiqqaa hanga giddugaleessatti teessisaa ykn xillee irra huccuu haguuggii kaa\'aa.',
    storage: 'Kuusaa:',
    storageDesc: 'Ifa aduu kallattii irraa fagaatee borsaa uffataa qilleensa galchu keessatti dachaastanii kuusaa.',
    authenticShemmaHeritage: 'Aadaa Shemmaa Dhugaa',
    habeshaHeritageCircle: 'Maatii Aadaa Habeshaa',
    welcome: 'Baga Nagaan Dhuftan,',
    emailLabel: 'Iimeeylii:',
    roleLabel: 'Gahee:',
    myOrdersTab: 'Ajaja Koo',
    favoritesTab: 'Filatamaa',
    addressesProfileTab: 'Teessoo fi Akkaawuntii',
    cancellationsSupport: 'Haqiinsa fi Deeggarsa',
    cancellationsSupportDesc: 'Ajaja keessan yoo haalli isaa ammas "Haaraa" ta\'e armaan gaditti hatattamaan haquu dandeessu. Erga gara "Qophaa\'aa" ykn "Ergameera" tti jijjiiramee booda, maaloo haquuf garee deeggarsa keenyaa qunnamaa. Deebiin maallaqaa kaffaltii dijitaalaa Chapa guyyoota hojii 3-5 keessatti gara mala kaffaltii jalqabaatti raawwatama. Ajaji balbala irratti kaffalamu osoo hin ergamin duratti haquun ni danda\'ama.',
    favoritesEmpty: 'Filatamaan Keessan Duudaadha',
    favoritesEmptyDesc: 'Cidha dhufuuf kemis, uffata dhiiraa fi faaya mormaa jaallattan asitti olkaa\'aa.',
    browseCatalog: 'Uffata Ilaali',
"""

c = c.replace("codCancelFee: 'Yoo balbala irratti haquu barbaaddan, kaffaltiin geejjibaa xinnoo 150 ETB konkolaachiftota keenyaaf akka beenyaatti gaafatamuu danda\\'a.',\n  }\n};", "codCancelFee: 'Yoo balbala irratti haquu barbaaddan, kaffaltiin geejjibaa xinnoo 150 ETB konkolaachiftota keenyaaf akka beenyaatti gaafatamuu danda\\'a.'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)

print("translations.ts updated successfully with the requested keys")
