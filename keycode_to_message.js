module.exports = function keycodeToMessage(keycode) {
  switch (keycode) {
  case 'W': return ['button', 'WIIMOTE_1'];
  case 'Q': return ['button', 'WIIMOTE_2'];
  case 'Tab': return ['button', 'WIIMOTE_A'];
  case 'E': return ['button', 'WIIMOTE_B'];
  case 'ArrowUp': return ['button', 'WIIMOTE_RIGHT'];
  case 'ArrowDown': return ['button', 'WIIMOTE_LEFT'];
  case 'ArrowLeft': return ['button', 'WIIMOTE_UP'];
  case 'ArrowRight': return ['button', 'WIIMOTE_DOWN'];
  
  case 'H': return ['button', 'HOME'];
  case 'P': return ['button', 'WIIMOTE_PLUS'];
  case 'O': return ['button', 'WIIMOTE_MINUS'];
  
  case 'N': return ['button', 'WIIMOTE_A'];
  case 'B': return ['button', 'WIIMOTE_B'];
  case 'Digit1': return ['button', 'WIIMOTE_1'];
  case 'Digit2': return ['button', 'WIIMOTE_2'];
  case 'BracketLeft': return ['analog_motion', 'STEER_LEFT'];
  case 'BracketRight': return ['analog_motion', 'STEER_RIGHT'];
  
  case 'F4': return ['emulator_control', 'power_off'];
  default: return null;
  }
};
