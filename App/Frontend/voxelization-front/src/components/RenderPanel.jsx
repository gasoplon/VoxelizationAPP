import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Notifications } from "./Notifications";

export function RenderPanel() {
  // ------------------- ESTADOS -----------------------------------------
  // Información del objeto seleccionado
  const [selectedFile, setSelectedFile] = useState(
    Constants.DEFAULT_MODEL_PATH
  );
  const [resolutionVoxel, setResolutionVoxel] = useState(
    Constants.DEFAULT_VOXELIZATION_RESOLUTION
  );
  const [useRemoveDisconnected, setUseRemoveDisconnected] = useState(true);
  // ERRORES
  // const [errores, setErrors] = useState("");

  // ------------------- MANEJADORES ---------------------------------------

  const handleResolutionChange = (event, newValue) => {
    setResolutionVoxel(newValue);
  };
  const handleUseRemoveDisconnected = (event, newValue) => {
    setUseRemoveDisconnected(newValue);
  };
  // On file upload (click the upload button)
  const onFileUpload = () => {
    // En caso de no haber seleccionado un objeto
    if (selectedFile === null) return;

    // GET files a partir de las URLs de los Blobs
    let { fileNames, masterPromise } = selectedFile.getBlobs();
    masterPromise.then((blobs) => {
      // console.log(fileNames);
      // console.log(blobs);
      // Form Data Creation
      const formData = new FormData();

      // Main file
      formData.append("fileUploaded", blobs[0].value, fileNames[0]);

      // Update the formData object with resolution
      formData.append("resolutionVoxel", resolutionVoxel);

      // Update the formData object with useRemoveDisconnected
      formData.append("useRemoveDisconnected", useRemoveDisconnected);

      if (formData.length > 1) {
        blobs.shift();
        let cont = 1;
        for (let file of blobs) {
          formData.append("attachedFiles", file, fileNames[cont]);
          cont++;
        }
      }
      console.log(formData);

      // Send formData object
      axios
        .post(Constants.API_UPLOAD_FILE_URL, formData)
        .then((resp) => {
          var myblob = new Blob([resp.data], {
            type: "text/plain",
          });
          var state_copy = { ...selectedFile };
          state_copy.pathFile = URL.createObjectURL(myblob);
          setSelectedFile(state_copy);
        })
        .catch((err) => {
          // const error = {
          //   status: err.response["status"],
          //   message: err.response["data"]["message"],
          // };
          // console.error(error);
          console.error("ERR:" + err);
          // console.error(err.message);
          // console.error(err.request);
          // setErrors(error["message"]);
        });
    });
  };
  // ------------------- FUNCIONES AUXILIARES ---------------------------------------
  const handleResetOptions = () => {
    setResolutionVoxel(Constants.DEFAULT_VOXELIZATION_RESOLUTION);
    setUseRemoveDisconnected(true);
  };

  // ------------------- RETURN ---------------------------------------
  return (
    <div
      style={{ border: "1px solid black", margin: "5px", textAlign: "center" }}
    >
      <Notifications></Notifications>
      <RenderBox selectedModel={selectedFile}></RenderBox>
      <h1>Componente de carga(Pruebas de Algoritmo)</h1>
      <br />
      <h3>Resolución:</h3>
      <Box sx={{ width: "40%", margin: "auto" }}>
        <Slider
          value={resolutionVoxel}
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
            <Checkbox
              checked={useRemoveDisconnected}
              onChange={handleUseRemoveDisconnected}
            />
          }
          label="Eliminar elementos inconexos."
        />
        <SelectListObject
          handleUploadFile={onFileUpload}
          handleSelectedFileChange={setSelectedFile}
          resetOptions={handleResetOptions}
        />
      </Box>
    </div>
  );
}

export default RenderPanel;
