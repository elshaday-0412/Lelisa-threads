import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const regex = /if \(erpConfig\.url && erpConfig\.apiKey\) \{\n\s*try \{\n\s*const payload = \{[\s\S]*?res\.status\(201\)\.json\(newProd\);\n\s*\}\);/g;

const replacement = `if (erpConfig.url && erpConfig.apiKey) {
        try {
          const headers = {
            'Content-Type': 'application/json',
            'x-api-key': erpConfig.apiKey,
            'X-Inventory-Api-Key': erpConfig.apiKey
          };
          await axios.post(\`\${erpConfig.url}/api/public/orders/cancel\`, { externalOrderId }, { headers, timeout: 5000 });
          console.log(\`[ERP CANCEL SYNC] Sent cancel for \${externalOrderId}\`);
        } catch (erpErr: any) {
          console.warn(\`[ERP CANCEL SYNC ERROR] Failed for \${externalOrderId}:\`, erpErr.message);
        }
      }
      res.json({ success: true });
    } catch (err: any) {
      console.warn('Manual ERP cancel dispatch error:', err.message);
      res.status(500).json({ error: 'Failed to dispatch cancel to ERP' });
    }
  });

  // POST /api/orders
  app.post('/api/orders', (req, res) => {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      region,
      items,
      subtotal,
      shippingCost,
      totalAmount,
      paymentMethod,
      isPaid,
      txRef
    } = req.body;

    const newOrder: any = {
      id: \`ord-\${Date.now()}\`,
      orderNumber: \`HT-\${Math.floor(100000 + Math.random() * 900000)}\`,
      userId: userId || 'guest',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      region,
      status: 'received',
      paymentMethod,
      isPaid: Boolean(isPaid),
      txRef,
      subtotal,
      shippingCost,
      totalAmount,
      createdAt: new Date().toISOString(),
      items: items || []
    };

    orders.unshift(newOrder);

    // Asynchronously transmit order to ERP server
    if (newOrder.status === 'PROCESSING' || newOrder.isPaid) {
      sendOrderToErp(newOrder).catch(err => {
        console.warn('ERP order dispatch error:', err);
      });
    }

    res.status(201).json(newOrder);
  });

  // GET /api/orders/:id
  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  // PUT /api/orders/:id/status
  app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    res.json(order);
  });

  // DELETE /api/orders/:id
  app.delete('/api/orders/:id', (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Order not found' });
    const deleted = orders.splice(index, 1)[0];
    res.json({ success: true, deleted });
  });

  // GET /api/admin/stats
  app.get('/api/admin/stats', (req, res) => {
    res.json({
      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),
      totalOrders: orders.length,
      recentOrders: orders.slice(0, 8)
    });
  });

  // POST /api/products
  app.post('/api/products', async (req, res) => {
    const prodData = req.body;
    const newProd: Product = {
      ...prodData,
      id: \`prod-\${Date.now()}\`,
      slug: (prodData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };

    if (erpConfig.url && erpConfig.apiKey) {
      try {
        const payload = {
          productName: newProd.name,
          category: newProd.category,
          price: newProd.price,
          stock: newProd.stock || 10,
          description: newProd.description,
          sku: newProd.id
        };
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': erpConfig.apiKey,
          'X-Inventory-Api-Key': erpConfig.apiKey
        };
        
        console.log(\`[ERP SYNC] Pushing new product \${newProd.name} to ERP...\`);
        const endpointsToTry = [
          \`/api/products\`,
          \`/products\`,
          \`/api/public/products\`,
          \`/api/public/catalog\`,
          \`/api/inventory/products\`
        ];
        
        let success = false;
        for (const ep of endpointsToTry) {
          if (success) break;
          console.log(\`[ERP SYNC] Trying POST \${ep}...\`);
          try {
            const erpRes = await axios.post(\`\${erpConfig.url}\${ep}\`, payload, { headers, timeout: 5000 });
            if (erpRes.data && (erpRes.data.id || erpRes.data.success || erpRes.data.product)) {
              newProd.id = String(erpRes.data.id || (erpRes.data.product && erpRes.data.product.id) || newProd.id);
              success = true;
              console.log(\`[ERP SYNC] Successfully pushed product to ERP using \${ep}\`);
            } else if (erpRes.status >= 200 && erpRes.status < 300) {
              success = true;
              console.log(\`[ERP SYNC] Successfully pushed product to ERP using \${ep} (no ID returned)\`);
            }
          } catch (e: any) {
             console.warn(\`[ERP SYNC] POST \${ep} failed with status \${e.response?.status}\`);
          }
        }
        
        if (!success) {
           console.warn('[ERP SYNC ERROR] Failed to push new product to ERP on all known endpoints');
        }
      } catch (err: any) {
        console.warn('[ERP SYNC ERROR] Unexpected error pushing to ERP:', err.message);
      }
    }

    products.unshift(newProd);
    // Also save it in localOverrides so it's not lost on next fetch
    localOverrides[newProd.id] = newProd;
    
    res.status(201).json(newProd);
  });`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log("Restored missing routes!");
