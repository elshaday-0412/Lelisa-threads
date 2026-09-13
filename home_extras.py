import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

types_insertion = """
  // Home Extra 
  expressText: string;
  shemmaText: string;
  telebirrText: string;
  amharaHeritage: string;
  gondarLalibela: string;
  amharaDesc: string;
  tigrayHeritage: string;
  axumRaya: string;
  tigrayDesc: string;
  oromoHeritage: string;
  woyyaAbbaGadaa: string;
  oromoDesc: string;
  harariGurage: string;
  geGaraEnset: string;
  harariDesc: string;
  everyRegionWeaves: string;
  justArrivedFromLooms: string;
"""
c = c.replace('connectingGateway: string;\n}', 'connectingGateway: string;\n' + types_insertion + '}')

en_insertion = """
    expressText: 'Express',
    shemmaText: 'Shemma',
    telebirrText: 'Telebirr',
    amharaHeritage: 'Amhara Heritage',
    gondarLalibela: 'Gondar & Lalibela',
    amharaDesc: 'Known for pristine white handwoven cotton Shemma with rich Tilet embroidery featuring golden crosses and royal geometric bands.',
    tigrayHeritage: 'Tigray Heritage',
    axumRaya: 'Axum & Raya',
    tigrayDesc: 'Celebrated for vibrant Raya braiding, intricate Axumite Zuria patterns, and exquisite silver and gold filigree adornments.',
    oromoHeritage: 'Oromo Heritage',
    woyyaAbbaGadaa: 'Woyya & Abba Gadaa',
    oromoDesc: 'Distinctive handwoven Woyya robes with bold red, black, and white Tilet motifs representing unity and traditional leadership.',
    harariGurage: 'Harari & Gurage',
    geGaraEnset: 'Ge-Gara & Enset Weaves',
    harariDesc: 'Richly dyed silk and cotton weaves with intricate floral and geometric embroidery worn during celebrations and wedding ceremonies.',
    everyRegionWeaves: 'Every region of Ethiopia weaves its story into the fabric of the Shemma. From the historic castles of Gondar to the ancient obelisks of Axum, discover garments that celebrate regional identity.',
    justArrivedFromLooms: 'Just Arrived From Shemma Looms',
"""
c = c.replace("connectingGateway: 'Connecting to Gateway...',\n  },", "connectingGateway: 'Connecting to Gateway...'," + en_insertion + "  },")

am_insertion = """
    expressText: 'ፈጣን ማድረስ (Express)',
    shemmaText: 'ሸማ',
    telebirrText: 'ቴሌብር',
    amharaHeritage: 'የአማራ ቅርስ',
    gondarLalibela: 'ጎንደር እና ላሊበላ',
    amharaDesc: 'በንፁህ ነጭ የጥጥ ሸማ እና በወርቃማ መስቀሎች እና በንጉሳዊ የጂኦሜትሪክ ንድፎች ያሸበረቀ ጥበብ ይታወቃል።',
    tigrayHeritage: 'የትግራይ ቅርስ',
    axumRaya: 'አክሱም እና ራያ',
    tigrayDesc: 'በደማቅ የራያ ሹሩባ፣ በተወሳሰቡ የአክሱማውያን ዙሪያ ንድፎች እና በብር እና ወርቅ ጌጣጌጦች ይከበራል።',
    oromoHeritage: 'የኦሮሞ ቅርስ',
    woyyaAbbaGadaa: 'ወያ እና አባ ገዳ',
    oromoDesc: 'አንድነትን እና ባህላዊ አመራርን በሚወክሉ ደማቅ ቀይ፣ ጥቁር እና ነጭ የጥበብ ንድፎች የተሰሩ ልዩ የወያ ልብሶች።',
    harariGurage: 'ሐረሪ እና ጉራጌ',
    geGaraEnset: 'ጌ-ጋራ እና የእንሰት ሽመና',
    harariDesc: 'በበዓላት እና በሰርግ ስነ-ስርዓቶች ላይ የሚለበሱ፣ በተወሳሰቡ የአበባ እና ጂኦሜትሪክ ጥልፍ ያሸበረቁ የሐር እና የጥጥ ልብሶች።',
    everyRegionWeaves: 'እያንዳንዱ የኢትዮጵያ ክልል ታሪኩን በሸማው ላይ ይሸምናል። ከታሪካዊዎቹ የጎንደር ግንቦች እስከ የጥንቶቹ የአክሱም ሀውልቶች፣ የክልል ማንነትን የሚያከብሩ ልብሶችን ያግኙ።',
    justArrivedFromLooms: 'አሁን ከሸማኔዎች የደረሱ',
"""
c = c.replace("connectingGateway: 'ወደ ክፍያ ሥርዓቱ በማገናኘት ላይ...',\n  },", "connectingGateway: 'ወደ ክፍያ ሥርዓቱ በማገናኘት ላይ...'," + am_insertion + "  },")

om_insertion = """
    expressText: 'Daddaffiin (Express)',
    shemmaText: 'Shemmaa',
    telebirrText: 'Telebirr',
    amharaHeritage: 'Aadaa Amaaraa',
    gondarLalibela: 'Gondar fi Lalibela',
    amharaDesc: 'Shemmaa jirbii adii qulqulluu xillee faaya fannoo warqee fi sarara ji'oomeetirii mootummaa qabuun beekama.',
    tigrayHeritage: 'Aadaa Tigraay',
    axumRaya: 'Axum fi Raya',
    tigrayDesc: 'Dha\'aa Rayaa ifaa ta\'een, uffata Axumite Zuria xaxamaa fi faaya meetii fi warqee bareedaatiin beekama.',
    oromoHeritage: 'Aadaa Oromoo',
    woyyaAbbaGadaa: 'Woyyaa fi Abbaa Gadaa',
    oromoDesc: 'Woyyaa bifa diimaa, gurraachaa fi adii ifaa qabu kan tokkummaa fi sirna Gadaa bakka bu\'u.',
    harariGurage: 'Harari fi Gurage',
    geGaraEnset: 'Ge-Gara fi Xaxaa Qoochoo',
    harariDesc: 'Uffata jirbii fi harii (silk) bifa halluu garagaraa qabu kan cidha fi ayyaana irratti uffatamu.',
    everyRegionWeaves: 'Tokkoon tokkoon naannoo Itoophiyaa seenaa isaa huccuu shemmaa irratti dhaha. Gamoowwan seenaa qabeessa Gondar irraa kaasee hanga siidaa durii Axum-tti, uffata aadaa naannoo ibsan argadhaa.',
    justArrivedFromLooms: 'Amma Kan Dhaheessarraa Dhufe',
"""
c = c.replace("connectingGateway: 'Gara Kaffaltiitti Walqabsiisaa jira...',\n  }\n};", "connectingGateway: 'Gara Kaffaltiitti Walqabsiisaa jira...'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)

