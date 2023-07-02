import React, { useState } from 'react';
import { data1 } from '../data/data1';
import OhlcChartComponent from '../components/OhlcChartComponent';

function Phase3() {
  const [resolution, setResolution] = useState(1);

  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase III: OHLC</h1>
      <label htmlFor='resolution'>Resolution:</label>
      <select
        id='resolution'
        value={resolution}
        onChange={(e) => {
          setResolution(e.target.value);
        }}
      >
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={30}>30</option>
      </select>
      <OhlcChartComponent data={data1} resolution={resolution} />
    </div>
  );
}

export default Phase3;
