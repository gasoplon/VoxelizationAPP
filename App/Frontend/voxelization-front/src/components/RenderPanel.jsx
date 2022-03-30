import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";

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
  const [errores, setErrors] = useState("");

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

    // Petición de obtención del archivo a partir de la URL
    var request = new XMLHttpRequest();
    request.open("GET", selectedFile.pathFile, true);
    request.responseType = "blob";
    request.onload = function () {
      var reader = new FileReader();
      reader.readAsDataURL(request.response);

      // Cuando se haya leído
      reader.onload = function (e) {
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object with file
        formData.append(
          "fileUploaded",
          request.response,
          selectedFile.fileName
        );

        // Update the formData object with resolution
        formData.append("resolutionVoxel", resolutionVoxel);

        // Update the formData object with resolution
        formData.append("useRemoveDisconnected", useRemoveDisconnected);

        // Details of the uploaded file
        // console.log(e.target.result);

        // Request made to the backend api
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
      };
    };
    request.send();
  };
  // ------------------- FUNCIONES AUXILIARES ---------------------------------------

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
      <RenderBox selectedModel={selectedFile}></RenderBox>
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
        <SelectListObject
          handleUploadFile={onFileUpload}
          handleSelectedFileChange={setSelectedFile}
        />
      </Box>

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
