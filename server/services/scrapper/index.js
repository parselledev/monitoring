const puppeteer = require('puppeteer');
const signalModel = require('../../models/signal');
const deviceStateModel = require('../../models/deviceState');
const lodashIsEqual = require('lodash/isEqual');
const { tr, ca } = require('date-fns/locale');

module.exports = async () => {
  /** Подготовка стейта  */

  const serviceUrl = process.env.SERVICE_IRL;

  // debug window.dozor._dozor._garage._devices.get(61739)._map._markers.get(61739)

  const injectionScript = `
  console.log('injected');
  setInterval(() => {
    const connected =
      window.dozor._dozor._garage._devices.get(61739)?._states?.connected ||
      false;

    if (!connected) {
      const device = window.dozor._dozor._garage._devices.get(61739);
      const states = device?._states;
      const geo = device?._control._device_info.state.geo;
      
      console.log('DOZOR', {
        geo: {
          lat: geo.lat,
          lon: get.lon 
        },
        guard: states.guard,
        ignition: states.ignition,
        driver_door: states.door_fl,
        front_pass_door: states.door_fr,
        rear_left_door: states.door_rl,
        rear_right_door: states.door_rr,
        trunk: states.trunk,
        hood: states.hood,
      });
      
      window.dozor.run(window.dozor._session);
    }
  }, 1000 * 30); // 30 сек

  setInterval(() => {
    const device = window.dozor._dozor._garage._devices.get(61739);
    const states = device?._states;
    const geo = device?._map?._markers.get(61739)?._geo?.coords;

    if (states.guard !== null && geo) {
      console.log('DOZOR', {
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
    }
  }, 1000 * 2);
  `;

  let deviceStateRemote = await deviceStateModel.findOne().lean();

  if (!deviceStateRemote) {
    const createdRemote = {
      geo: { lat: 0, lon: 0 },
      guard: false,
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
  delete deviceStateRemote.__v;
  delete deviceStateRemote.time;

  let deviceState = deviceStateRemote;

  /** Создание браузера */

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox'],

    // headless: false,
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

      const tryClick = setInterval(async () => {
        try {
          await page.waitForSelector('.btn-primary', { visible: true });
          await page.$eval('.btn-primary', async (elem) => await elem.click());
        } catch (e) {}
      }, 1000);

      await page.waitForSelector('.device__image');

      await clearInterval(tryClick);

      break;
    } catch (e) {
      await page.reload(serviceUrl);

      continue;
    }
  }

  /** --------- Логика страницы и интервальная перезагрузка ------------- */

  const pageLogic = async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    /** Инъекция скрипта */
    await page.addScriptTag({
      content: injectionScript,
    });

    /** Ожидание кнопки для выхода из сна */
    setInterval(async () => {
      try {
        await page.$eval(
          '.forms__button_warning',
          async (elem) => await elem.click()
        );
      } catch (e) {}
    }, 1000 * 60 * 2); // 2 мин

    /** Отслеживание консоли */
    await page.on('console', async (msg) => {
      try {
        const args = msg.args();
        const vals = [];

        if (msg.text().includes('DOZOR')) {
          for (let i = 0; i < args.length; i++) {
            vals.push(await args[i].jsonValue());
          }

          const signal = vals.map((v) =>
            typeof v === 'object' ? JSON.parse(JSON.stringify(v, null, 2)) : v
          )[1];

          // if (typeof signal.ignition === 'boolean') {
          if (!lodashIsEqual(deviceState, signal)) {
            // if (signal.guard === 'true' && deviceState.guard === 'true') {
            //   return null;
            // } else {
            if (signal.guard === null) {
              deviceState = {
                ...signal,
                guard: deviceState.guard,
                ignition: deviceState.ignition,
                driver_door: deviceState.door_fl,
                front_pass_door: deviceState.door_fr,
                rear_left_door: deviceState.door_rl,
                rear_right_door: deviceState.door_rr,
                trunk: deviceState.trunk,
                hood: deviceState.hood,
              };
            } else {
              deviceState = signal;
            }

            await signalModel.create({ ...deviceState });
            await deviceStateModel.findOneAndUpdate(deviceState);
            // }
          }
          // }
        }
      } catch (e) {}
    });
  };

  await pageLogic();

  setInterval(async () => {
    try {
      await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
      await pageLogic();
    } catch (e) {}
  }, 1000 * 60 * 20); // 20 мин
};
