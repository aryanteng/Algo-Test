import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { memo } from 'react';

function CombinedChartComponent(props) {
  const {
    data,
    resolution,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props;

  const chartContainerRef = useRef();

  const [selectedInstruments, setSelectedInstruments] = useState([]);

  const convertToOHLC = useCallback((data, resolution) => {
    const sortedData = [...data].sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );

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
          time: currentTimestamp.getTime(),
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
  }, []);

  const combineDataByTimestamp = useCallback((combinedArray) => {
    const combinedMap = new Map();
    combinedArray.forEach((item) => {
      const timestamp = item[0];
      const ltp = item[1];
      const volume = item[2];

      if (combinedMap.has(timestamp)) {
        const existingItem = combinedMap.get(timestamp);
        existingItem[1] += ltp;
        existingItem[2] += volume;
      } else {
        combinedMap.set(timestamp, [timestamp, ltp, volume]);
      }
    });
    const combinedResult = Array.from(combinedMap.values());
    return combinedResult;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });

    let selectedData = [];
    selectedInstruments.forEach((instrument) => {
      data[instrument].forEach((item) => {
        selectedData.push(item);
      });
    });

    const combinedDataByTimestamp = combineDataByTimestamp(selectedData);

    console.log('Combined', combinedDataByTimestamp);

    const sortedCombinedData = combinedDataByTimestamp.sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    const ohlcData = convertToOHLC(sortedCombinedData, resolution);

    console.log('OHLC', ohlcData);

    newSeries.setData(ohlcData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [
    data,
    resolution,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    convertToOHLC,
    selectedInstruments,
    combineDataByTimestamp,
  ]);

  const handleInstrumentSelection = (instrument) => {
    setSelectedInstruments((prevSelected) =>
      prevSelected.includes(instrument)
        ? prevSelected.filter((item) => item !== instrument)
        : [...prevSelected, instrument]
    );
  };

  useEffect(() => {
    console.log('SELECTED', selectedInstruments);
  }, [selectedInstruments]);

  return (
    <>
      <div className='w-full' ref={chartContainerRef} />
      <div className='flex items-center gap-10'>
        {Object.keys(data).map((instrument) => {
          return (
            <div key={instrument} className='flex items-center gap-1'>
              <input
                type='checkbox'
                checked={selectedInstruments.includes(instrument)}
                onChange={() => handleInstrumentSelection(instrument)}
              />
              <label>{instrument}</label>
            </div>
          );
        })}
      </div>
      <p className='text-xl'>
        Resolution: {resolution} {resolution === 1 ? 'minute' : 'minutes'}
      </p>
    </>
  );
}

export default memo(CombinedChartComponent);
