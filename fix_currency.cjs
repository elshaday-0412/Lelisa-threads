const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const oldFormatPrice = `  // Convert ETB to USD luxury format if USD toggle is active (1 USD ≈ 120 ETB)
  const formatPrice = (amountInBirr: number) => {
    if (currencyMode === 'USD') {
      const usd = Math.round(amountInBirr / 40); // displaying proportional luxury price in $ around $350-$450
      return \`$\${usd.toLocaleString()}\`;
    }
    return \`\${amountInBirr.toLocaleString()} ETB\`;
  };`;

const newFormatPrice = `  const [exchangeRate, setExchangeRate] = useState<number>(120);

  useEffect(() => {
    // Fetch real-time exchange rate on load
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.ETB) {
          setExchangeRate(data.rates.ETB);
        }
      })
      .catch(err => console.warn('Failed to fetch exchange rate, using fallback.', err));
  }, []);

  // Convert ETB to USD using real-time rate
  const formatPrice = (amountInBirr: number) => {
    if (currencyMode === 'USD') {
      const usd = Math.max(1, Math.round(amountInBirr / exchangeRate)); 
      return \`$\${usd.toLocaleString()}\`;
    }
    return \`\${amountInBirr.toLocaleString()} ETB\`;
  };`;

content = content.replace(oldFormatPrice, newFormatPrice);
fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Fixed currency conversion');
