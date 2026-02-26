const puppeteer = require('puppeteer');

(async () => {
    // Launch browser in headless mode
    console.log("Launching browser to analyze pixel traffic...");
    const browser = await puppeteer.launch({
        headless: 'new', // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let eventCount = 0;
    // Intercept network requests
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const url = request.url();
        if (url.includes('facebook.com/tr') || url.includes('connect.facebook.net')) {
            console.log(`\n[FACEBOOK PIXEL HTTP REQUEST CATCHED] -> ${url}`);
            eventCount++;

            // Try to extract the event name if it's in the query params (ev=PageView)
            const urlObj = new URL(url);
            const ev = urlObj.searchParams.get('ev');
            if (ev) {
                console.log(`=> EVENT RECORDED: ${ev}`);
            }
        }
        request.continue();
    });

    console.log("Navigating to https://aliminlomasdelmar.com/?test_event_code=TEST82282");
    // Go to the website
    await page.goto('https://aliminlomasdelmar.com/?test_event_code=TEST82282', {
        waitUntil: 'networkidle2', // Wait until network is quiet
        timeout: 30000
    });

    console.log("\nWaiting 5 seconds for pixel to finish firing...");
    await new Promise(r => setTimeout(r, 5000));

    console.log(`\nTesting complete. Caught ${eventCount} Facebook tracking requests.`);

    await browser.close();
})();
