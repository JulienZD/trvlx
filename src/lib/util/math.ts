/**
 * Takes the mode of a list of numbers, or if there is no mode, the average.
 */
export const modeOrAverage = (numbers: number[]) => {
  const [mode] = [...numbers].sort(
    (a, b) => numbers.filter((v) => v === a).length - numbers.filter((v) => v === b).length
  );

  const hasMode = numbers.filter((n) => n === mode).length > 1;

  if (!hasMode) {
    // Average
    return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
  }

  return mode;
};
