const https = require('https');

function fetchPrice(url, regex, name) {
    https.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (res.statusCode !== 200) {
                console.log(`${name} HTTP Failed: ${res.statusCode}`);
                return;
            }
            const match = data.match(regex);
            if (match) {
                console.log(`${name} MATC! : ${match[1] || match[0]}`);
            } else {
                console.log(`${name} Regex failed. Title:`, data.match(/<title>(.*?)<\/title>/)?.[1]);
            }
        });
    }).on('error', err => console.error(`${name} Error`, err));
}

fetchPrice('https://www.financialexpress.com/auto/fuel-price/petrol-price-in-mumbai/', /₹\s*([0-9]{2,3}\.[0-9]{2})/, 'FinancialExpress');
fetchPrice('https://timesofindia.indiatimes.com/business/petrol-price-in-mumbai', /₹\s*([0-9]{2,3}\.[0-9]{2})/, 'TimesOfIndia');
fetchPrice('https://www.carwale.com/petrol-price-in-mumbai/', /₹\s*([0-9]{2,3}\.[0-9]{2})/, 'CarWale');
fetchPrice('https://www.cartoq.com/fuel-prices/mumbai-petrol-price/', /₹\s*([0-9]{2,3}\.[0-9]{2})/, 'Cartoq');
