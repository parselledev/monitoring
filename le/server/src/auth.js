import puppeteer from "puppeteer";

/**
 * кнопка реконнекта .forms__button forms__button_warning
 * */

export const auth = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://monitoring.tecel.ru", { waitUntil: "networkidle2" });
  await page.waitForSelector("#tecel-passport");

  /** Для доступа по логину и паролю */

  // await page.type("input[type='text']", process.env.DOZOR_LOGIN);
  // await page.$eval(".btn-primary", async (elem) => await elem.click());
  //
  // await page.waitForSelector("input[type='password']", { visible: true });
  // await page.type("input[type='password']", process.env.DOZOR_PASSWORD);

  // await page.$eval(".btn-primary", async (elem) => await elem.click());

  /** ----------------------------------- */

  await page.$eval(".btn-secondary", async (elem) => await elem.click());

  await page.waitForSelector(".geomap-marker__arrow");

  const dozor = await page.evaluate(() => {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
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
