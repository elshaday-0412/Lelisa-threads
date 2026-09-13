import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

bad = """                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-sm bg-[#C5A059]/10 text-[#C5A059] text-xs uppercase tracking-widest font-bold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Admin Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </Link>
                )}"""

good = """                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-sm bg-[#C5A059]/10 text-[#C5A059] text-xs uppercase tracking-widest font-bold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Admin Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </Link>
                )}"""

text = text.replace(bad, good)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
