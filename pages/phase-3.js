import React, { useState } from 'react';
import { data1 } from '../data/data1';
import OhlcChartComponent from '../components/OhlcChartComponent';
import { dropdownOptions } from '../utils/dropdownOptions';

function Phase3() {
  const [resolution, setResolution] = useState(1);

  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase III: OHLC</h1>
      <div className='flex gap-1'>
        <label htmlFor='resolution'>Resolution:</label>
        <select
          value={resolution}
          onChange={(e) => {
            setResolution(e.target.value);
          }}
        >
          {dropdownOptions.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <OhlcChartComponent data={data1} resolution={resolution} />
    </div>
  );
}

export default Phase3;
