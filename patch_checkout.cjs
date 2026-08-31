const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

const oldDestructure = `  const { cart, cartSubtotal, formatPrice, clearCart, user, showToast, requireAuth } = useApp();`;
const newDestructure = `  const { cart, cartSubtotal, formatPrice, clearCart, user, showToast, requireAuth, currencyMode, exchangeRate } = useApp();`;

const oldCheckoutCall = `        if (paymentMethod === 'CHAPA') {
          // Initialize Chapa Hosted Checkout passing the generated order info
          const resChapa = await PaymentService.createChapaCheckout({
            ...payload,
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber
          });`;

const newCheckoutCall = `        if (paymentMethod === 'CHAPA') {
          const paymentAmount = currencyMode === 'USD' 
            ? Math.max(1, Math.round(totalAmount / exchangeRate)) 
            : totalAmount;

          // Initialize Chapa Hosted Checkout passing the generated order info
          const resChapa = await PaymentService.createChapaCheckout({
            ...payload,
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber,
            paymentCurrency: currencyMode,
            paymentAmount: paymentAmount
          });`;

content = content.replace(oldDestructure, newDestructure);
content = content.replace(oldCheckoutCall, newCheckoutCall);

fs.writeFileSync('src/pages/Checkout.tsx', content);
console.log('Fixed checkout.tsx');
