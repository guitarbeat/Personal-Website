export const calculateLevelValue = (value, maxAllowed) => {
  return Math.min(value, maxAllowed);
};

export const updateLevelValues = (values, index, newValue, allowance = 15) => {
  return values.map((v, i) => {
    if (i === index) return newValue;
    if (i > index && v > newValue + allowance) {
      return newValue + allowance;
    }
    return v;
  });
};

export const formatLevelData = (levels, values) => 
  levels.map((level, index) => ({
    ...level,
    width: values[index],
  }));

export const createDescriptionsMap = (levels) => 
  levels.reduce((acc, level) => ({
    ...acc,
    [level.level]: level.description
  }), {}); 