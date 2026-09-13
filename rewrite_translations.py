import re

content = """export type Language = 'EN' | 'AM' | 'OM';

export interface Translations {
  // Brand & Header
  brandName: string;
  home: string;
  shop: string;
  categories: string;
  heritage: string;
  adminPortal: string;
  signIn: string;
  signOut: string;
  myAccount: string;
  searchPlaceholder: string;
  cart: string;
  wishlist: string;
  language: string;
  
  // Nav new
  newArrivals: string;
  categoriesGallery: string;
  popularCategories: string;
  myOrders: string;
  currencyPrefix: string;
  langPrefix: string;
  searchMobile: string;
  navigation: string;
  
  // Home & Hero
  heroTitle: string;
  heroSubtitle: string;
  shopNow: string;
  exploreHeritage: string;
  featuredCollections: string;
  artisanCrafted: string;
  authenticShemma: string;
  expressDelivery: string;
  securePayments: string;
  
  // Product Cards & Badges
  allProducts: string;
  addToCart: string;
  inStock: string;
  outOfStock: string;
  onlyLeft: string;
  featured: string;
  newBadge: string;
  quickView: string;
  quickAdd: string;
  filterBy: string;
  category: string;
  price: string;
  color: string;
  size: string;
  pieces: string;
  exploreCollection: string;

  // Shop & Filters
  marketplaceTitle: string;
  heritageCollectionsHeader: string;
  showingItems: string;
  filters: string;
  resetAll: string;
  sortBy: string;
  sortFeatured: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortRating: string;
  sortNewest: string;
  regionalHeritage: string;
  audienceGender: string;
  noGarmentsFound: string;
  noGarmentsSubtitle: string;
  clearFilters: string;

  // Cart Drawer
  yourShoppingBag: string;
  bagEmptyTitle: string;
  bagEmptySubtitle: string;
  freeShippingQualify: string;
  freeShippingPromo: string;
  freeShippingAddMore: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  proceedCheckout: string;
  clearBag: string;
  encryptedPayment: string;
  
  // Checkout & Payment
  checkout: string;
  shippingDetails: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  city: string;
  region: string;
  paymentMethod: string;
  telebirr: string;
  cbeBirr: string;
  orderSummary: string;
  placeOrder: string;
  payWithPhone: string;
  enterOtp: string;
  
  // Dashboard & Footer
  orderHistory: string;
  profileSettings: string;
  viewDetails: string;
  copyright: string;
  privacy: string;
  vipClub: string;
  subscribe: string;
  
  // Footer New
  footerExpressDesc: string;
  footerArtisanDesc: string;
  bespokeFitting: string;
  bespokeFittingDesc: string;
  footerDesc: string;
  collectionsHeader: string;
  catHabeshaKemis: string;
  catTShirts: string;
  catSweaters: string;
  catChildrens: string;
  catScarves: string;
  catBags: string;
  catMens: string;
  catWedding: string;
  catJewelry: string;
  culturalHeritageHeader: string;
  gondarLalibela: string;
  tigrayAxum: string;
  oromoWoyya: string;
  harariSilk: string;
  gurageEnset: string;
  vipHeritageCircle: string;
  vipDesc: string;
  emailPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    brandName: 'Wanofi Design',
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    heritage: 'Heritage',
    adminPortal: 'Admin Portal',
    signIn: 'Sign In / Register',
    signOut: 'Sign Out',
    myAccount: 'My Account',
    searchPlaceholder: 'Search Habesha Kemis, Tilet...',
    cart: 'Bag',
    wishlist: 'Wishlist',
    language: 'Language',
    
    newArrivals: 'New Arrivals',
    categoriesGallery: 'Categories Gallery',
    popularCategories: 'Popular Categories',
    myOrders: 'My Orders',
    currencyPrefix: 'Currency: ',
    langPrefix: 'Lang: ',
    searchMobile: 'Search Habesha Kemis, Tilet...',
    navigation: 'Navigation',

    heroTitle: 'Exquisite Handwoven Ethiopian Couture',
    heroSubtitle: 'Modern elegance meets ancient tradition. Authentic Shemma and Tilet garments meticulously crafted by master artisans in Addis Ababa.',
    shopNow: 'Shop the Latest Drops',
    exploreHeritage: 'Explore the Craft',
    featuredCollections: 'Featured Heritage Collections',
    artisanCrafted: '100% Artisan Handwoven',
    authenticShemma: 'Authentic Cotton Shemma',
    expressDelivery: 'Global Express Delivery',
    securePayments: 'Secure Telebirr & Bank Payments',
    
    allProducts: 'All Garments',
    addToCart: 'Add to Bag',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    onlyLeft: 'Only Left',
    featured: 'Featured',
    newBadge: 'New',
    quickView: 'Quick View',
    quickAdd: 'Quick Add',
    filterBy: 'Filter By',
    category: 'Category',
    price: 'Price',
    color: 'Color',
    size: 'Size',
    pieces: 'Pieces',
    exploreCollection: 'Explore Collection',

    marketplaceTitle: 'Shemma & Tilet Marketplace',
    heritageCollectionsHeader: 'Heritage Collections',
    showingItems: 'Authentic handwoven garments and cultural jewelry from Ethiopia.',
    filters: 'Filters',
    resetAll: 'Reset All',
    sortBy: 'Sort By',
    sortFeatured: 'Featured',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortRating: 'Highest Rated',
    sortNewest: 'Newest Arrivals',
    regionalHeritage: 'Regional Heritage',
    audienceGender: 'Audience / Gender',
    noGarmentsFound: 'No Garments Found',
    noGarmentsSubtitle: 'We couldn\\'t find any items matching your current filters. Please try adjusting them.',
    clearFilters: 'Clear Filters',

    yourShoppingBag: 'Your Shopping Bag',
    bagEmptyTitle: 'Your bag is empty',
    bagEmptySubtitle: 'Explore our collection of beautiful Habesha Kemis, Menswear, and traditional jewelry.',
    freeShippingQualify: 'You qualify for Free Express Shipping!',
    freeShippingPromo: 'Free Shipping on all orders over 10,000 ETB!',
    freeShippingAddMore: 'Add more to your bag to qualify for Free Shipping.',
    subtotal: 'Subtotal',
    shippingFee: 'Shipping',
    total: 'Total',
    proceedCheckout: 'Proceed to Checkout',
    clearBag: 'Clear Bag',
    encryptedPayment: 'Encrypted Secure Payment',
    
    checkout: 'Checkout',
    shippingDetails: 'Shipping & Contact Details',
    fullName: 'Full Name',
    email: 'Email Address',
    phoneNumber: 'Phone Number (Account Registered)',
    shippingAddress: 'Street / House Address',
    city: 'City',
    region: 'Region / Zone',
    paymentMethod: 'Select Payment Method',
    telebirr: 'Telebirr',
    cbeBirr: 'CBE Birr',
    orderSummary: 'Order Summary',
    placeOrder: 'Confirm Order',
    payWithPhone: 'Payment Mobile Number',
    enterOtp: 'SMS Verification PIN (OTP)',
    
    orderHistory: 'Order History',
    profileSettings: 'Profile Settings',
    viewDetails: 'View Details',
    copyright: '© 2026 Wanofi Design. All rights reserved.',
    privacy: 'Privacy Policy',
    vipClub: 'Join the Heritage Club',
    subscribe: 'Subscribe',
    
    footerExpressDesc: 'Addis Ababa, Europe, & North America',
    footerArtisanDesc: 'Handwoven by master artisans in Ethiopia',
    bespokeFitting: 'Bespoke Custom Fitting',
    bespokeFittingDesc: 'Tailored measurements for weddings & Mels',
    footerDesc: 'Preserving the sacred weaving heritage of Shemma and Tilet. Crafted for celebrations, weddings, and modern elegance.',
    collectionsHeader: 'Collections',
    catHabeshaKemis: 'Habesha Kemis',
    catTShirts: 'T-Shirts & Shirts',
    catSweaters: 'Sweaters (Shurabii)',
    catChildrens: 'Children\\'s Wear',
    catScarves: 'Netela & Gabi Wraps',
    catBags: 'Traditional Bags',
    catMens: 'Men\\'s Traditional Wear',
    catWedding: 'Wedding & Mels Couture',
    catJewelry: 'Axumite Filigree Jewelry',
    culturalHeritageHeader: 'Cultural Heritage',
    gondarLalibela: 'Gondar & Lalibela Tilet',
    tigrayAxum: 'Tigray Raya & Axum Zuria',
    oromoWoyya: 'Oromo Woyya & Abba Gadaa',
    harariSilk: 'Harari Ge-Gara Silk',
    gurageEnset: 'Gurage Enset Kemis',
    vipHeritageCircle: 'VIP Heritage Circle',
    vipDesc: 'Receive private notifications for seasonal weaves and bespoke bridal releases.',
    emailPlaceholder: 'Your email address',
  },
  AM: {
    brandName: 'ዋኖፊ ዲዛይን',
    home: 'መነሻ',
    shop: 'ገበያ',
    categories: 'የአልባሳት አይነቶች',
    heritage: 'ባህላዊ ቅርስ',
    adminPortal: 'የአስተዳዳሪ ማዕከል',
    signIn: 'ግባ / ተመዝገብ',
    signOut: 'ውጣ',
    myAccount: 'የኔ መለያ',
    searchPlaceholder: 'የሀበሻ ቀሚስ፣ የጥበብ ልብስ ይፈልጉ...',
    cart: 'የግዢ ቦርሳ',
    wishlist: 'የምኞት ዝርዝር',
    language: 'ቋንቋ',
    
    newArrivals: 'አዲስ የገቡ',
    categoriesGallery: 'የአልባሳት ማዕከለ-ስዕላት',
    popularCategories: 'ታዋቂ ክፍሎች',
    myOrders: 'የኔ ትዕዛዞች',
    currencyPrefix: 'ገንዘብ፡ ',
    langPrefix: 'ቋንቋ፡ ',
    searchMobile: 'የሀበሻ ቀሚስ፣ የጥበብ ልብስ ይፈልጉ...',
    navigation: 'ማውጫ',

    heroTitle: 'በእጅ የተሸመኑ ውብ የኢትዮጵያ ባህላዊ አልባሳት',
    heroSubtitle: 'በአዲስ አበባ ባለሙያ ሽማኔዎች የተዘጋጁ ጥራት ያላቸው የሸማ፣ የጥበብ እና የዘመናዊ ሀበሻ አልባሳት ስብስብ።',
    shopNow: 'አዲሱን ስብስብ ይመልከቱ',
    exploreHeritage: 'ስነ-ጥበቡን ይወቁ',
    featuredCollections: 'ተመርጠው የቀረቡ የባህል ስብስቦች',
    artisanCrafted: '100% በእጅ የተሸመነ',
    authenticShemma: 'ንጹህ የሸማ ጥጥ',
    expressDelivery: 'ፈጣን ሀገር ውስጥ እና ውጭ ማድረስ',
    securePayments: 'በቴሌብር እና በባንክ አስተማማኝ ክፍያ',
    
    allProducts: 'ሁሉም አልባሳት',
    addToCart: 'ወደ ቦርሳ ጨምር',
    inStock: 'በክምችት ላይ አለ',
    outOfStock: 'አልቋል',
    onlyLeft: 'በክምችት የቀረ',
    featured: 'የተመረጠ',
    newBadge: 'አዲስ',
    quickView: 'በፍጥነት ተመልከት',
    quickAdd: 'ወዲያውኑ ጨምር',
    filterBy: 'አጣራ',
    category: 'መደብ',
    price: 'ዋጋ',
    color: 'ቀለም',
    size: 'መጠን',
    pieces: 'አልባሳት',
    exploreCollection: 'ስብስቡን ይመልከቱ',

    marketplaceTitle: 'የሸማና የጥበብ ገበያ',
    heritageCollectionsHeader: 'የሀበሻ ባህላዊ አልባሳት ስብስብ',
    showingItems: 'በእጅ የተሸመኑ ጥራት ያላቸው የኢትዮጵያ ባህላዊ አልባሳትና ጌጣጌጦች።',
    filters: 'ማጣሪያዎች',
    resetAll: 'ሁሉንም አፅዳ',
    sortBy: 'አደራጅ በ',
    sortFeatured: 'ተመራጭ',
    sortPriceLow: 'ዋጋ፡ ከዝቅተኛ ወደ ከፍተኛ',
    sortPriceHigh: 'ዋጋ፡ ከከፍተኛ ወደ ዝቅተኛ',
    sortRating: 'ከፍተኛ ደረጃ የተሰጣቸው',
    sortNewest: 'አዲስ የገቡ',
    regionalHeritage: 'የክልል ባህላዊ ቅርስ',
    audienceGender: 'የደንበኛ ዓይነት / ጾታ',
    noGarmentsFound: 'ምንም አልባሳት አልተገኙም',
    noGarmentsSubtitle: 'ከመረጡት ማጣሪያ ጋር የሚስማማ እቃ አልተገኘም። እባክዎን ማጣሪያዎቹን አስተካክለው እንደገና ይሞክሩ።',
    clearFilters: 'ማጣሪያዎችን አፅዳ',

    yourShoppingBag: 'የእርስዎ የግዢ ቦርሳ',
    bagEmptyTitle: 'ቦርሳዎ ባዶ ነው',
    bagEmptySubtitle: 'የሀበሻ ቀሚሶችን፣ የወንዶች አልባሳትንና ባህላዊ ጌጣጌጦችን ይመልከቱ።',
    freeShippingQualify: 'ነፃ የፈጣን ማድረስ አገልግሎት አግኝተዋል!',
    freeShippingPromo: 'ከ10,000 ብር በላይ ለሆኑ ትዕዛዞች በነፃ እናደርሳለን!',
    freeShippingAddMore: 'ለነፃ ማድረስ ተጨማሪ እቃ ይጨምሩ።',
    subtotal: 'የእቃዎች ዋጋ',
    shippingFee: 'ማድረሻ',
    total: 'ጠቅላላ ክፍያ',
    proceedCheckout: 'ወደ ክፍያ ይለፉ',
    clearBag: 'ቦርሳውን አፅዳ',
    encryptedPayment: 'በአስተማማኝ ሁኔታ የተጠበቀ ክፍያ',
    
    checkout: 'ክፍያ ፈፅም',
    shippingDetails: 'የማድረሻ እና የደንበኛ መረጃ',
    fullName: 'ሙሉ ስም',
    email: 'ኢሜይል አድራሻ',
    phoneNumber: 'የስልክ ቁጥር (በመለያ የተመዘገበ)',
    shippingAddress: 'የመንገድ/የቤት አድራሻ',
    city: 'ከተማ',
    region: 'ክልል / ዞን',
    paymentMethod: 'የክፍያ ዘዴ ይምረጡ',
    telebirr: 'ቴሌብር (Telebirr)',
    cbeBirr: 'ሲቢኢ ብር (CBE Birr)',
    orderSummary: 'የትዕዛዝ ማጠቃለያ',
    placeOrder: 'ትዕዛዙን አረጋግጥ',
    payWithPhone: 'የሞባይል ባንክ ስልክ ቁጥር',
    enterOtp: 'የኤስኤምኤስ ማረጋገጫ ፒን (OTP)',
    
    orderHistory: 'የትዕዛዝ ታሪክ',
    profileSettings: 'የመለያ ቅንብሮች',
    viewDetails: 'ዝርዝሩን ተመልከት',
    copyright: '© 2026 ዋኖፊ ዲዛይን (Wanofi Design)። መብቱ በህግ የተጠበቀ ነው።',
    privacy: 'የግላዊነት ፖሊሲ',
    vipClub: 'የባህል ወዳጆች ክበብን ይቀላቀሉ',
    subscribe: 'ተመዝገብ',

    footerExpressDesc: 'አዲስ አበባ፣ አውሮፓ እና ሰሜን አሜሪካ ማድረስ',
    footerArtisanDesc: 'በኢትዮጵያ ባለሙያዎች የተሸመነ',
    bespokeFitting: 'በልክ የተሰሩ አልባሳት',
    bespokeFittingDesc: 'ለሠርግ እና ለመልስ በልክ የሚሰፋ',
    footerDesc: 'የሸማና የጥበብ ባህላዊ ቅርስን ጠብቆ ማቆየት። ለክብረ በዓላት፣ ለሰርጎች እና ለዘመናዊ ውበት የተሰራ።',
    collectionsHeader: 'ክምችቶች',
    catHabeshaKemis: 'የሀበሻ ቀሚስ',
    catTShirts: 'ቲ-ሸርት እና ሸሚዝ',
    catSweaters: 'ሹራብ',
    catChildrens: 'የልጆች አልባሳት',
    catScarves: 'ነጠላ እና ጋቢ',
    catBags: 'ባህላዊ ቦርሳዎች',
    catMens: 'የወንዶች ባህላዊ ልብስ',
    catWedding: 'የሠርግ እና የመልስ አልባሳት',
    catJewelry: 'የአክሱም ጌጣጌጦች',
    culturalHeritageHeader: 'ባህላዊ ቅርስ',
    gondarLalibela: 'የጎንደር እና የላሊበላ ጥበብ',
    tigrayAxum: 'የትግራይ እና የአክሱም ዙሪያ',
    oromoWoyya: 'የኦሮሞ ወያ እና የአባ ገዳ',
    harariSilk: 'የሐረር ሐር',
    gurageEnset: 'የጉራጌ እንሰት ቀሚስ',
    vipHeritageCircle: 'የቪአይፒ የቅርስ ክበብ',
    vipDesc: 'ወቅታዊ የአልባሳት እና የሰርግ ልብሶች መረጃን በግልዎ ያግኙ።',
    emailPlaceholder: 'የኢሜይል አድራሻዎ',
  },
  OM: {
    brandName: 'Wanofi Design',
    home: 'Fuula Duraa',
    shop: 'Gurgurtaa',
    categories: 'Gosa Uffataa',
    heritage: 'Aadaa fi Seenaa',
    adminPortal: 'Aangoo Bulchiinsaa',
    signIn: 'Seeni / Galmeeffadhu',
    signOut: 'Ba\\'i',
    myAccount: 'Akkaawuntii Koo',
    searchPlaceholder: 'Uffata aadaa barbaadi...',
    cart: 'Mooqa Bittaadhaa',
    wishlist: 'Uffata Hawwame',
    language: 'Afaan',
    
    newArrivals: 'Uffata Haaraa',
    categoriesGallery: 'Gosa Uffataa',
    popularCategories: 'Gosoota Jaallataman',
    myOrders: 'Ajaja Koo',
    currencyPrefix: 'Maallaqa: ',
    langPrefix: 'Afaan: ',
    searchMobile: 'Uffata aadaa barbaadi...',
    navigation: 'Garaa Gara',

    heroTitle: 'Uffata Aadaa Itoophiyaa Bareeda Harkaadhaan Dahuu',
    heroSubtitle: 'Shemmaa fi xillee midhaagina aadaa harka ogessoota Finfinneetni dahuun qophaa\\'e ammayyaa dhiyeessina.',
    shopNow: 'Gurgurtaa Ammaa Ilaali',
    exploreHeritage: 'Aadaa Barsiifadhu',
    featuredCollections: 'Uffata Aadaa Filatamaa',
    artisanCrafted: '100% Harkaadhaan Kan Dhahame',
    authenticShemma: 'Jirbiixii Shemmaa Dhugaa',
    expressDelivery: 'Ergaa Ariifachiisaa',
    securePayments: 'Kaffaltii Eeggamaa',
    
    allProducts: 'Uffata Hundumaa',
    addToCart: 'Gara Gaariitti Dabali',
    inStock: 'Mana Kuusaatti Jira',
    outOfStock: 'Mana Kuusaa Hoomaa',
    onlyLeft: 'Mana Kuusaatti Hafee',
    featured: 'Filatamaa',
    newBadge: 'Haaraa',
    quickView: 'Ariitiidhaan Ilaali',
    quickAdd: 'Dabali',
    filterBy: 'Calali',
    category: 'Gosa',
    price: 'Gatiidhaan',
    color: 'Halluu',
    size: 'Hammangaa',
    pieces: 'Gosa',
    exploreCollection: 'Uffata Ilaali',

    marketplaceTitle: 'Gabaa Shemmaa fi Xillee',
    heritageCollectionsHeader: 'Uffata Aadaa Filatamaa',
    showingItems: 'Uffata aadaa Itoophiyaa harkaadhaan dhahamee fi faaya aadaa.',
    filters: 'Calaltuu',
    resetAll: 'Hunda Haqi',
    sortBy: 'Tarreessi',
    sortFeatured: 'Filatamaa',
    sortPriceLow: 'Gatii: Xiqqaa gara Guddaatti',
    sortPriceHigh: 'Gatii: Guddaa gara Xiqqaatti',
    sortRating: 'Sadarkaa Ol\\'aanaa',
    sortNewest: 'Uffata Haaraa',
    regionalHeritage: 'Aadaa Naannoo',
    audienceGender: 'Kornyaa',
    noGarmentsFound: 'Uffatni Barbaadame Hin Argamne',
    noGarmentsSubtitle: 'Calaltuu keessaniin uffatni argamuu danda\\'u hin jiru. Irra deebidhaan yaala.',
    clearFilters: 'Calaltuu Haqi',

    yourShoppingBag: 'Mooqa Bittaadhaa',
    bagEmptyTitle: 'Mooqan keessan duudaadha',
    bagEmptySubtitle: 'Uffata aadaa, uffata dhiiraa fi faaya aadaa keessaa filadhaa.',
    freeShippingQualify: 'Geejjiba Basaasaa Bilisaa Argattaniirtu!',
    freeShippingPromo: 'Ajaja qarshii 10,000 ol ta\\'eef geejjibni bilisa!',
    freeShippingAddMore: 'Geejjiba bilisaatiif uffata dabalataa gurguraa.',
    subtotal: 'Gatii Ijaaraa',
    shippingFee: 'Geejjiba',
    total: 'Waliigala',
    proceedCheckout: 'Gara Kaffaltiitti Darbi',
    clearBag: 'Mooqa Haqi',
    encryptedPayment: 'Kaffaltii Eeggumsa Qabu',
    
    checkout: 'Kaffaltii Xumuri',
    shippingDetails: 'Teessoo Ergaa fi Odeeffannoo',
    fullName: 'Maqaa Guutuu',
    email: 'Teessoo E-mail',
    phoneNumber: 'Lakkoofsa Bilbilaa',
    shippingAddress: 'Teessoo Daandii / Manaa',
    city: 'Magaalaa',
    region: 'Naannoo',
    paymentMethod: 'Mala Kaffaltii Filadhu',
    telebirr: 'Telebirr',
    cbeBirr: 'CBE Birr',
    orderSummary: 'Cuunfaa Ajajaa',
    placeOrder: 'Ajaja Mirkaneessi',
    payWithPhone: 'Lakkoofsa Bilbila Kaffaltii',
    enterOtp: 'Lakkoofsa Mirkaneessaa SMS (OTP)',
    
    orderHistory: 'Seenaa Ajajaa',
    profileSettings: 'Sajoo Akkaawuntii',
    viewDetails: 'Bal\\'inaan Ilaali',
    copyright: '© 2026 Wanofi Design. Mirgi Hunduu Kan Eegame.',
    privacy: 'Imaammata Mateenyaa',
    vipClub: 'Miseensa Maatii Aadaa Ta\\'i',
    subscribe: 'Galmeeffadhu',

    footerExpressDesc: 'Finfinnee, Awurooppaa fi Ameerikaa Kaabaa',
    footerArtisanDesc: 'Itoophiyaatti ogeessotaan kan dhahame',
    bespokeFitting: 'Safarri Sirrii Uffataa',
    bespokeFittingDesc: 'Cidhaafii fi sagantaaleef kan hodhamu',
    footerDesc: 'Aadaa dhahaa eeguu. Sirna cidhaa, kabajaa fi bareedina ammayyaaf kan hojjetame.',
    collectionsHeader: 'Sassabbii',
    catHabeshaKemis: 'Uffata Aadaa Dubartootaa',
    catTShirts: 'Ti-shertii fi Shamiizii',
    catSweaters: 'Shuraabii',
    catChildrens: 'Uffata Ijoollee',
    catScarves: 'Naxalaa fi Gaabii',
    catBags: 'Borsaa Aadaa',
    catMens: 'Uffata Aadaa Dhiiraa',
    catWedding: 'Uffata Cidhaa',
    catJewelry: 'Faaya Aadaa',
    culturalHeritageHeader: 'Aadaa fi Seenaa',
    gondarLalibela: 'Aadaa Gondar fi Lalibela',
    tigrayAxum: 'Aadaa Tigraay fi Aksum',
    oromoWoyya: 'Woyyaa Oromoo fi Abbaa Gadaa',
    harariSilk: 'Uffata Hararii',
    gurageEnset: 'Uffata Aadaa Guraagee',
    vipHeritageCircle: 'Maatii Aadaa VIP',
    vipDesc: 'Odeeffannoo uffata haaraa fi cidhaa dhuunfaatti argadhaa.',
    emailPlaceholder: 'Teessoo iimeeylii keessan',
  }
};
"""

with open("src/translations/translations.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("translations.ts updated successfully")
