import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import * as Constants from "../constants.js";

export function SelectObject(props) {
  const [selectedObject, setSelectedObject] = useState(
    Constants.DEMOS_MODELS[0]
  );

  // Manejador de selección de objeto
  const handleObjectChange = (event) => {
    setSelectedObject(event.target.value);
    props.setObjectSelected(event.target.value);
  };

  const ItemsValues = () => {
    if (Constants.DEMOS_MODELS) {
      return Constants.DEMOS_MODELS.map((value) => {
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
        {/* <MenuItem value="">
          <em>Objeto no seleccionado</em>
        </MenuItem> */}
        {ItemsValues()}
      </Select>
      <FormHelperText>Seleccione un elemento</FormHelperText>
    </FormControl>
  );
}

SelectObject.propTypes = {
  setObjectSelected: PropTypes.func.isRequired,
};

export default SelectObject;
