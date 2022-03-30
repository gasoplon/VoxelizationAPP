import React, { useState } from "react";
import axios from "axios";
import { Slider, Checkbox, FormControlLabel, Box } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

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

    // Petición de obtención del archivo a partir de la URL
    var request = new XMLHttpRequest();
    request.open("GET", selectedFile.originalPathFile, true);
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
  const handleResetOptions = () => {
    setResolutionVoxel(Constants.DEFAULT_VOXELIZATION_RESOLUTION);
    setUseRemoveDisconnected(true);
  };

  const Errores = () => {
    var errorsItems = [];
    if (selectedFile && selectedFile.errores) {
      selectedFile.errores.forEach((element) => {
        switch (element[0]) {
          case "ERROR":
            errorsItems.push(
              <Alert variant="filled" severity="error">
                {element[1]}
              </Alert>
            );
            break;
          case "WARN":
            errorsItems.push(
              <Alert variant="filled" severity="warning">
                {element[1]}
              </Alert>
            );
            break;
          default:
            break;
        }
      });
    }
    return errorsItems;
  };
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

      {/* {errores && (
        <h5 className="error" style={{ color: "red" }}>
          {errores}
        </h5>
      )} */}
      <Stack sx={{ width: "50%" }} spacing={2}>
        {Errores()}
      </Stack>
    </div>
  );
}

export default RenderPanel;
