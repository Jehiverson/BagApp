import React from 'react';
import { Slider } from '@mui/material';

function SliderComponent({ value, onChange }) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      valueLabelDisplay="auto"
      aria-labelledby="age-range-label"
      min={0}
      max={100}
    />
  );
}

export default SliderComponent;
