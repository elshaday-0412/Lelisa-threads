import fs from 'fs';

let content = fs.readFileSync('src/services/firebaseService.ts', 'utf-8');

const newMethods = `
  subscribeToOrders(userId: string | undefined, onUpdate: (orders: Order[]) => void): () => void {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      let q = colRef;
      // Note: for robustness with complex rules, we listen to all orders and filter in memory 
      // if it's a small store, or use a strict query if user is defined.
      // To ensure it doesn't fail on missing indexes, we just listen to the query.
      if (userId && userId !== 'guest' && userId !== 'user-customer' && userId !== 'user-admin') {
         q = query(colRef, where('userId', '==', userId)) as any;
      }
      
      return onSnapshot(q, (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach(docSnap => {
          ordersList.push(docSnap.data() as Order);
        });
        
        let result = ordersList;
        if (userId && userId !== 'user-admin') {
          result = ordersList.filter(o => o.userId === userId || o.customerEmail?.toLowerCase() === userId.toLowerCase());
        }
        
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(result);
      }, (err) => {
        console.warn('Orders subscription error:', err);
      });
    } catch (err) {
      console.warn('Could not subscribe to orders', err);
      return () => {};
    }
  },
`;

content = content.replace("async getOrders(userId?: string): Promise<Order[]> {", newMethods + "\n  async getOrders(userId?: string): Promise<Order[]> {");

fs.writeFileSync('src/services/firebaseService.ts', content);
