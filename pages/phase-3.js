import React from 'react';
import { data1 } from '../data/data1';
import OhlcChartComponent from '../components/OhlcChartComponent';

function Phase3() {
  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase III: OHLC</h1>
      <OhlcChartComponent data={data1} resolution={1} />
      <OhlcChartComponent data={data1} resolution={5} />
      <OhlcChartComponent data={data1} resolution={30} />
    </div>
  );
}

export default Phase3;
