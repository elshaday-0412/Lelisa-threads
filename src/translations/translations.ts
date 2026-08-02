export type Language = 'EN' | 'AM' | 'OM';

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
  myOrders: string;
  orderHistory: string;
  profileSettings: string;
  viewDetails: string;
  copyright: string;
  privacy: string;
  vipClub: string;
  subscribe: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    brandName: 'Lelisa Threads',
    home: 'Home',
    shop: 'Shop Collections',
    categories: 'Categories',
    heritage: 'Cultural Heritage',
    adminPortal: 'Admin Portal',
    signIn: 'Sign In / Register',
    signOut: 'Sign Out',
    myAccount: 'My Account',
    searchPlaceholder: 'Search habesha kemis, tilet, habesha menswear...',
    cart: 'Bag',
    wishlist: 'Wishlist',
    language: 'Language',
    
    heroTitle: 'Authentic Ethiopian Elegance Handwoven for Royalty',
    heroSubtitle: 'Discover woven Shemma masterpieces, intricate custom Tilet embroidery, and contemporary Habesha attire direct from master weavers in Addis Ababa.',
    shopNow: 'Explore New Drop',
    exploreHeritage: 'Discover Artistry',
    featuredCollections: 'Featured Heritage Collections',
    artisanCrafted: '100% Artisan Handwoven',
    authenticShemma: 'Pure Shemma Cotton',
    expressDelivery: 'Express Worldwide Shipping',
    securePayments: 'Telebirr & Local Bank Support',
    
    allProducts: 'All Masterpieces',
    addToCart: 'Add to Bag',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    onlyLeft: 'Left in Stock',
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
    heritageCollectionsHeader: 'The Habesha Heritage Collections',
    showingItems: 'Showing authentic handwoven Ethiopian garments and ceremonial accessories.',
    filters: 'Filters',
    resetAll: 'Reset All',
    sortBy: 'Sort by',
    sortFeatured: 'Featured',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortRating: 'Top Customer Ratings',
    sortNewest: 'Newest Arrivals',
    regionalHeritage: 'Regional Heritage',
    audienceGender: 'Audience / Gender',
    noGarmentsFound: 'No Heritage Garments Found',
    noGarmentsSubtitle: 'We couldn\'t find any items matching your current filters. Try resetting your search query or region filter.',
    clearFilters: 'Clear All Filters',

    yourShoppingBag: 'Your Shopping Bag',
    bagEmptyTitle: 'Your bag is empty',
    bagEmptySubtitle: 'Explore our curated collection of Habesha Kemis, men\'s royal wear, and traditional jewelry.',
    freeShippingQualify: 'You qualify for Free Express Shipping!',
    freeShippingAddMore: 'Add more for Free Shipping.',
    subtotal: 'Subtotal',
    shippingFee: 'Shipping',
    total: 'Total',
    proceedCheckout: 'Proceed to Checkout',
    clearBag: 'Clear Bag',
    encryptedPayment: '256-Bit Encrypted Payment',
    
    checkout: 'Checkout & Pay',
    shippingDetails: 'Shipping & Customer Info',
    fullName: 'Full Name',
    email: 'Email Address',
    phoneNumber: 'Phone Number (Account Registered)',
    shippingAddress: 'Street Address',
    city: 'City',
    region: 'Region / State',
    paymentMethod: 'Select Payment Method',
    telebirr: 'Telebirr SuperApp',
    cbeBirr: 'CBE Birr',
    orderSummary: 'Order Summary',
    placeOrder: 'Confirm & Complete Order',
    payWithPhone: 'Mobile Wallet Phone Number',
    enterOtp: 'SMS Verification PIN / OTP',
    
    myOrders: 'My Orders',
    orderHistory: 'Order History',
    profileSettings: 'Profile Settings',
    viewDetails: 'View Details',
    copyright: '© 2026 Lelisa Threads. All Rights Reserved.',
    privacy: 'Privacy & Policy',
    vipClub: 'Join the VIP Heritage Circle',
    subscribe: 'Subscribe'
  },

  AM: {
    brandName: 'ለሊሳ ስፌት (Lelisa Threads)',
    home: 'መነሻ ገፅ',
    shop: 'የአልባሳት ስብስብ',
    categories: 'መደቦች',
    heritage: 'ባህላዊ ቅርሶቻችን',
    adminPortal: 'የአስተዳዳሪ ፖርታል',
    signIn: 'ግቡ / ተመዝገቡ',
    signOut: 'ውጣ',
    myAccount: 'የኔ መለያ',
    searchPlaceholder: 'የሀበሻ ቀሚስ፣ ጥበብ ወይም ወንድ አልባሳት ይፈልጉ...',
    cart: 'የግዢ ቦርሳ',
    wishlist: 'የምኞት ዝርዝር',
    language: 'ቋንቋ',
    
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
    
    myOrders: 'የኔ ትዕዛዞች',
    orderHistory: 'የትዕዛዝ ታሪክ',
    profileSettings: 'የመለያ ቅንብሮች',
    viewDetails: 'ዝርዝሩን ተመልከት',
    copyright: '© 2026 ለሊሳ ስፌት (Lelisa Threads)። መብቱ በህግ የተጠበቀ ነው።',
    privacy: 'የግላዊነት ፖሊሲ',
    vipClub: 'የባህል ወዳጆች ክበብን ይቀላቀሉ',
    subscribe: 'ተመዝገብ'
  },

  OM: {
    brandName: 'Lelisa Threads',
    home: 'Fuula Duraa',
    shop: 'Gurgurtaa Uffataa',
    categories: 'Gosa Uffataa',
    heritage: 'Aadaa fi Seenaa',
    adminPortal: 'Aangoo Bulchiinsaa',
    signIn: 'Seeni / Galmeeffadhu',
    signOut: 'Ba\'i',
    myAccount: 'Akkaawuntii Koo',
    searchPlaceholder: 'Uffata aadaa, xillee ykn uffata dhiiraa barbaadi...',
    cart: 'Mooqa Bittaadhaa',
    wishlist: 'Uffata Hawwame',
    language: 'Afaan',
    
    heroTitle: 'Uffata Aadaa Itoophiyaa Bareeda Harkaadhaan Dahuu',
    heroSubtitle: 'Shemmaa fi xillee midhaagina aadaa harka ogessoota Finfinneetni dahuun qophaa\'e ammayyaa dhiyeessina.',
    shopNow: 'Gurgurtaa Ammaa Ilaali',
    exploreHeritage: 'Aadaa Barsiifadhu',
    featuredCollections: 'Uffata Aadaa Filatamaa',
    artisanCrafted: '100% Harkaadhaan Kan Dhahame',
    authenticShemma: 'Jirbiixii Shemmaa Dhugaa',
    expressDelivery: 'Ergaa Ariifachiisaa Biyya Keessa fi Alaa',
    securePayments: 'Kaffaltii Telebirr fi Baankii Eeggamaa',
    
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
    sortRating: 'Sadarkaa Ol\'aanaa',
    sortNewest: 'Uffata Haaraa',
    regionalHeritage: 'Aadaa Naannoo',
    audienceGender: 'Kornyaa',
    noGarmentsFound: 'Uffatni Barbaadame Hin Argamne',
    noGarmentsSubtitle: 'Calaltuu keessaniin uffatni argamuu danda\'u hin jiru. Irra deebidhaan yaala.',
    clearFilters: 'Calaltuu Haqi',

    yourShoppingBag: 'Mooqa Bittaadhaa',
    bagEmptyTitle: 'Mooqan keessan duudaadha',
    bagEmptySubtitle: 'Uffata aadaa, uffata dhiiraa fi faaya aadaa keessaa filadhaa.',
    freeShippingQualify: 'Geejjiba Basaasaa Bilisaa Argattaniirtu!',
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
    phoneNumber: 'Lakkoofsa Bilbilaa (Akkaawuntiin Galmaa\'e)',
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
    
    myOrders: 'Ajaja Koo',
    orderHistory: 'Seenaa Ajajaa',
    profileSettings: 'Sajoo Akkaawuntii',
    viewDetails: 'Bal\'inaan Ilaali',
    copyright: '© 2026 Lelisa Threads. Mirgi Hunduu Kan Eegame.',
    privacy: 'Imaammata Mateenyaa',
    vipClub: 'Miseensa Maatii Aadaa Ta\'i',
    subscribe: 'Galmeeffadhu'
  }
};
