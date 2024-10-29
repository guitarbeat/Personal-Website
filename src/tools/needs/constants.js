export const MINIMUM_VALUE_TO_UNLOCK = 15;
export const VIEWS = {
  MAIN: 'main',
  HISTORY: 'history',
  SETTINGS: 'settings'
};

export const INITIAL_STATE = {
  levelValues: [],
  selectedLevel: null,
  history: [],
  userName: '',
  hoveredLevel: null,
  currentView: VIEWS.MAIN,
  lastSaved: null
};

export const MAX_HISTORY_ITEMS = 50; 