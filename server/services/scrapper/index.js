const puppeteer = require('puppeteer');
const signalModel = require('../../models/signal');
const deviceStateModel = require('../../models/deviceState');
const { tr } = require('date-fns/locale');

module.exports = async () => {
  /** Подготовка стейта  */

  const serviceUrl = process.env.SERVICE_IRL;

  // debug window.dozor._dozor._garage._devices.get(61739)._map._markers.get(61739)

  const injectionScript = `
  setInterval(() => {
      const device = window.dozor._dozor._garage._devices.get(61739);
      const state = device._device_info.state;
      const states = device._states;
      const geo = device._map._markers.get(61739)._geo.coords;
      
      console.log('DOZOR', {
        connected: states?.connected,
        geo: geo,
        guard: states.guard,
        ignition: states.ignition,
        driver_door: states.door_fl,
        front_pass_door: states.door_fr,
        rear_left_door: states.door_rl,
        rear_right_door: states.door_rr,
        trunk: states.trunk,
        hood: states.hood,
      });
    }, 3000);
  `;

  let deviceStateRemote = await deviceStateModel.findOne().lean();

  if (!deviceStateRemote) {
    const createdRemote = {
      createdAt: null,
      connected: false,
      geo: { lat: 0, lon: 0 },
      guard: true,
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
    args: ['--no-sandbox'],
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

      await page.waitForSelector('.device__image');

      break;
    } catch (e) {
      await page.reload(serviceUrl);

      continue;
    }
  }

  /** --------- Логика страницы и интервальная перезагрузка ------------- */

  const pagelogic = async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    /** Инъекция скрипта */
    await page.addScriptTag({
      content: injectionScript,
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

        if (signal.ignition !== null) {
          deviceState = { ...signal };

          if (JSON.stringify(deviceState) !== JSON.stringify(prevDeviceState)) {
            await signalModel.create({ ...deviceState, timestamp: Date.now() });
            await deviceStateModel.findOneAndUpdate(deviceState);

            prevDeviceState = deviceState;
          }
        }
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
    }, 1000 * 60); // 1 мин
  };

  await pagelogic();

  setInterval(async () => {
    await pagelogic();
  }, 1000 * 60 * 30); // 30 мин
};
