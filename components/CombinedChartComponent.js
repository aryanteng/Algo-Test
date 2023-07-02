import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { memo } from 'react';
import { convertToOHLC } from '../utils/convertToOHLC';
import { combineDataByTimestamp } from '../utils/combineDataByTimestamp';

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
    selectedInstruments,
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
