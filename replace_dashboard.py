import re

with open('src/pages/UserDashboard.tsx', 'r') as f:
    c = f.read()

# Add import
if 'useLanguage' not in c:
    c = c.replace("import { useAppContext } from '../context/AppContext';", "import { useAppContext } from '../context/AppContext';\nimport { useLanguage } from '../context/LanguageContext';")
    c = c.replace("const { user, logout, orders, wishlistIds } = useAppContext();", "const { user, logout, orders, wishlistIds } = useAppContext();\n  const { t } = useLanguage();")

c = c.replace(">Habesha Heritage Circle<", ">{t.habeshaHeritageCircle}<")
c = c.replace(">Welcome, {user.fullName}<", ">{t.welcome} {user.fullName}<")
c = c.replace("Email: {user.email}", "{t.emailLabel} {user.email}")
c = c.replace("Role: {user.role}", "{t.roleLabel} {user.role}")
c = c.replace(">My Orders ({orders.length})<", ">{t.myOrdersTab} ({orders.length})<")
c = c.replace(">Favorites ({wishlistIds.length})<", ">{t.favoritesTab} ({wishlistIds.length})<")
c = c.replace(">Addresses &amp; Profile ({user.addresses.length})<", ">{t.addressesProfileTab} ({user.addresses.length})<")
c = c.replace(">Cancellations &amp; Support<", ">{t.cancellationsSupport}<")
c = c.replace('>You can instantly cancel your order below if its status is still <strong>RECEIVED (NEW)</strong>. Once it changes to "Preparing" or "Shipped", please contact our support team to request a manual cancellation. Refunds for Chapa digital payments are processed within 3-5 business days back to your original payment method. Cash on Delivery orders can be safely cancelled before dispatch.<', ' dangerouslySetInnerHTML={{ __html: t.cancellationsSupportDesc }} />')

c = c.replace(">Your Favorites is Empty<", ">{t.favoritesEmpty}<")
c = c.replace(">Save your favorite kemis, suits, and necklaces for upcoming weddings.<", ">{t.favoritesEmptyDesc}<")
c = c.replace(">Browse Catalog<", ">{t.browseCatalog}<")

with open('src/pages/UserDashboard.tsx', 'w') as f:
    f.write(c)

print("UserDashboard.tsx updated")
