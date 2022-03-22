import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import SelectObject from "./SelectObject";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";

export function UploadFile() {
  // CTES

  //Estados del componente
  const [selectedFile, setSelectedFile] = useState(null);
  const [errores, setErrors] = useState("");
  const [resolutionVoxel, setResolutionVoxel] = useState(
    Constants.DEFAULT_VOXELIZATION_RESOLUTION
  );
  const [useRemoveDisconnected, setUseRemoveDisconnected] = useState(true);
  const [selectedObject, setSelectedObject] = useState(
    Constants.DEFAULT_MODEL_PATH
  );

  //MANEJADORES
  const handleResolutionChange = (event, newValue) => {
    setResolutionVoxel(newValue);
  };
  const handleUseRemoveDisconnected = (event, newValue) => {
    setUseRemoveDisconnected(newValue);
  };
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleObjectChange = (value) => {
    setSelectedObject(
      Constants.ROOT_MODELS_DEMOS_PATH + value + Constants.DEMOS_EXTENSION
    );
  };
  // On file upload (click the upload button)
  const onFileUpload = () => {
    if (selectedFile === null) return;
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object with file
    formData.append("fileUploaded", selectedFile, selectedFile.name);

    // Update the formData object with resolution
    formData.append("resolutionVoxel", resolutionVoxel);

    // Update the formData object with resolution
    formData.append("useRemoveDisconnected", useRemoveDisconnected);

    // Details of the uploaded file
    console.log(selectedFile);

    // Request made to the backend api
    // Send formData object
    axios
      .post(Constants.API_UPLOAD_FILE_URL, formData)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        // const error = {
        //   status: err.response["status"],
        //   message: err.response["data"]["message"],
        // };
        // console.error(error);
        console.error(err);
        // console.error(err.message);
        // console.error(err.request);
        // setErrors(error["message"]);
      });
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>Detalles de archivo:</h2>
          <p>Nombre del archivo: {selectedFile.name}</p>
          <p>Tipo de archivo: {selectedFile.type}</p>
          <p>
            Última modificación: {selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>¡No ha seleccionado un archivo aún!</h4>
        </div>
      );
    }
  };

  return (
    <div
      style={{ border: "1px solid black", margin: "5px", textAlign: "center" }}
    >
      <RenderBox selectedModelPath={selectedObject}></RenderBox>
      <h1>Componente de carga(Pruebas de Algoritmo)</h1>
      <br />
      <h3>Resolución:</h3>
      <Box sx={{ width: "40%", margin: "auto" }}>
        <Slider
          defaultValue={Constants.DEFAULT_VOXELIZATION_RESOLUTION}
          aria-label="Default"
          valueLabelDisplay="auto"
          step={1}
          onChange={handleResolutionChange}
          marks
          min={1}
          max={20}
        />
        <FormControlLabel
          control={
            <Checkbox defaultChecked onChange={handleUseRemoveDisconnected} />
          }
          label="Eliminar elementos inconexos."
        />
        <SelectObject setObjectSelected={handleObjectChange}></SelectObject>
      </Box>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {errores && (
        <h5 className="error" style={{ color: "red" }}>
          {errores}
        </h5>
      )}
      {fileData()}
    </div>
  );
}

export default UploadFile;
