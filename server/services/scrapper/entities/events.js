/**
 * Связь в простое теряется каждые 6 минут
 * */

const setActivity = {
  H: 'ControlService',
  M: 'SetConnectionActivity',
  A: [
    {
      session_id: '02c5a049-e4da-45bc-a57c-d4d78ddbb4e4',
      lk_id: 'd26f7572-ecb9-4700-b4b7-3ce379bbe030',
      api_version: '1',
    },
  ],
  I: 2, // увеличивается каждую минуту
};

const простой = {
  device_id: 61739,
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    geo: {
      lat: 54.72671,
      lon: 20.47481,
      geo_ignition_switch: 'Unknown',
      gps_state: 'Actual',
    },
  },
};

const охранаВкл = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    guard: 'SafeGuardOff',
    central_lock: 'Open',
    general_system_state_update_time: '2023-03-10T08:33:55.365094Z',
  },
};

const охранаВыкл = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    guard: 'SafeGuardOn',
    central_lock: 'Close',
    general_system_state_update_time: '2023-03-10T08:56:56.6812032Z',
  },
};

const дверьВодилыОткрыта = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    driver_door: 'Open',
    general_system_state_update_time: '2023-03-10T08:33:56.6480704Z',
  },
};

const трекСтарт = {
  device_state: {
    current_track: {
      state: 'StopOver',
      start_time: '2023-03-10T08:33:56Z',
    },
  },
};

const дверьВодилыЗакрыта = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    driver_door: 'Close',
    general_system_state_update_time: '2023-03-10T08:33:58.8876362Z',
  },
};

const gpsАктуалОбразецТрека = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    geo: {
      lat: 54.77473,
      lon: 20.60656,
      geo_ignition_switch: 'Unknown',
      gps_state: 'Actual',
    },
  },
};

const зажигшаниеOn = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    antihijack: 'OnWithoutLocking',
    ignition_switch: 'EngineStarting',
    general_system_state_update_time: '2023-03-10T08:34:36.1795726Z',
  },
};
const зажиганиеOff_1 = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    ignition_switch: 'EngineOffKeyOnAcc',
    general_system_state_update_time: '2023-03-10T08:34:35.4011431Z',
  },
};

const зажиганиеOff_2 = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    coordinates_source: 'GPS',
    ignition_switch: 'EngineOffKeyOnAcc',
    verification_mode: 'RFIDTagOrPinCode',
    puk_required_on_valet: true,
    general_system_state_update_time: '2023-03-10T08:56:44.0623422Z',
    autolaunch_ready: 'On',
    autolaunch_not_ready_code: 'Unknown',
    outside_temp: null,
    outside_temp_raw: 255,
    general_system_state_ext_update_time: '2023-03-10T08:56:44.0623448Z',
    valet_on_distance: 10,
    speed: 0,
    rpm: 0,
    service_state_ext_update_time: '2023-03-10T08:56:44.0623472Z',
  },
};

const стоянка = {
  device_state: {
    current_track: {
      state: 'Parking',
      start_time: '2023-03-10T08:19:37Z',
    },
  },
};

const скорость = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    speed: 41,
    rpm: 2200,
    service_state_ext_update_time: '2023-03-10T08:34:53.5704377Z',
  },
};

const обороты = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    rpm: 950,
    service_state_ext_update_time: '2023-03-10T08:56:11.1350583Z',
  },
};

const паркинг = {
  device_state: {
    serial_no: '1T1G43IA',
    connected: true,
    coordinates_source: 'GPS',
    central_lock: 'Open',
    general_system_state_update_time: '2023-03-10T08:56:42.4054508Z',
    gear_in_park_mode: 'On',
    general_system_state_ext_update_time: '2023-03-10T08:56:42.4054544Z',
    valet_on_distance: 10,
  },
};
