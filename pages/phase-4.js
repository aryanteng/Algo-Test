import React, { useState } from 'react';
import CombinedChartComponent from '../components/CombinedChartComponent';
import { data1 } from '../data/data1';
import { data2 } from '../data/data2';
import { data3 } from '../data/data3';
import { dropdownOptions } from '../utils/dropdownOptions';

function Phase4() {
  const [resolution, setResolution] = useState(1);
  const data = {
    Data1: data1,
    Data2: data2,
    Data3: data3,
  };

  return (
    <div className='flex flex-col items-center gap-10 p-10'>
      <h1 className='text-5xl'>Phase IV: Multiple Instrument</h1>
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
      <CombinedChartComponent data={data} resolution={resolution} />
    </div>
  );
}

export default Phase4;
