export const getQuadrantFromValues = (x, y) => {
  if (x >= 0 && y >= 0) {
    return "high_valence_high_arousal";
  }
  if (x < 0 && y >= 0) {
    return "low_valence_high_arousal";
  }
  if (x < 0 && y < 0) {
    return "low_valence_low_arousal";
  }
  return "high_valence_low_arousal";
};

export const getCircumplexCoords = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
  return { x, y, quadrantId: getQuadrantFromValues(x, y) };
};
