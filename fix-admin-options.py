import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    text = f.read()

bad_edit_cat = """                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Habesha Kemis">Habesha Kemis</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Bags">Bags</option>
                      <option value="Sweaters">Sweaters</option>
                    </select>"""

good_edit_cat = """                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      {['Habesha Kemis', "Men's Traditional Wear", "Children's Wear", 'Wedding Collection', 'Jewelry', 'Scarves', 'Shoes', 'Bags', 'T-Shirts', 'Sweaters'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>"""

bad_edit_reg = """                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Amhara">Amhara Heritage</option>
                      <option value="Tigray">Tigray Heritage</option>
                      <option value="Oromo">Oromo Heritage</option>
                      <option value="Gurage">Gurage Heritage</option>
                      <option value="Harari">Harari Heritage</option>
                      <option value="National Heritage">National Heritage</option>
                    </select>"""

good_edit_reg = """                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      {['Amhara', 'Tigray', 'Oromo', 'Gurage', 'Harari', 'Sidama', 'Wolayta', 'Afar', 'National Heritage'].map(reg => (
                        <option key={reg} value={reg}>{reg === 'National Heritage' ? reg : `${reg} Heritage`}</option>
                      ))}
                    </select>"""

text = text.replace(bad_edit_cat, good_edit_cat)
text = text.replace(bad_edit_reg, good_edit_reg)

bad_add_cat = """                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as CategoryName)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Habesha Kemis">Habesha Kemis</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Bags">Bags</option>
                      <option value="Sweaters">Sweaters</option>
                    </select>"""

good_add_cat = """                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as CategoryName)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      {['Habesha Kemis', "Men's Traditional Wear", "Children's Wear", 'Wedding Collection', 'Jewelry', 'Scarves', 'Shoes', 'Bags', 'T-Shirts', 'Sweaters'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>"""

bad_add_reg = """                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as RegionName)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Amhara">Amhara Heritage</option>
                      <option value="Tigray">Tigray Heritage</option>
                      <option value="Oromo">Oromo Heritage</option>
                      <option value="Gurage">Gurage Heritage</option>
                      <option value="Harari">Harari Heritage</option>
                      <option value="National Heritage">National Heritage</option>
                    </select>"""

good_add_reg = """                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as RegionName)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      {['Amhara', 'Tigray', 'Oromo', 'Gurage', 'Harari', 'Sidama', 'Wolayta', 'Afar', 'National Heritage'].map(reg => (
                        <option key={reg} value={reg}>{reg === 'National Heritage' ? reg : `${reg} Heritage`}</option>
                      ))}
                    </select>"""

text = text.replace(bad_add_cat, good_add_cat)
text = text.replace(bad_add_reg, good_add_reg)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(text)
