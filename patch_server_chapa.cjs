const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldDestructure = `        shippingCost,
        totalAmount
      } = req.body;`;

const newDestructure = `        shippingCost,
        totalAmount,
        paymentCurrency,
        paymentAmount
      } = req.body;`;

const oldChapaPayload = `      const formattedAmount = String(Number(totalAmount).toFixed(2));
      const formattedPhone = cleanPhoneForChapa(customerPhone);

      // Construct clean Chapa payload.
      const chapaPayload: Record<string, any> = {
        amount: formattedAmount,
        currency: 'ETB',`;

const newChapaPayload = `      const finalCurrency = paymentCurrency === 'USD' ? 'USD' : 'ETB';
      const finalAmount = (paymentCurrency === 'USD' && paymentAmount) 
        ? String(Number(paymentAmount).toFixed(2)) 
        : String(Number(totalAmount).toFixed(2));
      
      const formattedAmount = finalAmount;
      const formattedPhone = cleanPhoneForChapa(customerPhone);

      // Construct clean Chapa payload.
      const chapaPayload: Record<string, any> = {
        amount: formattedAmount,
        currency: finalCurrency,`;

content = content.replace(oldDestructure, newDestructure);
content = content.replace(oldChapaPayload, newChapaPayload);
fs.writeFileSync('server.ts', content);
console.log('Fixed server.ts chapa currency');
