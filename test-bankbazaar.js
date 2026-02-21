async function testFetch() {
    try {
        const response = await fetch('https://camelcase.in/petrol-price/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const text = await response.text();
        console.log("Status camelcase:", response.status);
    } catch (err) { }

    try {
        const response = await fetch('https://www.bankbazaar.com/fuel/petrol-price-mumbai.html', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const text = await response.text();
        const price = text.match(/₹\s*([0-9]{2,3}\.[0-9]{2})/);
        console.log("BB Price:", price ? price[1] : "No match");
    } catch (err) { }
}
testFetch();
