// 50+ Realistic Ethiopian Traditional Clothing Products representing diverse Ethiopian cultures
// Categories: Habesha Kemis, Men's Traditional Wear, Children's Wear, Wedding Collection, Jewelry, Scarves, Shoes, Bags
// Regions: Amhara, Tigray, Oromo, Gurage, Harari, Sidama, Wolayta, Afar, National Heritage

import { normalizeProduct } from '../utils/productUtils.js';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in ETB (Ethiopian Birr)
  originalPrice?: number;
  category: 'Habesha Kemis' | "Men's Traditional Wear" | "Children's Wear" | 'Wedding Collection' | 'Jewelry' | 'Scarves' | 'Shoes' | 'Bags';
  region: 'Amhara' | 'Tigray' | 'Oromo' | 'Gurage' | 'Harari' | 'Sidama' | 'Wolayta' | 'Afar' | 'National Heritage';
  material: string;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'UNISEX';
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
}

const RAW_SAMPLE_PRODUCTS: Product[] = [
  // Habesha Kemis (Women's Traditional Dresses)
  {
    id: 'hb-001',
    name: 'Sheba Royal Gold Habesha Kemis',
    slug: 'sheba-royal-gold-habesha-kemis',
    description: 'A masterpiece of traditional Ethiopian craftsmanship. Handwoven from fine Shemma cotton with intricate gold and bronze Tilet embroidery around the neckline, bodice, and flowing hem. Perfectly tailored for weddings and religious celebrations.',
    price: 18500,
    category: 'Habesha Kemis',
    region: 'Amhara',
    material: 'Handwoven Cotton (Menet) & Gold Thread',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Tailored'],
    colors: ['White & Royal Gold', 'White & Bronze', 'Cream & Gold'],
    stock: 12,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 3,
    reviews: [
      { id: 'rev-1', userName: 'Sara Tadesse', rating: 5, comment: 'The gold Tilet is absolutely breathtaking! Received so many compliments at my sister’s wedding in Addis.', createdAt: '2026-07-15' },
      { id: 'rev-2', userName: 'Meron Bekele', rating: 5, comment: 'Authentic Menet cotton, soft, elegant, and perfectly fitted.', createdAt: '2026-07-20' },
      { id: 'rev-3', userName: 'Helen Gebre', rating: 5, comment: 'Stunning fit and craftsmanship. The gold thread shines so beautifully in person.', createdAt: '2026-07-28' }
    ]
  },
  {
    id: 'hb-002',
    name: 'Axum Heritage Tigre Zuria Dress',
    slug: 'axum-heritage-tigre-zuria-dress',
    description: 'Traditional northern Zuria dress featuring classic Tigray geometric motifs in vibrant gold and emerald threads. Comes with a matching lightweight Netela shawl.',
    price: 16800,
    category: 'Habesha Kemis',
    region: 'Tigray',
    material: 'Pure Ethiopian Shemma & Silk Tilet',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White & Emerald/Gold', 'White & Crimson/Gold'],
    stock: 8,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 2,
    reviews: [
      { id: 'rev-4', userName: 'Helen Gebre', rating: 5, comment: 'True Axumite embroidery quality. Lightweight Netela shawl is wonderful!', createdAt: '2026-06-11' },
      { id: 'rev-5', userName: 'Selam Woldemariam', rating: 4, comment: 'Beautiful emerald details along the border. Tailoring fits true to size.', createdAt: '2026-07-02' }
    ]
  },
  {
    id: 'hb-003',
    name: 'Gonder Imperial Tilet Kemis',
    slug: 'gonder-imperial-tilet-kemis',
    description: 'Inspired by the royal courts of Gondar, this dress boasts wide woven Tilet borders along the sleeves and bottom skirt. Elegant silhouette with comfortable breathability.',
    price: 19200,
    category: 'Habesha Kemis',
    region: 'Amhara',
    material: 'Handwoven Cotton & Metallic Gold Brocade',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Gold/Red', 'Ivory & Gold'],
    stock: 5,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 2,
    reviews: [
      { id: 'rev-6', userName: 'Tigist Seifu', rating: 5, comment: 'Felt like royalty wearing this at our holiday gathering. Outstanding quality.', createdAt: '2026-06-25' },
      { id: 'rev-7', userName: 'Eyerusalem M.', rating: 5, comment: 'Durable cotton weave and fast delivery to Bole.', createdAt: '2026-07-05' }
    ]
  },
  {
    id: 'hb-004',
    name: 'Oromo Woyya Cultural Gown',
    slug: 'oromo-woyya-cultural-gown',
    description: 'Celebrating traditional Oromo artistry with bold red, black, and white accents integrated into luxurious handwoven fabric. Features refined embroidery celebrating Odaa symbols.',
    price: 17500,
    category: 'Habesha Kemis',
    region: 'Oromo',
    material: 'Handspun Ethiopian Cotton & Silk Thread',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Tailored'],
    colors: ['White & Red/Black/White', 'Cream & Gold/Red'],
    stock: 14,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 1,
    reviews: [
      { id: 'rev-8', userName: 'Hawwi Gudeta', rating: 5, comment: 'Vibrant Irreecha attire! The red, black, and white embroidery is so authentic.', createdAt: '2026-07-10' }
    ]
  },
  {
    id: 'hb-005',
    name: 'Gurage Enset Heritage Dress',
    slug: 'gurage-enset-heritage-dress',
    description: 'Beautiful Gurage cultural kemis adorned with detailed geometric tilet patterns along the waistline and cuffs. Light and graceful for holiday gatherings.',
    price: 15400,
    category: 'Habesha Kemis',
    region: 'Gurage',
    material: 'Handwoven Cotton & Silk Tilet',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['White & Multicolored Tilet', 'White & Gold'],
    stock: 4, // low stock testing
    rating: 4.7,
    reviewCount: 15,
    reviews: []
  },
  {
    id: 'hb-006',
    name: 'Harari Colorful Ge-Gara Silk Kemis',
    slug: 'harari-colorful-ge-gara-silk-kemis',
    description: 'A striking fusion of traditional Harari vibrant textiles and classic Habesha silhouette. Features rich crimson and gold embroidery influenced by ancient Harar architecture.',
    price: 21000,
    category: 'Habesha Kemis',
    region: 'Harari',
    material: 'Silk Tilet & Fine Cotton Shemma',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Crimson & Gold', 'Emerald & Gold'],
    stock: 6,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'hb-007',
    name: 'Sidama Fichee-Chambalaalla Dress',
    slug: 'sidama-fichee-chambalaalla-dress',
    description: 'Exquisite traditional dress designed for celebrations. Adorned with symbolic Sidama patterns along the hemline and sleeves, handcrafted by master artisans in Hawassa.',
    price: 16200,
    category: 'Habesha Kemis',
    region: 'Sidama',
    material: 'Handwoven Cotton (Menet)',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Green/Gold', 'White & Royal Blue'],
    stock: 9,
    rating: 4.8,
    reviewCount: 14,
    reviews: []
  },
  {
    id: 'hb-008',
    name: 'Wolayta Woga Traditional Gown',
    slug: 'wolayta-woga-traditional-gown',
    description: 'Handwoven by Wolayta artisans, featuring distinctive striped tilet weaves symbolizing unity and cultural abundance.',
    price: 15800,
    category: 'Habesha Kemis',
    region: 'Wolayta',
    material: 'Pure Ethiopian Shemma & Colored Thread',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['White & Maroon/Gold', 'White & Black/Gold'],
    stock: 7,
    rating: 4.6,
    reviewCount: 11,
    reviews: []
  },
  {
    id: 'hb-009',
    name: 'Afar Royal Sanaa Tunic Dress',
    slug: 'afar-royal-sanaa-tunic-dress',
    description: 'Stunning cultural attire featuring lightweight woven cotton with intricate pearl and gold thread accents traditional to Afar heritage.',
    price: 17900,
    category: 'Habesha Kemis',
    region: 'Afar',
    material: 'Lightweight Handwoven Cotton & Gold Thread',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Bronze Gold', 'Ivory & Crimson'],
    stock: 3, // low stock
    rating: 4.9,
    reviewCount: 9,
    reviews: []
  },
  {
    id: 'hb-010',
    name: 'Addis Elegance Meskel Special Dress',
    slug: 'addis-elegance-meskel-special-dress',
    description: 'Modern luxury interpretation of the timeless Habesha Kemis. Features slim-fit tailoring with gold-leaf embroidered Tilet from neckline to ankle.',
    price: 19800,
    category: 'Habesha Kemis',
    region: 'National Heritage',
    material: 'Menet Cotton & Metallic Gold Brocade',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Tailored'],
    colors: ['White & Pure Gold', 'White & Silver/Gold'],
    stock: 15,
    isBestSeller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 51,
    reviews: []
  },

  // Men's Traditional Wear
  {
    id: 'mn-001',
    name: 'Lalibela Embroidered Traditional Men’s Suit',
    slug: 'lalibela-embroidered-traditional-mens-suit',
    description: 'A complete 3-piece traditional suit (shirt, trousers, and embroidered kuta/shawl) crafted from thick, breathable Ethiopian cotton with regal gold collar embroidery.',
    price: 14500,
    category: "Men's Traditional Wear",
    region: 'Amhara',
    material: 'Handwoven Heavy Cotton (Menet)',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White & Gold Collar', 'White & Subtle Silver', 'Off-White & Gold'],
    stock: 11,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 33,
    reviews: []
  },
  {
    id: 'mn-002',
    name: 'Tigray Raya Traditional Men’s Tunic Set',
    slug: 'tigray-raya-traditional-mens-tunic-set',
    description: 'Classic Raya style men’s attire with geometric embroidery across the chest and matching white cotton trousers. Ideal for weddings and cultural festivals.',
    price: 13900,
    category: "Men's Traditional Wear",
    region: 'Tigray',
    material: 'Handspun Ethiopian Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Gold/Green', 'White & Gold'],
    stock: 9,
    rating: 4.8,
    reviewCount: 18,
    reviews: []
  },
  {
    id: 'mn-003',
    name: 'Oromo Abba Gadaa Ceremonial Robe Set',
    slug: 'oromo-abba-gadaa-ceremonial-robe-set',
    description: 'Honoring traditional Oromo leadership attire. Comprises an embroidered cotton tunic, matching trousers, and decorative shawl with Odaa tree motifs.',
    price: 16500,
    category: "Men's Traditional Wear",
    region: 'Oromo',
    material: 'Handwoven Cotton & Silk Thread',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White & Red/Black/White', 'Ivory & Gold'],
    stock: 8,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 24,
    reviews: []
  },
  {
    id: 'mn-004',
    name: 'Gurage Meskel Celebration Men’s Kuta Suit',
    slug: 'gurage-meskel-celebration-mens-kuta-suit',
    description: 'Crisp handwoven white cotton suit paired with a finely bordered Kuta shawl. Comfortable and prestigious for holiday gatherings.',
    price: 13200,
    category: "Men's Traditional Wear",
    region: 'Gurage',
    material: 'Pure Ethiopian Shemma',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['White & Gold Tilet'],
    stock: 14,
    rating: 4.7,
    reviewCount: 16,
    reviews: []
  },
  {
    id: 'mn-005',
    name: 'Harari Cultural Velvet Embroidered Vest & Tunic',
    slug: 'harari-cultural-velvet-embroidered-vest-and-tunic',
    description: 'A regal combination of a crisp white cotton traditional shirt paired with an intricately gold-embroidered Harari velvet waistcoat.',
    price: 17800,
    category: "Men's Traditional Wear",
    region: 'Harari',
    material: 'Velvet & Handwoven Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Royal Black Velvet/Gold', 'White & Burgundy Velvet/Gold'],
    stock: 6,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 28,
    reviews: []
  },
  {
    id: 'mn-006',
    name: 'Sidama Heritage Men’s Holiday Attire',
    slug: 'sidama-heritage-mens-holiday-attire',
    description: 'Traditional cotton tunic with woven Sidama border patterns on the cuffs and collar, accompanied by a soft matching shawl.',
    price: 12900,
    category: "Men's Traditional Wear",
    region: 'Sidama',
    material: 'Handwoven Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['White & Green/Gold'],
    stock: 10,
    rating: 4.6,
    reviewCount: 12,
    reviews: []
  },
  {
    id: 'mn-007',
    name: 'Wolayta Woga Embroidered Shirt & Kuta',
    slug: 'wolayta-woga-embroidered-shirt-and-kuta',
    description: 'Elegant men’s traditional wear featuring handcrafted Wolayta geometric embroidery on the chest and collar.',
    price: 13500,
    category: "Men's Traditional Wear",
    region: 'Wolayta',
    material: 'Handspun Ethiopian Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Gold/Maroon'],
    stock: 13,
    rating: 4.8,
    reviewCount: 14,
    reviews: []
  },
  {
    id: 'mn-008',
    name: 'Afar Traditional Men’s Sanaa Set',
    slug: 'afar-traditional-mens-sanaa-set',
    description: 'Distinguished Afar men’s traditional attire with metallic thread embroidery and lightweight desert-climate weave.',
    price: 14200,
    category: "Men's Traditional Wear",
    region: 'Afar',
    material: 'Lightweight Handwoven Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['White & Bronze Gold'],
    stock: 4, // low stock alert testing
    rating: 4.9,
    reviewCount: 9,
    reviews: []
  },
  {
    id: 'mn-009',
    name: 'Addis Groom Royal Koba & Kuta Coat',
    slug: 'addis-groom-royal-koba-and-kuta-coat',
    description: 'A luxurious embroidered full-length traditional coat and matching trousers designed specifically for Ethiopian grooms and formal banquets.',
    price: 22500,
    category: "Men's Traditional Wear",
    region: 'National Heritage',
    material: 'Heavy Silk Brocade & Menet Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL', 'Custom Tailored'],
    colors: ['White & Royal Gold', 'Ivory & Antique Gold'],
    stock: 7,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 31,
    reviews: []
  },

  // Wedding Collection
  {
    id: 'wd-001',
    name: 'Queen of Sheba Bridal Habesha Gown (Mels)',
    slug: 'queen-of-sheba-bridal-habesha-gown-mels',
    description: 'The pinnacle of Ethiopian bridal couture for the Mels ceremony. Extravagant hand-woven Tilet covering the entire bodice and cascading train, crafted over 45 days by master artisans in Addis Ababa.',
    price: 36000,
    category: 'Wedding Collection',
    region: 'National Heritage',
    material: 'Premium Menet Cotton, Heavy Silk Tilet & Gold Brocade',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Tailored'],
    colors: ['Pure White & 24K Gold Tilet', 'Ivory & Royal Gold'],
    stock: 5,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 47,
    reviews: [
      { id: 'rev-w1', userName: 'Rahel M.', rating: 5, comment: 'My wedding photos look like royalty! This dress is worth every single birr.', createdAt: '2026-07-01' }
    ]
  },
  {
    id: 'wd-002',
    name: 'Imperial Groom’s Royal Velvet Cape & Koba Suit',
    slug: 'imperial-grooms-royal-velvet-cape-and-koba-suit',
    description: 'Regal groom ensemble including a gold-embroidered velvet ceremonial cape (Koba), matching tunic, trousers, and silk-hemmed kuta.',
    price: 31000,
    category: 'Wedding Collection',
    region: 'National Heritage',
    material: 'Velvet, Gold Brocade & Menet Cotton',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL', 'Custom Tailored'],
    colors: ['Royal Black & Gold', 'Deep Emerald & Gold', 'White & Gold'],
    stock: 4, // low stock
    isFeatured: true,
    rating: 5.0,
    reviewCount: 23,
    reviews: []
  },
  {
    id: 'wd-003',
    name: 'Tigray Heritage Bridal Gown & Kabba Set',
    slug: 'tigray-heritage-bridal-gown-and-kabba-set',
    description: 'Traditional northern Ethiopian bridal dress with matching ceremonial Kabba cape adorned with shimmering gold thread embroidery.',
    price: 34000,
    category: 'Wedding Collection',
    region: 'Tigray',
    material: 'Handwoven Cotton & Metallic Gold Tilet',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'Custom Tailored'],
    colors: ['White & Emerald/Gold', 'White & Crimson/Gold'],
    stock: 6,
    rating: 4.9,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'wd-004',
    name: 'Oromo Ceremonial Couple’s Wedding Attire (Set)',
    slug: 'oromo-ceremonial-couples-wedding-attire-set',
    description: 'Matching luxury bridal gown and groom suit set celebrating traditional Oromo royal wedding aesthetics with rich red, black, and gold embroidery.',
    price: 52000,
    category: 'Wedding Collection',
    region: 'Oromo',
    material: 'Premium Menet Cotton & Silk Tilet',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Custom Tailored', 'S/M Set', 'L/XL Set'],
    colors: ['White & Oromo Red/Gold/Black'],
    stock: 3,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 15,
    reviews: []
  },
  {
    id: 'wd-005',
    name: 'Gondar Royal Velvet Kabba (Ceremonial Cape)',
    slug: 'gondar-royal-velvet-kabba-ceremonial-cape',
    description: 'The iconic Ethiopian velvet Kabba embroidered with lavish gold braid ornaments around the collar and borders. Worn by brides and grooms during the Mels reception.',
    price: 18000,
    category: 'Wedding Collection',
    region: 'Amhara',
    material: 'Rich Velvet & Gold Metallic Braid',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Adult Fit', 'Large Adult Fit'],
    colors: ['Royal Blue & Gold', 'Crimson Red & Gold', 'Emerald Green & Gold'],
    stock: 10,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 36,
    reviews: []
  },
  {
    id: 'wd-006',
    name: 'Harari Nikah Bridal Golden Silk Gown',
    slug: 'harari-nikah-bridal-golden-silk-gown',
    description: 'Breathtaking Harari bridal attire combining shimmering gold silk Tilet with delicate hand-stitched beadwork.',
    price: 33500,
    category: 'Wedding Collection',
    region: 'Harari',
    material: 'Silk Brocade & Handwoven Cotton',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'Custom Tailored'],
    colors: ['Crimson & Gold', 'Pure Gold & Ivory'],
    stock: 5,
    rating: 4.9,
    reviewCount: 17,
    reviews: []
  },

  // Children's Wear
  {
    id: 'kd-001',
    name: 'Little Abyssinia Girls’ Habesha Kemis',
    slug: 'little-abyssinia-girls-habesha-kemis',
    description: 'An adorable, soft, and breathable traditional Habesha dress for little girls. Features a comfortable elastic waist and bright gold Tilet embroidery.',
    price: 4800,
    category: "Children's Wear",
    region: 'Amhara',
    material: 'Soft Ethiopian Cotton',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2T-3T', '4T-5T', '6-8 Years', '9-12 Years'],
    colors: ['White & Gold', 'White & Red/Gold'],
    stock: 18,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 41,
    reviews: []
  },
  {
    id: 'kd-002',
    name: 'Young Prince Traditional Boys’ Tunic & Kuta Set',
    slug: 'young-prince-traditional-boys-tunic-and-kuta-set',
    description: 'Traditional Ethiopian suit for boys including an embroidered white cotton shirt, trousers, and mini Kuta shawl.',
    price: 4600,
    category: "Children's Wear",
    region: 'Amhara',
    material: 'Soft Ethiopian Cotton',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2T-3T', '4T-5T', '6-8 Years', '9-12 Years'],
    colors: ['White & Gold', 'White & Royal Blue'],
    stock: 15,
    rating: 4.8,
    reviewCount: 26,
    reviews: []
  },
  {
    id: 'kd-003',
    name: 'Tigray Raya Festival Girls’ Zuria Dress',
    slug: 'tigray-raya-festival-girls-zuria-dress',
    description: 'Charming traditional Raya dress for children with colorful woven borders and soft cotton feel.',
    price: 4900,
    category: "Children's Wear",
    region: 'Tigray',
    material: 'Pure Ethiopian Shemma',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['4T-5T', '6-8 Years', '9-12 Years'],
    colors: ['White & Gold/Green', 'White & Crimson'],
    stock: 12,
    rating: 4.9,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'kd-004',
    name: 'Oromo Cultural Holiday Outfit for Boys',
    slug: 'oromo-cultural-holiday-outfit-for-boys',
    description: 'Festive boys’ attire celebrating Oromo heritage with distinctive red and black embroidery.',
    price: 4700,
    category: "Children's Wear",
    region: 'Oromo',
    material: 'Handwoven Cotton',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['4T-5T', '6-8 Years', '9-12 Years'],
    colors: ['White & Oromo Red/Black'],
    stock: 11,
    rating: 4.7,
    reviewCount: 14,
    reviews: []
  },
  {
    id: 'kd-005',
    name: 'Gurage Little Artisan Holiday Kemis',
    slug: 'gurage-little-artisan-holiday-kemis',
    description: 'Soft cotton dress for girls with colorful Gurage tilet patterns around the hem and collar.',
    price: 4500,
    category: "Children's Wear",
    region: 'Gurage',
    material: 'Soft Ethiopian Shemma',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2T-3T', '4T-5T', '6-8 Years'],
    colors: ['White & Multi-Tilet'],
    stock: 14,
    rating: 4.8,
    reviewCount: 11,
    reviews: []
  },
  {
    id: 'kd-006',
    name: 'Harari Festive Velvet & Cotton Ensemble (Kids)',
    slug: 'harari-festive-velvet-and-cotton-ensemble-kids',
    description: 'Delightful Harari holiday outfit for kids featuring a miniature embroidered velvet vest and cotton shirt.',
    price: 5200,
    category: "Children's Wear",
    region: 'Harari',
    material: 'Velvet & Cotton',
    gender: 'KIDS',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['4T-5T', '6-8 Years', '9-12 Years'],
    colors: ['White & Crimson Velvet'],
    stock: 8,
    rating: 4.9,
    reviewCount: 13,
    reviews: []
  },

  // Jewelry
  {
    id: 'jw-001',
    name: 'Axumite 24K Gold-Plated Filigree Cross Necklace',
    slug: 'axumite-24k-gold-plated-filigree-cross-necklace',
    description: 'Hand-crafted traditional Ethiopian cross necklace inspired by the ancient obelisks of Axum. Intricate filigree workmanship plated in rich 24K gold.',
    price: 6800,
    category: 'Jewelry',
    region: 'Tigray',
    material: '24K Gold Plated Alloy',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591472159-259f7ce81187?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['18 Inch Chain', '22 Inch Chain'],
    colors: ['Pure Gold'],
    stock: 20,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 64,
    reviews: []
  },
  {
    id: 'jw-002',
    name: 'Lalibela Heritage Cross Earrings & Pendant Set',
    slug: 'lalibela-heritage-cross-earrings-and-pendant-set',
    description: 'Matching gold-dipped traditional Ethiopian cross earrings and pendant set featuring Lalibela lattice patterns.',
    price: 8900,
    category: 'Jewelry',
    region: 'Amhara',
    material: 'Gold Plated Silver Alloy',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Set'],
    colors: ['Gold', 'Antique Bronze'],
    stock: 16,
    rating: 4.9,
    reviewCount: 38,
    reviews: []
  },
  {
    id: 'jw-003',
    name: 'Oromo Traditional Amber & Silver Bead Necklace (Caaccuu)',
    slug: 'oromo-traditional-amber-and-silver-bead-necklace-caaccuu',
    description: 'Authentic cultural necklace featuring amber-hued resin beads and traditional silver ornaments worn during Oromo thanksgiving and weddings.',
    price: 7400,
    category: 'Jewelry',
    region: 'Oromo',
    material: 'Amber Resin & Silver Alloy',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1611591472159-259f7ce81187?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['20 Inch Adjustable'],
    colors: ['Amber & Silver'],
    stock: 12,
    rating: 4.8,
    reviewCount: 22,
    reviews: []
  },
  {
    id: 'jw-004',
    name: 'Gondar Bridal Headpiece & Albo Anklet Set',
    slug: 'gondar-bridal-headpiece-and-albo-anklet-set',
    description: 'Traditional Ethiopian bridal hair ornament (Woreq) and matching ankle bells (Albo) crafted for traditional Mels ceremonies.',
    price: 11500,
    category: 'Jewelry',
    region: 'Amhara',
    material: 'Gold Plated Brass Filigree',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size Fits All'],
    colors: ['Gold'],
    stock: 8,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'jw-005',
    name: 'Harari Filigree Ear Cuffs & Bangles Set',
    slug: 'harari-filigree-ear-cuffs-and-bangles-set',
    description: 'Delicate Harari gold filigree bangles and statement earrings reflecting centuries-old Islamic metalwork in Harar.',
    price: 9200,
    category: 'Jewelry',
    region: 'Harari',
    material: 'Gold Plated Alloy',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Adult Fit'],
    colors: ['Gold'],
    stock: 11,
    rating: 4.9,
    reviewCount: 16,
    reviews: []
  },
  {
    id: 'jw-006',
    name: 'Afar Traditional Handcrafted Silver Bracelet',
    slug: 'afar-traditional-handcrafted-silver-bracelet',
    description: 'Heavy traditional cuff bracelet engraved with symbolic desert geometric motifs from the Afar region.',
    price: 6500,
    category: 'Jewelry',
    region: 'Afar',
    material: 'Handcrafted Silver Plated Alloy',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1611591472159-259f7ce81187?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Medium Wrist', 'Large Wrist'],
    colors: ['Antique Silver'],
    stock: 14,
    rating: 4.7,
    reviewCount: 13,
    reviews: []
  },

  // Scarves (Netela / Kuta / Gabi)
  {
    id: 'sc-001',
    name: 'Lalibela Extra-Soft Handwoven Netela Scarf',
    slug: 'lalibela-extra-soft-handwoven-netela-scarf',
    description: 'The quintessential Ethiopian 2-layer white cotton Netela with a glimmering gold Tilet border. Essential for church, weddings, and evening elegance.',
    price: 3500,
    category: 'Scarves',
    region: 'Amhara',
    material: '100% Handspun Ethiopian Cotton & Gold Thread',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard (2m x 1m)'],
    colors: ['White & Royal Gold', 'White & Bronze', 'White & Tri-Color'],
    stock: 25,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 78,
    reviews: []
  },
  {
    id: 'sc-002',
    name: 'Heavy Highland Handwoven Gabi Blanket Wrap',
    slug: 'heavy-highland-handwoven-gabi-blanket-wrap',
    description: 'Traditional 4-layer thick Ethiopian Gabi wrap. Extremely warm, breathable, and cozy for cool evenings and ceremonies.',
    price: 5800,
    category: 'Scarves',
    region: 'National Heritage',
    material: '4-Layer Handspun Heavy Cotton',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Large Wrap (2.5m x 1.5m)'],
    colors: ['Natural White & Subtle Border'],
    stock: 15,
    rating: 4.9,
    reviewCount: 45,
    reviews: []
  },
  {
    id: 'sc-003',
    name: 'Tigray Raya Silk-Border Netela Scarf',
    slug: 'tigray-raya-silk-border-netela-scarf',
    description: 'Lightweight white handwoven cotton shawl with distinctive Raya geometric emerald and gold tilet ends.',
    price: 3800,
    category: 'Scarves',
    region: 'Tigray',
    material: 'Handwoven Shemma & Silk Tilet',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard (2m x 1m)'],
    colors: ['White & Emerald/Gold', 'White & Crimson/Gold'],
    stock: 18,
    rating: 4.8,
    reviewCount: 29,
    reviews: []
  },
  {
    id: 'sc-004',
    name: 'Oromo Cultural Border Shawl (Kuta)',
    slug: 'oromo-cultural-border-shawl-kuta',
    description: 'Finely woven traditional cotton Kuta featuring bold red and black Oromo cultural trim.',
    price: 3900,
    category: 'Scarves',
    region: 'Oromo',
    material: 'Handwoven Cotton',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard (2m x 1m)'],
    colors: ['White & Red/Black'],
    stock: 14,
    rating: 4.8,
    reviewCount: 21,
    reviews: []
  },
  {
    id: 'sc-005',
    name: 'Harari Multicolor Silk Pashmina Wrap',
    slug: 'harari-multicolor-silk-pashmina-wrap',
    description: 'Vibrant silk-blend shawl inspired by Harari colorful basketry and geometric textile art.',
    price: 4400,
    category: 'Scarves',
    region: 'Harari',
    material: 'Silk & Fine Cotton Blend',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard (2m x 1m)'],
    colors: ['Crimson & Gold', 'Royal Blue & Gold'],
    stock: 11,
    rating: 4.9,
    reviewCount: 16,
    reviews: []
  },

  // Shoes (Traditional Sandals / Modern Fusion)
  {
    id: 'sh-001',
    name: 'Handcrafted Addis Leather & Tilet Loafers',
    slug: 'handcrafted-addis-leather-and-tilet-loafers',
    description: 'Premium full-grain Ethiopian leather slip-on loafers accented with authentic woven gold Tilet stripe across the vamp.',
    price: 6400,
    category: 'Shoes',
    region: 'National Heritage',
    material: '100% Genuine Ethiopian Leather & Woven Tilet',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['40 (US 7.5)', '41 (US 8)', '42 (US 9)', '43 (US 10)', '44 (US 10.5)', '45 (US 11.5)'],
    colors: ['Tan Leather & Gold Tilet', 'Black Leather & Gold Tilet'],
    stock: 15,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 39,
    reviews: []
  },
  {
    id: 'sh-002',
    name: 'Sheba Gold-Brocade Traditional Bridal Heels',
    slug: 'sheba-gold-brocade-traditional-bridal-heels',
    description: 'Elegant block heels covered in shimmering Ethiopian gold Tilet brocade. Designed for comfort during long Mels and wedding celebrations.',
    price: 6800,
    category: 'Shoes',
    region: 'National Heritage',
    material: 'Leather Sole & Gold Tilet Uppers',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['36 (US 6)', '37 (US 6.5)', '38 (US 7.5)', '39 (US 8)', '40 (US 9)'],
    colors: ['Gold Brocade', 'Ivory & Gold'],
    stock: 12,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 27,
    reviews: []
  },
  {
    id: 'sh-003',
    name: 'Traditional Highland Leather Sandals (Chamma)',
    slug: 'traditional-highland-leather-sandals-chamma',
    description: 'Durable, handcrafted Ethiopian leather open sandals with traditional stitching, worn across rural and urban celebrations.',
    price: 3900,
    category: 'Shoes',
    region: 'Amhara',
    material: 'Hand-dyed Cattle Leather',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Natural Saddle Tan', 'Dark Brown'],
    stock: 18,
    rating: 4.7,
    reviewCount: 22,
    reviews: []
  },
  {
    id: 'sh-004',
    name: 'Oromo Cultural Leather Slip-Ons',
    slug: 'oromo-cultural-leather-slip-ons',
    description: 'Soft handcrafted leather footwear featuring subtle red and black cultural trim.',
    price: 5200,
    category: 'Shoes',
    region: 'Oromo',
    material: 'Genuine Leather',
    gender: 'MEN',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Rich Tan & Black'],
    stock: 11,
    rating: 4.8,
    reviewCount: 15,
    reviews: []
  },

  // Bags (Traditional Leather & Woven Tilet)
  {
    id: 'bg-001',
    name: 'Gondar Heritage Tilet & Leather Tote Bag',
    slug: 'gondar-heritage-tilet-and-leather-tote-bag',
    description: 'Spacious luxury tote bag made from supple Ethiopian sheepskin leather, inlaid with wide handwoven gold Tilet panels. Includes zippered interior compartment.',
    price: 7900,
    category: 'Bags',
    region: 'Amhara',
    material: 'Genuine Ethiopian Leather & Woven Tilet',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Tote (38cm x 30cm)'],
    colors: ['Tan Leather & Gold Tilet', 'Black Leather & Gold Tilet'],
    stock: 14,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 44,
    reviews: []
  },
  {
    id: 'bg-002',
    name: 'Axum Geometric Tilet Evening Clutch',
    slug: 'axum-geometric-tilet-evening-clutch',
    description: 'The perfect companion for your Habesha Kemis. Compact evening clutch with magnetic clasp, wrapped in shimmer gold and green Tilet brocade.',
    price: 4900,
    category: 'Bags',
    region: 'Tigray',
    material: 'Woven Tilet & Leather Trim',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Evening Clutch (25cm x 15cm)'],
    colors: ['Gold & Emerald', 'Gold & Crimson', 'Royal Gold'],
    stock: 19,
    rating: 4.9,
    reviewCount: 32,
    reviews: []
  },
  {
    id: 'bg-003',
    name: 'Harari Woven Agelgil-Style Round Bag',
    slug: 'harari-woven-agelgil-style-round-bag',
    description: 'Inspired by traditional leather-covered Agelgil baskets, this round shoulder bag is crafted with colorful Harari motifs and brass hardware.',
    price: 6800,
    category: 'Bags',
    region: 'Harari',
    material: 'Ethiopian Leather & Colorful Woven Textile',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Round Medium (24cm diameter)'],
    colors: ['Crimson & Gold', 'Natural Tan & Gold'],
    stock: 9,
    rating: 4.8,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'bg-004',
    name: 'Oromo Cultural Leather Messenger Bag',
    slug: 'oromo-cultural-leather-messenger-bag',
    description: 'Handcrafted full-grain leather crossbody messenger bag featuring embossed cultural symbols and red/black accent stitching.',
    price: 7500,
    category: 'Bags',
    region: 'Oromo',
    material: 'Full-Grain Cattle Leather',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Messenger (34cm x 26cm)'],
    colors: ['Saddle Brown', 'Black'],
    stock: 11,
    rating: 4.9,
    reviewCount: 23,
    reviews: []
  },
  {
    id: 'bg-005',
    name: 'Gurage Handwoven Holiday Drawstring Pouch',
    slug: 'gurage-handwoven-holiday-drawstring-pouch',
    description: 'Delightful cotton and leather drawstring pouch with Gurage colored tilet bands, perfect for festivals and weddings.',
    price: 3600,
    category: 'Bags',
    region: 'Gurage',
    material: 'Shemma Cotton & Soft Leather',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Small Drawstring'],
    colors: ['White & Multi-Tilet'],
    stock: 16,
    rating: 4.7,
    reviewCount: 14,
    reviews: []
  },
  {
    id: 'bg-006',
    name: 'Sidama Heritage Hand-Embroidered Tote',
    slug: 'sidama-heritage-hand-embroidered-tote',
    description: 'Spacious everyday tote bag featuring Sidama cultural embroidery patterns and reinforced leather handles.',
    price: 5900,
    category: 'Bags',
    region: 'Sidama',
    material: 'Heavy Handwoven Cotton & Leather',
    gender: 'WOMEN',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Large Tote'],
    colors: ['White & Green/Gold'],
    stock: 13,
    rating: 4.8,
    reviewCount: 17,
    reviews: []
  },

  // Additional products to round out to 50+ rich items across all styles
  {
    id: 'hb-011',
    name: 'Wollo Zuria Traditional Embroidered Dress',
    slug: 'wollo-zuria-traditional-embroidered-dress',
    description: 'Famous Wollo handspun cotton dress featuring intricate multi-layered gold and red Tilet work. Soft, regal, and iconic.',
    price: 18800,
    category: 'Habesha Kemis',
    region: 'Amhara',
    material: 'Handwoven Cotton (Menet)',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Gold/Red', 'Ivory & Gold'],
    stock: 9,
    rating: 4.9,
    reviewCount: 31,
    reviews: []
  },
  {
    id: 'hb-012',
    name: 'Tigray Adwa Heritage Tilet Kemis',
    slug: 'tigray-adwa-heritage-tilet-kemis',
    description: 'Commemorating the victory of Adwa, this dress incorporates bold historical Tigray patterns in gold and emerald weave.',
    price: 19500,
    category: 'Habesha Kemis',
    region: 'Tigray',
    material: 'Handwoven Cotton & Silk Tilet',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Emerald/Gold', 'White & Gold'],
    stock: 7,
    rating: 4.9,
    reviewCount: 25,
    reviews: []
  },
  {
    id: 'hb-013',
    name: 'Oromo Jimma Royal Woyya Kemis',
    slug: 'oromo-jimma-royal-woyya-kemis',
    description: 'Refined Oromo cultural dress with geometric hand-stitching along the neckline and cuffs, celebrating Jimma artisan traditions.',
    price: 17200,
    category: 'Habesha Kemis',
    region: 'Oromo',
    material: 'Handspun Ethiopian Cotton',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Tailored'],
    colors: ['White & Red/Black/White', 'Ivory & Gold'],
    stock: 10,
    rating: 4.8,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'mn-010',
    name: 'Axumite Groom Formal Traditional Suit',
    slug: 'axumite-groom-formal-traditional-suit',
    description: 'Stunning white heavy cotton men’s suit with embroidered Tigray motifs on the collar and cuffs, paired with a matching ceremonial kuta.',
    price: 15800,
    category: "Men's Traditional Wear",
    region: 'Tigray',
    material: 'Heavy Ethiopian Cotton',
    gender: 'MEN',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White & Gold/Green', 'White & Pure Gold'],
    stock: 8,
    rating: 4.9,
    reviewCount: 22,
    reviews: []
  },
  {
    id: 'mn-011',
    name: 'Addis Ababa Urban Contemporary Habesha Shirt',
    slug: 'addis-ababa-urban-contemporary-habesha-shirt',
    description: 'A modern tailored button-up shirt made from Ethiopian cotton with a sleek vertical gold Tilet stripe. Perfect for smart-casual and Friday cultural wear.',
    price: 6800,
    category: "Men's Traditional Wear",
    region: 'National Heritage',
    material: '100% Handwoven Cotton',
    gender: 'MEN',
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White & Gold Stripe', 'Black & Gold Stripe'],
    stock: 22,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 56,
    reviews: []
  },
  {
    id: 'kd-007',
    name: 'Oromo Little Princess Holiday Gown',
    slug: 'oromo-little-princess-holiday-gown',
    description: 'Soft cotton cultural dress for girls with red and black Oromo embroidery and a comfortable fit.',
    price: 4900,
    category: "Children's Wear",
    region: 'Oromo',
    material: 'Soft Ethiopian Cotton',
    gender: 'KIDS',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'],
    sizes: ['2T-3T', '4T-5T', '6-8 Years'],
    colors: ['White & Red/Black'],
    stock: 14,
    rating: 4.9,
    reviewCount: 18,
    reviews: []
  },
  {
    id: 'kd-008',
    name: 'Addis Heritage Toddler Boys’ Kuta Set',
    slug: 'addis-heritage-toddler-boys-kuta-set',
    description: 'Miniature traditional white cotton shirt, trousers, and mini Kuta scarf for toddlers and infants.',
    price: 4200,
    category: "Children's Wear",
    region: 'National Heritage',
    material: 'Soft Cotton Shemma',
    gender: 'KIDS',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'],
    sizes: ['12-24M', '2T-3T', '4T-5T'],
    colors: ['White & Gold'],
    stock: 19,
    rating: 4.9,
    reviewCount: 29,
    reviews: []
  },
  {
    id: 'jw-007',
    name: 'Tigray Adwa Commemorative Silver Cross Pendant',
    slug: 'tigray-adwa-commemorative-silver-cross-pendant',
    description: 'Hand-cast silver alloy traditional cross pendant featuring classic northern Ethiopian geometric lattice.',
    price: 6200,
    category: 'Jewelry',
    region: 'Tigray',
    material: 'Silver Plated Alloy',
    gender: 'UNISEX',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Standard Pendant with Chain'],
    colors: ['Antique Silver'],
    stock: 15,
    rating: 4.8,
    reviewCount: 21,
    reviews: []
  },
  {
    id: 'jw-008',
    name: 'Sheba Royal Gold Filigree Statement Ring',
    slug: 'sheba-royal-gold-filigree-statement-ring',
    description: 'Adjustable 24K gold-dipped filigree ring designed to complement traditional Ethiopian bridal and evening gowns.',
    price: 4500,
    category: 'Jewelry',
    region: 'National Heritage',
    material: '24K Gold Plated Brass',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1611591472159-259f7ce81187?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Adjustable Band'],
    colors: ['Gold'],
    stock: 18,
    rating: 4.9,
    reviewCount: 34,
    reviews: []
  },
  {
    id: 'sc-006',
    name: 'Gondar Double-Weave Gold Tilet Netela',
    slug: 'gondar-double-weave-gold-tilet-netela',
    description: 'Extra-wide double-woven gold Tilet border Netela from Gondar. Shimmers in evening light and adds grandeur to any dress.',
    price: 4800,
    category: 'Scarves',
    region: 'Amhara',
    material: '100% Handspun Cotton & Heavy Gold Thread',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Standard (2m x 1m)'],
    colors: ['White & Royal Gold'],
    stock: 14,
    rating: 5.0,
    reviewCount: 38,
    reviews: []
  },
  {
    id: 'sh-005',
    name: 'Harari Embroidered Leather Evening Slippers',
    slug: 'harari-embroidered-leather-evening-slippers',
    description: 'Hand-stitched leather slippers featuring colorful Harari metallic thread embroidery across the toe.',
    price: 5800,
    category: 'Shoes',
    region: 'Harari',
    material: 'Genuine Leather & Silk Embroidery',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'],
    sizes: ['37', '38', '39', '40', '41'],
    colors: ['Crimson & Gold', 'Black & Gold'],
    stock: 11,
    rating: 4.8,
    reviewCount: 19,
    reviews: []
  },
  {
    id: 'bg-007',
    name: 'Sheba Royal Gold-Brocade Weekender Bag',
    slug: 'sheba-royal-gold-brocade-weekender-bag',
    description: 'A luxurious travel weekender bag crafted from durable Ethiopian leather and accented with broad gold Tilet brocade panels.',
    price: 11800,
    category: 'Bags',
    region: 'National Heritage',
    material: 'Full-Grain Leather & Gold Brocade',
    gender: 'UNISEX',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Weekender (52cm x 34cm)'],
    colors: ['Tan & Gold', 'Black & Gold'],
    stock: 7,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 27,
    reviews: []
  },
  {
    id: 'hb-014',
    name: 'Gurage Celebration Kemis with Woven Belt',
    slug: 'gurage-celebration-kemis-with-woven-belt',
    description: 'Handwoven Gurage cotton dress featuring a traditional matching woven sash and bright colorful geometric trim.',
    price: 16400,
    category: 'Habesha Kemis',
    region: 'Gurage',
    material: 'Handwoven Cotton & Colorful Thread',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Multi-Tilet'],
    stock: 10,
    rating: 4.8,
    reviewCount: 17,
    reviews: []
  },
  {
    id: 'hb-015',
    name: 'Sidama Chambalaalla Queen Ceremonial Kemis',
    slug: 'sidama-chambalaalla-queen-ceremonial-kemis',
    description: 'An extraordinary ceremonial gown from Sidama adorned with rich green, gold, and white Tilet symbolizing the Ethiopian New Year of Fichee-Chambalaalla.',
    price: 18900,
    category: 'Habesha Kemis',
    region: 'Sidama',
    material: 'Handspun Cotton & Silk Tilet',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Green/Gold'],
    stock: 8,
    rating: 4.9,
    reviewCount: 21,
    reviews: []
  },
  {
    id: 'hb-016',
    name: 'Wolayta Woga Royal Tilet Dress',
    slug: 'wolayta-woga-royal-tilet-dress',
    description: 'Masterpiece Wolayta cultural dress featuring distinctive woven bands in deep maroon, gold, and black.',
    price: 17400,
    category: 'Habesha Kemis',
    region: 'Wolayta',
    material: 'Handwoven Cotton & Silk Thread',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: ['White & Maroon/Gold'],
    stock: 6,
    rating: 4.8,
    reviewCount: 15,
    reviews: []
  },
  {
    id: 'hb-017',
    name: 'Afar Royal Golden Silk-Border Kemis',
    slug: 'afar-royal-golden-silk-border-kemis',
    description: 'Lightweight and breathtaking dress featuring Afar desert-climate weave and shimmering bronze/gold metallic thread borders.',
    price: 18400,
    category: 'Habesha Kemis',
    region: 'Afar',
    material: 'Lightweight Handwoven Cotton & Gold Thread',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Bronze Gold'],
    stock: 5,
    rating: 4.9,
    reviewCount: 18,
    reviews: []
  },
  {
    id: 'mn-012',
    name: 'Gondar Royal Embroidered Koba Coat & Vest',
    slug: 'gondar-royal-embroidered-koba-coat-and-vest',
    description: 'Formal men’s ceremonial coat and embroidered waistcoat set from Gondar, designed for weddings, baptisms, and state functions.',
    price: 19800,
    category: "Men's Traditional Wear",
    region: 'Amhara',
    material: 'Heavy Ethiopian Cotton & Metallic Gold Thread',
    gender: 'MEN',
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White & Royal Gold'],
    stock: 9,
    rating: 4.9,
    reviewCount: 26,
    reviews: []
  },
  {
    id: 'wd-007',
    name: 'Axumite Bridal Silk Tilet Train Dress',
    slug: 'axumite-bridal-silk-tilet-train-dress',
    description: 'A sweeping bridal gown with a 1.5-meter train, woven with traditional Tigray geometric embroidery in 24K gold thread.',
    price: 38500,
    category: 'Wedding Collection',
    region: 'Tigray',
    material: 'Handwoven Menet Cotton & Gold Brocade',
    gender: 'WOMEN',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'Custom Tailored'],
    colors: ['Pure White & Gold'],
    stock: 3,
    rating: 5.0,
    reviewCount: 29,
    reviews: []
  },
  {
    id: 'jw-009',
    name: 'Oromo Ceremonial Silver & Copper Cuff Bracelet',
    slug: 'oromo-ceremonial-silver-and-copper-cuff-bracelet',
    description: 'Traditional Oromo wrist ornament forged from silver and copper alloy with traditional geometric symbols.',
    price: 5400,
    category: 'Jewelry',
    region: 'Oromo',
    material: 'Silver & Copper Alloy',
    gender: 'UNISEX',
    images: ['https://images.unsplash.com/photo-1611591472159-259f7ce81187?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Standard Adult Fit'],
    colors: ['Silver & Copper'],
    stock: 14,
    rating: 4.8,
    reviewCount: 16,
    reviews: []
  },
  {
    id: 'sc-007',
    name: 'Sidama Ceremonial White Cotton Shawl',
    slug: 'sidama-ceremonial-white-cotton-shawl',
    description: 'Lightweight 2-layer white cotton Netela featuring emerald and gold Sidama heritage tilet ends.',
    price: 3600,
    category: 'Scarves',
    region: 'Sidama',
    material: 'Handwoven Shemma Cotton',
    gender: 'UNISEX',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Standard (2m x 1m)'],
    colors: ['White & Green/Gold'],
    stock: 17,
    rating: 4.8,
    reviewCount: 19,
    reviews: []
  }
];

export const SAMPLE_PRODUCTS: Product[] = RAW_SAMPLE_PRODUCTS.map(normalizeProduct);

export const REGIONS_LIST: Product['region'][] = [
  'Amhara',
  'Tigray',
  'Oromo',
  'Gurage',
  'Harari',
  'Sidama',
  'Wolayta',
  'Afar',
  'National Heritage'
];

export const CATEGORIES_LIST: Product['category'][] = [
  'Habesha Kemis',
  "Men's Traditional Wear",
  "Children's Wear",
  'Wedding Collection',
  'Jewelry',
  'Scarves',
  'Shoes',
  'Bags'
];

export const USD_EXCHANGE_RATE = 135; // 1 USD approx 135 ETB

export function formatPrice(priceEtb: number, currency: 'ETB' | 'USD' = 'ETB'): string {
  if (currency === 'USD') {
    const usd = (priceEtb / USD_EXCHANGE_RATE).toFixed(2);
    return `$${usd} USD`;
  }
  return `${priceEtb.toLocaleString()} ETB`;
}
