import React from 'react';
import CombinedChartComponent from '../components/CombinedChartComponent';
import { data1 } from '../data/data1';
import { data2 } from '../data/data2';
import { data3 } from '../data/data3';

function Phase4() {
  const data = {
    Data1: data1,
    Data2: data2,
    Data3: data3,
  };
  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase IV: Multiple Instrument</h1>
      <CombinedChartComponent data={data} resolution={1} />
    </div>
  );
}

export default Phase4;
