import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

types_insertion = """
  // Checkout Extra Policies
  chapaCancelRule: string;
  codCancelRule: string;
"""
c = c.replace('browseCatalog: string;\n}', 'browseCatalog: string;\n' + types_insertion + '}')

en_insertion = """
    chapaCancelRule: 'Orders can be cancelled from your Dashboard before they are marked as "Preparing" or "Shipped".',
    codCancelRule: 'You may cancel your order at any time from your Dashboard before the driver is dispatched.',
"""
c = c.replace("browseCatalog: 'Browse Catalog',\n  },", "browseCatalog: 'Browse Catalog'," + en_insertion + "  },")

am_insertion = """
    chapaCancelRule: 'ትዕዛዞች ወደ "እየተዘጋጀ" ወይም "ተልኳል" ከመቀየራቸው በፊት ከመለያዎ (Dashboard) ላይ መሰረዝ ይችላሉ።',
    codCancelRule: 'አሽከርካሪው ከመላኩ በፊት በማንኛውም ጊዜ ትዕዛዝዎን ከመለያዎ ላይ መሰረዝ ይችላሉ።',
"""
c = c.replace("browseCatalog: 'አልባሳትን ያስሱ',\n  },", "browseCatalog: 'አልባሳትን ያስሱ'," + am_insertion + "  },")

om_insertion = """
    chapaCancelRule: 'Ajaji keessan gara "Qophaa\\'aa" ykn "Ergameera" tti osoo hin jijjiiramin dura daashboordii keessan irraa haquun ni danda\\'ama.',
    codCancelRule: 'Konkolaachisaan osoo hin ergamin dura yeroo kamiyyuu ajaja keessan daashboordii keessan irraa haquun ni danda\\'ama.',
"""
c = c.replace("browseCatalog: 'Uffata Ilaali',\n  }\n};", "browseCatalog: 'Uffata Ilaali'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)

print("translations.ts updated successfully with the extra policy keys")
