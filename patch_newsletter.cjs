const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const oldNewsletter = `  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Subscribed to VIP Drops', 'Thank you for joining Wanofi Design heritage circle.', 'success');
  };`;

const newNewsletter = `  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Subscribed to VIP Drops', 'Thank you for joining Wanofi Design heritage circle.', 'success');
    e.currentTarget.reset();
  };`;

content = content.replace(oldNewsletter, newNewsletter);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log('Fixed Footer Newsletter reset');
