const puppeteer = require('puppeteer');

module.exports = async () => {
  const serviceUrl = process.env.SERVICE_IRL;

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disable-gpu-shader-disk-cache',
      '--media-cache-size=0',
      '--disk-cache-size=0',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--autoplay-policy=user-gesture-required',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-notifications',
      '--disable-background-networking',
      '--disable-breakpad',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--disable-sync',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  while (true) {
    try {
      await page.goto(serviceUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#tecel-passport');

      await page.type("input[type='text']", process.env.DOZOR_LOGIN);
      await page.$eval('.btn-primary', async (elem) => await elem.click());

      await page.waitForSelector("input[type='password']", { visible: true });
      await page.type("input[type='password']", process.env.DOZOR_PASSWORD);

      await page.$eval('.btn-primary', async (elem) => await elem.click());

      await page.waitForSelector('.geomap-marker__arrow');

      break;
    } catch (e) {
      await page.reload(serviceUrl);

      continue;
    }
  }

  const dozor = await page.evaluate(() => {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }

        return value;
      };
    };

    return JSON.stringify(window.dozor, getCircularReplacer());
  });

  await browser.close();

  return JSON.parse(dozor);
};
