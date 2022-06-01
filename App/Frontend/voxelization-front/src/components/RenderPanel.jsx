import React, { useState, useEffect } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Notifications } from "./Notifications";
import {
  FilesStructure,
  SingleFileDataStructure,
} from "../FileDataStructure.js";

export function RenderPanel() {
  // ------------------- ESTADOS -----------------------------------------
  // Estado con la estructura de datos para los archivos
  const [filesDataStructure, setFilesDataStructure] = React.useState(
    new FilesStructure()
  );
  // Información del objeto seleccionado
  const [selectedIDFile, setSelectedIDFile] = React.useState(
    filesDataStructure.demosFilesIDs[0]
  );
  // Información del objeto seleccionado
  const [selectedURLFile, setSelectedURLFile] = React.useState();

  useEffect(() => {
    setSelectedURLFile(filesDataStructure.demos[selectedIDFile].pathFile);
  }, []);

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
  const handleListItemClick = (event, ID) => {
    setSelectedIDFile(ID);
    setSelectedURLFile(filesDataStructure.getFileByID(ID).pathFile);
  };
  // On file upload (click the upload button)
  const onFileUpload = () => {
    // En caso de no haber seleccionado un objeto
    if (selectedIDFile === null) return;

    // GET files a partir de las URLs de los Blobs
    let currentFileSelected = filesDataStructure.getFileByID(selectedIDFile);
    let getFilePromise = currentFileSelected.getFile();
    getFilePromise.then((file) => {
      // Form Data Creation
      const formData = new FormData();

      // Main file
      formData.append("modelFile", file, currentFileSelected.fileName);

      // Update the formData object with resolution
      formData.append("resolutionVoxel", resolutionVoxel);

      // Update the formData object with useRemoveDisconnected
      formData.append("useRemoveDisconnected", useRemoveDisconnected);

      // Send formData object
      axios
        .post(Constants.API_UPLOAD_FILE_URL, formData)
        .then((resp) => {
          var myblob = new Blob([JSON.stringify(resp.data)], {
            type: "text/plain",
          });
          let copyDataStrcuture = filesDataStructure.clone();
          copyDataStrcuture.addModifiedFile(selectedIDFile, myblob);
          setFilesDataStructure(copyDataStrcuture);
          setSelectedURLFile(
            copyDataStrcuture.getFileByID(selectedIDFile).pathModifiedFile
          );
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
      <RenderBox selectedURLFile={selectedURLFile}></RenderBox>
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
          filesDataStructure={filesDataStructure}
          selectedIDFile={selectedIDFile}
          handleUploadFile={onFileUpload}
          // selectedFileModified={selectedFile}
          handleListItemClickProps={handleListItemClick}
          resetOptions={handleResetOptions}
        />
      </Box>
    </div>
  );
}

export default RenderPanel;
