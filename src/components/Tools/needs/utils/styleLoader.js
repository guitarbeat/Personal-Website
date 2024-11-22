// This file ensures all style modules are loaded correctly
export const loadStyles = () => {
  require('../styles/_variables.scss');
  require('../styles/_mixins.scss');
  require('../styles/components/_common.scss');
  require('../styles/components/_pyramid.scss');
  require('../styles/components/_dialog.scss');
}; 