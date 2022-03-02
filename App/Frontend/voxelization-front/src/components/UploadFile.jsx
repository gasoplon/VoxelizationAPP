import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";

export function UploadFile() {
  // CTES
  const DEFAULT_RESOLUTION = 4;

  //Estados del componente
  const [selectedFile, setSelectedFile] = useState(null);
  const [errores, setErrors] = useState("");
  const [resolutionVoxel, setResolutionVoxel] = useState(DEFAULT_RESOLUTION);
  const [useRemoveDisconnected, setUseRemoveDisconnected] = useState(true);

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
      .post("http://localhost:5000/api/uploadFile", formData)
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
      <h1>Componente de carga(Pruebas de Algoritmo)</h1>
      <br />
      <h3>Resolución:</h3>
      <Box sx={{ width: "40%", margin: "auto" }}>
        <Slider
          defaultValue={DEFAULT_RESOLUTION}
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
        {/* <Slider
          defaultValue={50}
          aria-label="Default"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={20}
        /> */}
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
