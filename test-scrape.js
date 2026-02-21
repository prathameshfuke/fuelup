const https = require('https');

https.get('https://www.ndtv.com/fuel-prices/petrol-price-in-mumbai-city', {
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/₹\s*([0-9.]+)/i);
        if (match) {
            console.log("Petrol:", match[1]);
        } else {
            console.log("Not found in HTML");
        }
    });
}).on('error', err => console.error(err));
