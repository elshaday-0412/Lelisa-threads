import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

types_insertion = """
  // Checkout Payments
  cashOnDelivery: string;
  payCashOrTelebirr: string;
  chapaSecureCheckout: string;
  chapaMethodsList: string;
  placeOrderCOD: string;
  payWithChapa: string;
  connectingGateway: string;
"""
c = c.replace('codCancelRule: string;\n}', 'codCancelRule: string;\n' + types_insertion + '}')

en_insertion = """
    cashOnDelivery: 'Cash on Delivery',
    payCashOrTelebirr: 'Pay Cash or Telebirr upon doorstep delivery (Addis Ababa)',
    chapaSecureCheckout: 'Chapa Secure Checkout',
    chapaMethodsList: 'Telebirr • CBE Birr • Awash Birr • Visa / Mastercard',
    placeOrderCOD: 'Place Order (Cash on Delivery)',
    payWithChapa: 'Pay with Chapa Secure Checkout',
    connectingGateway: 'Connecting to Gateway...',
"""
c = c.replace("codCancelRule: 'You may cancel your order at any time from your Dashboard before the driver is dispatched.',\n  },", "codCancelRule: 'You may cancel your order at any time from your Dashboard before the driver is dispatched.'," + en_insertion + "  },")

am_insertion = """
    cashOnDelivery: 'በእጅ ክፍያ (ካሽ)',
    payCashOrTelebirr: 'በበርዎ ላይ ሲረከቡ በጥሬ ገንዘብ ወይም በቴሌብር ይክፈሉ (ለአዲስ አበባ)',
    chapaSecureCheckout: 'በቻፓ የተጠበቀ ክፍያ',
    chapaMethodsList: 'ቴሌብር • ሲቢኢ ብር • አዋሽ ብር • ቪዛ / ማስተርካርድ',
    placeOrderCOD: 'ትዕዛዝዎን ያስገቡ (በእጅ ክፍያ)',
    payWithChapa: 'በቻፓ ክፍያዎን ይፈጽሙ',
    connectingGateway: 'ወደ ክፍያ ሥርዓቱ በማገናኘት ላይ...',
"""
c = c.replace("codCancelRule: 'አሽከርካሪው ከመላኩ በፊት በማንኛውም ጊዜ ትዕዛዝዎን ከመለያዎ ላይ መሰረዝ ይችላሉ።',\n  },", "codCancelRule: 'አሽከርካሪው ከመላኩ በፊት በማንኛውም ጊዜ ትዕዛዝዎን ከመለያዎ ላይ መሰረዝ ይችላሉ።'," + am_insertion + "  },")

om_insertion = """
    cashOnDelivery: 'Kaffaltii Harkaa',
    payCashOrTelebirr: 'Yeroo balbala irratti geessamu maallaqa callaadhaan ykn Telebirr kaffalaa (Finfinnee)',
    chapaSecureCheckout: 'Kaffaltii Eeggamaa Chapa',
    chapaMethodsList: 'Telebirr • CBE Birr • Awash Birr • Visa / Mastercard',
    placeOrderCOD: 'Ajaji (Kaffaltii Harkaa)',
    payWithChapa: 'Kaffaltii Eeggamaa Chapa',
    connectingGateway: 'Gara Kaffaltiitti Walqabsiisaa jira...',
"""
c = c.replace("codCancelRule: 'Konkolaachisaan osoo hin ergamin dura yeroo kamiyyuu ajaja keessan daashboordii keessan irraa haquun ni danda\\'ama.',\n  }\n};", "codCancelRule: 'Konkolaachisaan osoo hin ergamin dura yeroo kamiyyuu ajaja keessan daashboordii keessan irraa haquun ni danda\\'ama.'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)
