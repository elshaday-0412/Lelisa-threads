import re

with open("src/translations/translations.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add types
types_insertion = """
  // Checkout new
  checkoutEmptyTitle: string;
  orderReference: string;
  paymentGateway: string;
  transactionReference: string;
  authCode: string;
  cardBilled: string;
  walletNumber: string;
  totalPaid: string;
  receiptIssued: string;
  chapaDigitalMethod: string;
  chapaDesc: string;
  codMethod: string;
  codDesc: string;
  cancellationPolicy: string;
  cancellationPolicyCod: string;
  chapaRefundPolicy: string;
  codCancelFee: string;
"""

c = c.replace('exploreRegion: string;\n}', 'exploreRegion: string;\n' + types_insertion + '}')

en_insertion = """
    checkoutEmptyTitle: 'Your Bag is Empty',
    orderReference: 'Order Reference',
    paymentGateway: 'Payment Gateway',
    transactionReference: 'Transaction Reference',
    authCode: 'Authorization Code',
    cardBilled: 'Card Billed',
    walletNumber: 'Mobile Wallet Number',
    totalPaid: 'Total Paid',
    receiptIssued: 'Receipt issued:',
    chapaDigitalMethod: 'Chapa Secure Digital Payment',
    chapaDesc: 'You will be securely redirected to Chapa to complete your payment via Telebirr, CBE Birr, Awash Birr, or Visa/Mastercard.',
    codMethod: 'Addis Ababa Doorstep Delivery',
    codDesc: 'You will pay via Cash or direct CBE Mobile transfer upon receiving your garment. Please ensure someone is present at the delivery address.',
    cancellationPolicy: 'Cancellation & Refund Policy:',
    cancellationPolicyCod: 'Cancellation Policy:',
    chapaRefundPolicy: 'Cancelled digital payments are automatically refunded to your original payment method (Telebirr/Card) within 3-5 business days.',
    codCancelFee: 'If you wish to cancel at the door, a small 150 ETB delivery fee may apply to compensate our drivers.',
"""

c = c.replace("exploreRegion: 'Explore Region',\n  },", "exploreRegion: 'Explore Region'," + en_insertion + "  },")

am_insertion = """
    checkoutEmptyTitle: 'የግዢ ቦርሳዎ ባዶ ነው',
    orderReference: 'የትዕዛዝ ማጣቀሻ',
    paymentGateway: 'የክፍያ መተላለፊያ',
    transactionReference: 'የክፍያ ማጣቀሻ',
    authCode: 'የማረጋገጫ ኮድ',
    cardBilled: 'የተከፈለበት ካርድ',
    walletNumber: 'የሞባይል ዋሌት ቁጥር',
    totalPaid: 'ጠቅላላ የተከፈለ',
    receiptIssued: 'ደረሰኝ የተሰጠበት፡',
    chapaDigitalMethod: 'በቻፓ የተጠበቀ ዲጂታል ክፍያ',
    chapaDesc: 'ክፍያዎን በቴሌብር፣ በሲቢኢ ብር፣ በአዋሽ ብር ወይም በቪዛ/ማስተርካርድ ለመጨረስ በአስተማማኝ ሁኔታ ወደ ቻፓ ይመራሉ።',
    codMethod: 'አዲስ አበባ በር ላይ ማድረስ',
    codDesc: 'ዕቃዎን ሲረከቡ በጥሬ ገንዘብ ወይም በቀጥታ በሲቢኢ ሞባይል ያስተላልፋሉ። እባክዎን አድራሻው ላይ ሰው መኖሩን ያረጋግጡ።',
    cancellationPolicy: 'ስረዛ እና ተመላሽ ገንዘብ ፖሊሲ፡',
    cancellationPolicyCod: 'የስረዛ ፖሊሲ፡',
    chapaRefundPolicy: 'የተሰረዙ ዲጂታል ክፍያዎች ከ3-5 የስራ ቀናት ውስጥ ወደ መጀመሪያው የክፍያ መንገድዎ (ቴሌብር/ካርድ) ይመለሳሉ።',
    codCancelFee: 'በሩ ላይ ለማሰረዝ ከፈለጉ፣ ለአሽከርካሪዎቻችን ማካካሻ አነስተኛ የ150 ብር የማድረሻ ክፍያ ሊጠየቁ ይችላሉ።',
"""

c = c.replace("exploreRegion: 'ስለ ክልሉ ይወቁ',\n  },", "exploreRegion: 'ስለ ክልሉ ይወቁ'," + am_insertion + "  },")

om_insertion = """
    checkoutEmptyTitle: 'Mooqan keessan duudaadha',
    orderReference: 'Ragaa Ajajaa',
    paymentGateway: 'Kaffaltii Daandii',
    transactionReference: 'Ragaa Kaffaltii',
    authCode: 'Koodii Mirkaneessaa',
    cardBilled: 'Kaardii Kaffalame',
    walletNumber: 'Lakkoofsa Moobaayil Waaleetii',
    totalPaid: 'Waliigala Kaffalame',
    receiptIssued: 'Nagaheen kan kenname:',
    chapaDigitalMethod: 'Kaffaltii Dijitaalaa Eeggamaa Chapa',
    chapaDesc: 'Kaffaltii keessan Telebirr, CBE Birr, Awash Birr, ykn Visa/Mastercard dhaan xumuruuf karaa eeggumsa qabuun gara Chapa-tti ni qajeelfamtu.',
    codMethod: 'Finfinnee Balbala irratti Geessuu',
    codDesc: 'Yeroo uffata keessan fudhattan qarshiidhaan ykn kallattiidhaan CBE Moobaayiliidhaan kaffaltu. Maaloo teessoo irratti namni jiraachuu isaa mirkaneessaa.',
    cancellationPolicy: 'Imaammata Haqaa fi Deebii Maallaqaa:',
    cancellationPolicyCod: 'Imaammata Haqaa:',
    chapaRefundPolicy: 'Kaffaltiileen dijitaalaa haqaman guyyoota hojii 3-5 keessatti ofumaan gara mala kaffaltii jalqabaatti (Telebirr/Kaardii) deebi\'u.',
    codCancelFee: 'Yoo balbala irratti haquu barbaaddan, kaffaltiin geejjibaa xinnoo 150 ETB konkolaachiftota keenyaaf akka beenyaatti gaafatamuu danda\'a.',
"""

c = c.replace("exploreRegion: 'Naannoo Kana Barsiifadhu',\n  }\n};", "exploreRegion: 'Naannoo Kana Barsiifadhu'," + om_insertion + "  }\n};")

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(c)

print("translations.ts updated successfully with Checkout keys")
