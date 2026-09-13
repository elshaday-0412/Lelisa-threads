import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

bad1 = """            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center animate-in fade-in zoom-in-95 duration-150">"""
good1 = """            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center animate-in fade-in zoom-in-95 duration-150">"""
text = text.replace(bad1, good1)

bad2 = """              className="hidden sm:flex p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors items-center gap-1.5"
              aria-label="Search items"
            >"""
good2 = """              className="hidden md:flex p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors items-center gap-1.5"
              aria-label="Search items"
            >"""
text = text.replace(bad2, good2)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
