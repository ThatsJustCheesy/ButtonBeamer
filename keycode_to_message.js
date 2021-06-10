const defaultProfile = {
  'W': ['button', 'WIIMOTE_1'],
  'Q': ['button', 'WIIMOTE_2'],
  'Tab': ['button', 'WIIMOTE_A'],
  'E': ['button', 'WIIMOTE_B'],
  'ArrowUp': ['button', 'WIIMOTE_RIGHT'],
  'ArrowDown': ['button', 'WIIMOTE_LEFT'],
  'ArrowLeft': ['button', 'WIIMOTE_UP'],
  'ArrowRight': ['button', 'WIIMOTE_DOWN'],

  'H': ['button', 'HOME'],
  'P': ['button', 'WIIMOTE_PLUS'],
  'O': ['button', 'WIIMOTE_MINUS'],
  'N': ['button', 'WIIMOTE_A'],
  'B': ['button', 'WIIMOTE_B'],

  'Digit1': ['button', 'WIIMOTE_1'],
  'Digit2': ['button', 'WIIMOTE_2'],
  'BracketLeft': ['analog_motion', 'STEER_LEFT'],
  'BracketRight': ['analog_motion', 'STEER_RIGHT'],
  'F4': ['emulator_control', 'power_off'],
};

module.exports = {
  profiles: new Map(),
  profile(userId) {
    const profile = this.profiles.get(userId);
    if (profile) return profile;
    this.profiles.set(userId, defaultProfile);
    return defaultProfile;
  },
  convert(userId, keycode) {
    return this.profile(userId)[keycode];
  },
  map(userId, keycode, commandComponents) {
    this.profile(userId)[keycode] = commandComponents;
  }
};

