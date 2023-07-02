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

  const convertToOHLC = useCallback((combinedData) => {
    const ohlcData = [];

    combinedData.forEach((item) => {
      const instrument = item.instrument;
      const dataPoints = item.dataPoints;

      dataPoints.forEach((dataPoint) => {
        const timestamp = dataPoint.time;
        const open = dataPoint.open;
        const high = dataPoint.high;
        const low = dataPoint.low;
        const close = dataPoint.close;
        const volume = dataPoint.volume;

        ohlcData.push({
          time: timestamp,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume,
          instrument: instrument,
        });
      });
    });

    const sortedData = ohlcData.sort((a, b) => a.time - b.time);

    return sortedData;
  }, []);

  const combineOHLCData = useCallback(
    (selectedInstruments, data, resolution) => {
      const combinedData = [];

      selectedInstruments.forEach((instrument) => {
        const instrumentData = data[instrument];
        const sortedData = [...instrumentData].sort(
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
          const ltp = item[1] * 1000;
          const volume = item[2];

          if (!currentTimestamp) {
            currentTimestamp = timestamp;
            currentOpen = ltp;
            currentHigh = ltp;
            currentLow = ltp;
            currentClose = ltp;
            currentVolume = volume;
          } else if (timestamp.getTime() === currentTimestamp.getTime()) {
            currentHigh = Math.max(currentHigh, ltp);
            currentLow = Math.min(currentLow, ltp);
            currentClose = ltp;
            currentVolume += volume;
          } else {
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
              currentOpen = ltp;
              currentHigh = ltp;
              currentLow = ltp;
              currentClose = ltp;
              currentVolume = volume;
            } else {
              currentHigh = Math.max(currentHigh, ltp);
              currentLow = Math.min(currentLow, ltp);
              currentClose = ltp;
              currentVolume += volume;
            }
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
        combinedData.push({ instrument, dataPoints: ohlcData });
      });

      const sortedCombinedData = combinedData.sort((a, b) => {
        const aTime = a.dataPoints[0].time;
        const bTime = b.dataPoints[0].time;
        return aTime - bTime;
      });

      const ohlcData = convertToOHLC(sortedCombinedData, resolution);
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

    const sortedCombinedData = combinedData.sort((a, b) => a.time - b.time);
    console.log('COMBINED', sortedCombinedData);
    newSeries.setData(sortedCombinedData);

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
        <p className='text-xl'>
          Resolution: {resolution} {resolution === 1 ? 'minute' : 'minutes'}
        </p>
      </>
    </>
  );
}

export default memo(CombinedChartComponent);
