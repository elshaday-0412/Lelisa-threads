const fs = require('fs');
let content = fs.readFileSync('src/pages/UserDashboard.tsx', 'utf8');

const oldFetch = `  useEffect(() => {
    async function fetchAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const oList = await OrderService.getOrders(user.id);
        setOrders(oList);

        let wList = await WishlistService.getWishlist(user.id);
        if (wList.length === 0 && wishlistIds.length > 0) {
          const allRes = await ExternalInventoryService.getProducts({ limit: 100 });
          wList = (allRes.products || []).filter(p => wishlistIds.includes(p.id));
        }
        setWishlistProducts(wList);
      } catch (err) {
        console.error('Failed fetching user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, [user, wishlistIds]);`;

const newFetch = `  useEffect(() => {
    async function fetchAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const oList = await OrderService.getOrders(user.id);
        setOrders(oList);
      } catch (err) {
        console.error('Failed fetching user orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccountData();
  }, [user]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        return;
      }
      try {
        const allRes = await ExternalInventoryService.getProducts({ limit: 100 });
        const wList = (allRes.products || []).filter(p => wishlistIds.includes(p.id));
        setWishlistProducts(wList);
      } catch (err) {
        console.error('Failed fetching wishlist products', err);
      }
    }
    fetchWishlistProducts();
  }, [wishlistIds]);`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync('src/pages/UserDashboard.tsx', content);
console.log('Fixed UserDashboard fetch logic');
