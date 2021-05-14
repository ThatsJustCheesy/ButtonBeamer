module.exports = function keycodeToMessage(keycode) {
  switch (keycode) {
  case 'W': return ['button', 'CLASSIC_A'];
  case 'S': return ['button', 'CLASSIC_B'];
  case 'A': return ['analog_motion', 'CLASSIC_LEFT_STICK_LEFT'];
  case 'D': return ['analog_motion', 'CLASSIC_LEFT_STICK_RIGHT'];
  case 'J': return ['button', 'CLASSIC_L'];
  case 'K': return ['button', 'CLASSIC_R'];
  case 'L': return ['button', 'CLASSIC_X'];
  case 'ArrowUp': return ['analog_motion', 'CLASSIC_LEFT_STICK_UP'];
  case 'ArrowDown': return ['analog_motion', 'CLASSIC_LEFT_STICK_DOWN'];
  case 'ArrowLeft': return ['analog_motion', 'CLASSIC_LEFT_STICK_LEFT'];
  case 'ArrowRight': return ['analog_motion', 'CLASSIC_LEFT_STICK_RIGHT'];
  case 'H': return ['button', 'HOME'];
  case 'P': return ['button', 'CLASSIC_PLUS'];
  case 'N': return ['button', 'WIIMOTE_A'];
  case 'F4': return ['emulator_control', 'power_off'];
  default: return null;
  }
};