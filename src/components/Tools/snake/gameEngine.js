// Game engine utilities and state management
export const createGameEngine = () => ({
  m: Math,
  state: 'play',
  states: {},
  config: {
    title: 'Snakely',
    debug: false,
    state: 'play'
  },

  // Math utilities
  rand() { return Math.random(); },
  floor(n) { return Math.floor(n); },
  sin(n) { return Math.sin(n); },
  max(a, b) { return Math.max(a, b); },
  min(a, b) { return Math.min(a, b); },

  // State management
  addState(state) {
    this.states[state.name] = state;
  },

  setState(name) {
    if (this.state && this.states[this.state]) {
      this.states[this.state].exit();
    }
    this.state = name;
    if (this.states[this.state]) {
      this.states[this.state].init();
    }
  },

  // Canvas utilities
  createCanvas(container, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    return { canvas, ctx };
  },

  // Input handling
  createInputHandler(keyMap) {
    return (event) => {
      const direction = keyMap[event.key];
      if (direction) {
        return direction;
      }
      return null;
    };
  },

  // Animation utilities
  requestFrame(callback, delay = 100) {
    return setTimeout(() => requestAnimationFrame(callback), delay);
  }
});
