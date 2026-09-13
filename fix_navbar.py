import re

with open('src/components/Navbar.tsx', 'r') as f:
    text = f.read()

bad = """          {/* Search Field or Expand Trigger */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
              <input
                type="text"
                autoFocus
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-36 sm:w-56 md:w-64 pl-3 pr-8 py-1.5 text-xs bg-white dark:bg-[#222] border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A] dark:text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2.5 text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : ("""

good = """          {/* Search Field or Expand Trigger */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center animate-in fade-in zoom-in-95 duration-150">
              <input
                type="text"
                autoFocus
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-48 sm:w-56 md:w-64 pl-3 pr-8 py-1.5 text-xs bg-white dark:bg-[#222] border border-[#E5E1DA] dark:border-[#3D3D3D] rounded-sm focus:outline-none focus:border-[#C5A059] text-[#1A1A1A] dark:text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2.5 text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : ("""

text = text.replace(bad, good)

bad2 = """            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
              aria-label="Search items"
            >"""

good2 = """            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex p-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A059] transition-colors items-center gap-1.5"
              aria-label="Search items"
            >"""
            
text = text.replace(bad2, good2)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(text)
