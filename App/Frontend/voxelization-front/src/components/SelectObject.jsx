import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";

export function SelectObject(props) {
  const [selectedObject, setSelectedObject] = useState("");

  const handleObjectChange = (event) => {
    setSelectedObject(event.target.value);
    props.setObjectSelected(event.target.value);
  };

  const ItemsValues = () => {
    if (props.values) {
      return props.values.map((value) => {
        return (
          <MenuItem value={value} key={value}>
            {value}
          </MenuItem>
        );
      });
    } else return <div></div>;
  };

  return (
    <FormControl fullWidth>
      <Select value={selectedObject} displayEmpty onChange={handleObjectChange}>
        <MenuItem value="">
          <em>Objeto no seleccionado</em>
        </MenuItem>
        {ItemsValues()}
      </Select>
      <FormHelperText>Seleccione un elemento</FormHelperText>
    </FormControl>
  );
}

SelectObject.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  setObjectSelected: PropTypes.func.isRequired,
};

export default SelectObject;
