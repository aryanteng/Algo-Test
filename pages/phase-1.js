import React from 'react';
import ChartComponent from '../components/ChartComponent';
import { data1 } from '../data/data1';

function Phase1() {
  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>
        Phase I: Lightweight charts (Single Instrument)
      </h1>
      <ChartComponent data={data1} />
    </div>
  );
}

export default Phase1;
