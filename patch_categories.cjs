const fs = require('fs');

let content = fs.readFileSync('src/services/externalInventoryService.ts', 'utf8');

const oldCategories = `    const baseCategories = [
      { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-2', name: "Men's Traditional Wear", slug: 'mens-traditional-wear', description: 'Traditional suits, tunics, and robes for weddings and ceremonies.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-3', name: 'Wedding Collection', slug: 'wedding-collection', description: 'Regal bridal gowns, groom capes (Koba), and Mels attire.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-4', name: "Children's Wear", slug: 'childrens-wear', description: 'Charming cultural outfits for boys and girls.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-5', name: 'Jewelry', slug: 'jewelry', description: 'Authentic Ethiopian filigree crosses, necklaces, and headpieces.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-6', name: 'Scarves', slug: 'scarves', description: 'Soft handwoven Netela, Kuta, and Gabi wraps.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-7', name: 'Shoes', slug: 'shoes', description: 'Traditional leather chamma sandals and Tilet-accented loafers.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-8', name: 'Bags', slug: 'bags', description: 'Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' }
    ];

    return baseCategories.map(cat => ({
      ...cat,
      count: SAMPLE_PRODUCTS.filter(p => p.category === cat.name).length
    }));`;

const newCategories = `    const baseCategories = [
      { id: 'cat-1', name: 'Habesha Kemis', slug: 'habesha-kemis', description: 'Handwoven Ethiopian cultural dresses with intricate Tilet embroidery.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-2', name: 'T-Shirts', slug: 't-shirts', description: 'Authentic Ethiopian cultural shamiizii and patterned shirts.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-3', name: 'Sweaters', slug: 'sweaters', description: 'Warm and comfortable shurabii with traditional accents.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-4', name: "Children's Wear", slug: 'childrens-wear', description: 'Charming cultural outfits for boys and girls.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-8', name: 'Bags', slug: 'bags', description: 'Borsaa - Leather and woven Tilet totes, evening clutches, and Agelgil bags.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-6', name: 'Scarves', slug: 'scarves', description: 'Soft handwoven Netela, Kuta, and Gabi wraps.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat-9', name: 'Other Traditional', slug: 'other', description: 'Unique cultural attire and heritage accessories.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' }
    ];

    return baseCategories.map(cat => ({
      ...cat,
      count: 12
    }));`;

content = content.replace(oldCategories, newCategories);
fs.writeFileSync('src/services/externalInventoryService.ts', content);
console.log("Success Categories");
