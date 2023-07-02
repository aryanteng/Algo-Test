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

  const combineOHLCData = useCallback(
    (selectedInstruments, data, resolution) => {
      const combinedData = [];
      const previousLTP = {};

      const sortedData = data.sort((a, b) => new Date(a[0]) - new Date(b[0]));

      sortedData.forEach((item) => {
        const timestamp = new Date(item[0]);
        const ltp = item[1] * 1000; // Adjust LTP if needed
        const volume = item[2];

        const dataPoint = { timestamp };

        selectedInstruments.forEach((instrument) => {
          const previousLTPForInstrument = previousLTP[instrument] || 0;
          const currentLTP = item[3][instrument] || previousLTPForInstrument;
          const combinedLTP = currentLTP + ltp;
          dataPoint[instrument] = { ltp: combinedLTP, volume };
          previousLTP[instrument] = combinedLTP;
        });

        combinedData.push(dataPoint);
      });

      const ohlcData = convertToOHLC(combinedData, resolution);
      return ohlcData;
    },
    [convertToOHLC]
  );

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

    const combinedData = combineOHLCData(selectedInstruments, data, resolution);

    newSeries.setData(combinedData);

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
    combineOHLCData,
    selectedInstruments,
  ]);

  const handleInstrumentSelection = (instrument) => {
    setSelectedInstruments((prevSelected) =>
      prevSelected.includes(instrument)
        ? prevSelected.filter((item) => item !== instrument)
        : [...prevSelected, instrument]
    );
  };

  return (
    <>
      <div className='w-full' ref={chartContainerRef} />
      <>
        <div>
          <label>
            <input
              type='checkbox'
              checked={selectedInstruments.includes('Data1')}
              onChange={() => handleInstrumentSelection('Data1')}
            />
            Data1
          </label>
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              checked={selectedInstruments.includes('Data2')}
              onChange={() => handleInstrumentSelection('Data2')}
            />
            Data2
          </label>
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              checked={selectedInstruments.includes('Data3')}
              onChange={() => handleInstrumentSelection('Data3')}
            />
            Data3
          </label>
        </div>
        <div className='w-full' ref={chartContainerRef} />
        <p className='text-xl'>
          Resolution: {resolution} {resolution === 1 ? 'minute' : 'minutes'}
        </p>
      </>
    </>
  );
}

export default memo(CombinedChartComponent);
