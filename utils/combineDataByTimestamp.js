export const combineDataByTimestamp = (combinedArray) => {
  const combinedMap = new Map();
  let previousLtp = null;

  combinedArray.forEach((item) => {
    const timestamp = item[0];
    const ltp = item[1];
    const volume = item[2];

    if (combinedMap.has(timestamp)) {
      const existingItem = combinedMap.get(timestamp);
      existingItem[1] += ltp;
      existingItem[2] += volume;
    } else {
      const newItem = [timestamp, ltp, volume];
      if (previousLtp !== null) {
        newItem[1] += previousLtp;
      }
      combinedMap.set(timestamp, newItem);
    }

    previousLtp = ltp;
  });

  const combinedResult = Array.from(combinedMap.values());
  return combinedResult;
};
