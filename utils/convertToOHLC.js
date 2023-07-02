export const convertToOHLC = (data, resolution) => {
  const sortedData = [...data].sort((a, b) => new Date(a[0]) - new Date(b[0]));

  const ohlcData = [];
  let currentOpen = 0;
  let currentHigh = 0;
  let currentLow = 0;
  let currentClose = 0;
  let currentVolume = 0;
  let currentTimestamp = null;

  sortedData.forEach((item) => {
    const timestamp = new Date(item[0]);
    const value = item[1];
    const volume = item[2];

    if (!currentTimestamp) {
      currentTimestamp = timestamp;
      currentOpen = value;
      currentHigh = value;
      currentLow = value;
      currentClose = value;
      currentVolume = volume;
    }

    const minutesDiff = Math.floor(
      (timestamp - currentTimestamp) / (1000 * 60)
    );
    if (minutesDiff >= resolution) {
      ohlcData.push({
        time: Math.round(new Date(currentTimestamp.getTime()).getTime() / 1000),
        open: currentOpen,
        high: currentHigh,
        low: currentLow,
        close: currentClose,
        volume: currentVolume,
      });

      currentTimestamp = timestamp;
      currentOpen = value;
      currentHigh = value;
      currentLow = value;
      currentClose = value;
      currentVolume = volume;
    } else {
      currentHigh = Math.max(currentHigh, value);
      currentLow = Math.min(currentLow, value);
      currentClose = value;
      currentVolume += volume;
    }
  });

  if (currentTimestamp) {
    ohlcData.push({
      time: currentTimestamp.getTime(),
      open: currentOpen,
      high: currentHigh,
      low: currentLow,
      close: currentClose,
      volume: currentVolume,
    });
  }

  return ohlcData;
};
