import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";
import { v4 as uuidv4 } from "uuid";

export function RenderPanel() {
  // ------------------- ESTADOS -----------------------------------------
  // PANEL DE CONF
  // Input(subida de archivos)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // Path del objeto seleccionado
  const [selectedPathFile, setSelectedPathFile] = useState(
    Constants.DEFAULT_MODEL_PATH
  );
  const [resolutionVoxel, setResolutionVoxel] = useState(
    Constants.DEFAULT_VOXELIZATION_RESOLUTION
  );
  const [useRemoveDisconnected, setUseRemoveDisconnected] = useState(true);
  // ERRORES
  const [errores, setErrors] = useState("");
  // ARCHIVOS
  // Estado con la estructura de datos necesaria
  const [filesUploadedItems, setFilesUploadedItems] = React.useState(
    initJSONDataFileStructure()
  );

  // ------------------- MANEJADORES ---------------------------------------
  const handleFileUploaded = (event) => {
    console.log(event.target.files[0]);
  };
  const handleResolutionChange = (event, newValue) => {
    setResolutionVoxel(newValue);
  };
  const handleUseRemoveDisconnected = (event, newValue) => {
    setUseRemoveDisconnected(newValue);
  };
  const onFileChange = (event) => {
    setUploadedFiles(...uploadedFiles, event.target.files[0]);
  };
  const handleObjectChange = (value) => {
    setSelectedPathFile(value);
  };
  // On file upload (click the upload button)
  const onFileUpload = () => {
    if (uploadedFiles === null) return;
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object with file
    formData.append("fileUploaded", uploadedFiles, uploadedFiles.name);

    // Update the formData object with resolution
    formData.append("resolutionVoxel", resolutionVoxel);

    // Update the formData object with resolution
    formData.append("useRemoveDisconnected", useRemoveDisconnected);

    // Details of the uploaded file
    console.log(uploadedFiles);

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
  // ------------------- FUNCIONES AUXILIARES ---------------------------------------
  function addFileStructureToState(index, newDataStructure) {
    var newState = { ...filesUploadedItems };
    newState.files[index] = newDataStructure;
    newState.numElements++;
    setFilesUploadedItems(newState);
  }
  function createFileDataStructure(fileName, extension, prePath, isDemoFile) {
    var jsonObj = {};
    jsonObj.id = uuidv4();
    jsonObj.fileName = fileName;
    jsonObj.pathFile = prePath + fileName + extension;
    jsonObj.isDemo = isDemoFile;
    return jsonObj;
  }
  function initJSONDataFileStructure() {
    // Estructura global
    var jsonObj = {};
    jsonObj.numElements = 0;
    jsonObj.files = {};

    // Demos data
    if (Constants.DEMOS_MODELS) {
      Constants.DEMOS_MODELS.forEach((value) => {
        // Index
        const index = Constants.DEMOS_MODELS.indexOf(value, 0);
        // Crear estructura del archivo actual
        var newDS = createFileDataStructure(
          value,
          ".obj",
          Constants.ROOT_MODELS_DEMOS_PATH,
          true
        );
        jsonObj.files[index] = newDS;
        jsonObj.numElements++;
      });
    }
    return jsonObj;
  }
  // ------------------- DETALLES DE ARCHIVO ---------------------------------------
  // const fileData = () => {
  //   if (uploadedFiles) {
  //     return (
  //       <div>
  //         <h2>Detalles de archivo:</h2>
  //         <p>Nombre del archivo: {uploadedFiles.name}</p>
  //         <p>Tipo de archivo: {uploadedFiles.type}</p>
  //         <p>
  //           Última modificación: {uploadedFiles.lastModifiedDate.toDateString()}
  //         </p>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <br />
  //         <h4>¡No ha seleccionado un archivo aún!</h4>
  //       </div>
  //     );
  //   }
  // };

  // ------------------- RETURN ---------------------------------------
  return (
    <div
      style={{ border: "1px solid black", margin: "5px", textAlign: "center" }}
    >
      <RenderBox selectedModelPath={selectedPathFile}></RenderBox>
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
        {/* <SelectObject
          setObjectSelected={handleObjectChange}
          render={uploadedFile ? true : false}
        ></SelectObject> */}
        <SelectListObject
          // onChangeFileSelected={handleObjectChange}
          filesUploaded={filesUploadedItems}
        ></SelectListObject>
      </Box>
      <div>
        <input type="file" onChange={handleFileUploaded} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {errores && (
        <h5 className="error" style={{ color: "red" }}>
          {errores}
        </h5>
      )}
      {/* {fileData()} */}
    </div>
  );
}

export default RenderPanel;
