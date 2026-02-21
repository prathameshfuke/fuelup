const https = require('https');

https.get('https://www.google.com/search?q=petrol+price+in+mumbai', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // console.log(data);
        const match = data.match(/₹\s*([0-9]{2,3}\.[0-9]{2})/);
        if (match) {
            console.log("Petrol from Google:", match[1]);
        } else {
            console.log("Not found in HTML");
            // Print snippets that might contain the price
            const index = data.indexOf('104.21');
            if (index > -1) {
                console.log("Found 104.21 at index", index);
                console.log(data.substring(index - 50, index + 50));
            } else {
                console.log("104.21 not found");
            }
        }
    });
}).on('error', err => console.error(err));
