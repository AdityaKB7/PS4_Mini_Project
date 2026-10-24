const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log("Navigating to the containerized app...");
        await driver.get('http://localhost:8000');

        console.log("Filling out the student data form...");
        // Numerical inputs
        await driver.findElement(By.name('ssc_p')).sendKeys('85.5');
        await driver.findElement(By.name('hsc_p')).sendKeys('82.0');
        await driver.findElement(By.name('degree_p')).sendKeys('78.0');
        await driver.findElement(By.name('etest_p')).sendKeys('90.0');
        await driver.findElement(By.name('mba_p')).sendKeys('75.0');

        // Categorical inputs (Dropdowns)
        await driver.findElement(By.name('gender')).sendKeys('M');
        await driver.findElement(By.name('ssc_b')).sendKeys('Central');
        await driver.findElement(By.name('hsc_b')).sendKeys('Central');
        await driver.findElement(By.name('hsc_s')).sendKeys('Science');
        await driver.findElement(By.name('degree_t')).sendKeys('Sci&Tech');
        await driver.findElement(By.name('workex')).sendKeys('Yes');
        await driver.findElement(By.name('specialisat')).sendKeys('Mkt&Fin');

        console.log("Submitting the form...");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("Waiting for prediction result...");
        // Wait until the result container is visible
        let resultContainer = await driver.wait(until.elementLocated(By.id('result-container')), 8000);
        await driver.wait(until.elementIsVisible(resultContainer), 8000);

        let resultText = await resultContainer.getText();
        console.log(`\n✅ TEST PASSED! The model predicted: "${resultText}"\n`);

    } catch (error) {
        console.error("❌ TEST FAILED:", error);
        process.exit(1);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

runTest();