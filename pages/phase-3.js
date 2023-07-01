import React from 'react';
import { data1 } from '../data/data1';
import OhlcChartComponent from '../components/OhlcChartComponent';

function Phase3() {
  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase III: OHLC</h1>
      <OhlcChartComponent data={data1} resolution={1} />
      <p className='text-xl'>Resolution: 1 minute</p>
      <OhlcChartComponent data={data1} resolution={5} />
      <p className='text-xl'>Resolution: 5 minutes</p>
      <OhlcChartComponent data={data1} resolution={30} />
      <p className='text-xl'>Resolution: 30 minutes</p>
    </div>
  );
}

export default Phase3;
