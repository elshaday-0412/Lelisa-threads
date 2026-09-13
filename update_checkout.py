import re

with open('src/pages/Checkout.tsx', 'r') as f:
    c = f.read()

c = c.replace(">Your Bag is Empty<", ">{t.checkoutEmptyTitle}<")
c = c.replace(">Order Reference<", ">{t.orderReference}<")
c = c.replace(">Payment Gateway<", ">{t.paymentGateway}<")
c = c.replace(">Transaction Reference<", ">{t.transactionReference}<")
c = c.replace(">Authorization Code<", ">{t.authCode}<")
c = c.replace(">Card Billed<", ">{t.cardBilled}<")
c = c.replace(">Mobile Wallet Number<", ">{t.walletNumber}<")
c = c.replace(">Total Paid<", ">{t.totalPaid}<")
c = c.replace(">Receipt issued:", ">{t.receiptIssued}")
c = c.replace(">Chapa Secure Digital Payment<", ">{t.chapaDigitalMethod}<")
c = c.replace(">You will be securely redirected to Chapa to complete your payment via <strong>Telebirr</strong>, <strong>CBE Birr</strong>, <strong>Awash Birr</strong>, or <strong>Visa/Mastercard</strong>.<", ">{t.chapaDesc}<")
c = c.replace(">Addis Ababa Doorstep Delivery<", ">{t.codMethod}<")
c = c.replace(">You will pay via Cash or direct CBE Mobile transfer upon receiving your garment. Please ensure someone is present at the delivery address.<", ">{t.codDesc}<")
c = c.replace(">Cancellation & Refund Policy:<", ">{t.cancellationPolicy}<")
c = c.replace(">Cancellation Policy:<", ">{t.cancellationPolicyCod}<")
c = c.replace(">Cancelled digital payments are automatically refunded to your original payment method (Telebirr/Card) within 3-5 business days.<", ">{t.chapaRefundPolicy}<")
c = c.replace(">If you wish to cancel at the door, a small 150 ETB delivery fee may apply to compensate our drivers.<", ">{t.codCancelFee}<")
c = c.replace('placeholder="e.g. Sara Tadesse"', '')
c = c.replace('placeholder="e.g. name@gmail.com"', '')

with open('src/pages/Checkout.tsx', 'w') as f:
    f.write(c)

print('Checkout updated')
