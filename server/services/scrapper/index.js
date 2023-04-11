const puppeteer = require('puppeteer');
const signalModel = require('../../models/signal');
const deviceStateModel = require('../../models/deviceState');

module.exports = async () => {
  /** Подготовка стейта  */

  const serviceUrl = process.env.SERVICE_IRL;

  let deviceStateRemote = await deviceStateModel.findOne().lean();

  if (!deviceStateRemote) {
    const createdRemote = {
      createdAt: null,
      geo: { lat: 0, lon: 0 },
      guard: 'SafeGuardOn',
      ignition: false,
      driver_door: false,
      front_pass_door: false,
      rear_left_door: false,
      rear_right_door: false,
      trunk: false,
      hood: false,
    };
    await deviceStateModel.create(createdRemote);

    deviceStateRemote = createdRemote;
  }

  delete deviceStateRemote._id;
  delete deviceStateRemote.updatedAt;
  delete deviceStateRemote.createdAt;

  let deviceState = deviceStateRemote;
  let prevDeviceState = deviceStateRemote;

  /** Создание браузера */

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

  /** Авторизация */
  while (true) {
    try {
      await page.goto(serviceUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#tecel-passport');

      await page.type("input[type='text']", process.env.DOZOR_LOGIN);
      await page.$eval('.btn-primary', async (elem) => await elem.click());

      await page.waitForSelector("input[type='password']", { visible: true });
      await page.type("input[type='password']", process.env.DOZOR_PASSWORD);

      await page.$eval('.btn-primary', async (elem) => await elem.click());

      // await page.waitForSelector('.geomap-marker__arrow');

      break;
    } catch (e) {
      await page.reload(serviceUrl);

      continue;
    }
  }

  /** Инъекция скрипта */
  await page.addScriptTag({
    content: `setInterval(() => {
      const device = window.dozor._dozor._garage._devices.get(61739)
      const state = device._device_info.state
      const states = device._states
      
      console.log('DOZOR', {
        geo: {
          lat: state.geo.lat,
          lon: state.geo.lon
        },
        guard: state.guard,
        ignition: states.ignition,
        driver_door: states.door_fl,
        front_pass_door: states.door_fr,
        rear_left_door: states.door_rl,
        rear_right_door: states.door_rr,
        trunk: states.trunk,
        hood: states.hood,
      });
    }, 3000);`,
  });

  /** Отслеживание консоли */
  await page.on('console', async (msg) => {
    const args = msg.args();
    const vals = [];

    if (msg.text().includes('DOZOR')) {
      for (let i = 0; i < args.length; i++) {
        vals.push(await args[i].jsonValue());
      }

      const signal = vals.map((v) =>
        typeof v === 'object' ? JSON.parse(JSON.stringify(v, null, 2)) : v
      )[1];

      const mergedSignal = {};

      for (const [key, value] of Object.entries(deviceState)) {
        mergedSignal[key] = signal[key] || value;
      }

      deviceState = { ...mergedSignal };

      await signalModel.create({ ...deviceState, timestamp: Date.now() });
      await deviceStateModel.findOneAndUpdate(deviceState);
    }
  });

  /** Ожидание кнопки для выхода из сна */
  setInterval(async () => {
    await page.waitForSelector('.forms__button_warning', {
      visible: true,
      timeout: 0,
    });
    await page.$eval(
      '.forms__button_warning',
      async (elem) => await elem.click()
    );
  }, 1000 * 60 * 2);
};
