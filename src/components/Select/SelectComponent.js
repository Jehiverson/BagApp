import React from 'react';
import Select from 'react-select';

function SelectComponent({ value, onChange, options, menuPortalTarget }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      fullWidth
      menuPortalTarget={menuPortalTarget}
    />
  );
}

export default SelectComponent;
