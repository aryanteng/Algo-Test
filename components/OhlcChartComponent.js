import React, { useCallback, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { memo } from 'react';

function OhlcChartComponent(props) {
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

    const ohlcData = convertToOHLC(data, resolution);

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
  ]);

  return (
    <>
      <div className='w-full' ref={chartContainerRef} />
      <p className='text-xl'>
        Resolution: {resolution} {resolution == 1 ? 'minute' : 'minutes'}
      </p>
    </>
  );
}

export default memo(OhlcChartComponent);
