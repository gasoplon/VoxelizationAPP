import React, { useState, useEffect } from "react";
import axios from "axios";
import { Slider, FormControlLabel, Checkbox } from "@mui/material";
import RenderBox from "./RenderBox";
import * as Constants from "../constants.js";
import SelectListObject from "./SelectListObject";
import { Notifications } from "./Notifications";
import Button from "@mui/material/Button";
import { FiTool } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { FilesStructure } from "../FileDataStructure.js";
import { motion } from "framer-motion/dist/framer-motion";
import Typography from "@mui/material/Typography";
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

  // Comando a renderizar
  const [selectedCommand, setSelectedCommand] = React.useState("");

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
          var myblob = new Blob([resp.data["file"]], {
            type: "text/plain",
          });
          setSelectedCommand(resp.data["command"]);
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

  const handleFileUploaded = (event) => {
    var file_name = event.target.files[0].name;
    let copyDataStrcuture = filesDataStructure.clone();
    copyDataStrcuture.addUploadedFile(file_name, event.target.files[0]);
    setFilesDataStructure(copyDataStrcuture);
  };

  const handleDelete = (event, id) => {
    var copy = filesDataStructure.clone();
    copy.removeFileByID(id);
    document.getElementById("contained-button-file").value = null;
    setFilesDataStructure(copy);
  };
  // ------------------- FUNCIONES AUXILIARES ---------------------------------------
  const handleResetOptions = () => {
    setResolutionVoxel(Constants.DEFAULT_VOXELIZATION_RESOLUTION);
    setUseRemoveDisconnected(true);
  };

  const CommandRender = () => {
    if (selectedCommand)
      return (
        <div class="col pt-4 pb-2" id="comando">
          <Typography sx={{ mt: 1, mb: 1 }} class="list_title" component="div">
            COMANDO
          </Typography>
          <div class="pt-2 pb-2">{selectedCommand}</div>
        </div>
      );
    return <div></div>;
  };
  // ------------------- RETURN ---------------------------------------
  return (
    <div class="container text-white">
      <Notifications></Notifications>
      <motion.div
        class="row m-5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <RenderBox selectedURLFile={selectedURLFile}></RenderBox>
      </motion.div>
      <div class="row justify-content-center text-center ">
        <div class="row justify-content-center text-center pb-5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            class="col-md-4 panel p-3"
          >
            <h1 class="row pb-3">
              <FiTool />
            </h1>
            <div class="row">
              <h5 class="col-1">Resolución</h5>
            </div>
            <div class="row justify-content-center pb-3">
              <div class="col-10">
                <Slider
                  value={resolutionVoxel}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  step={1}
                  onChange={handleResolutionChange}
                  marks
                  min={1}
                  max={7}
                />
              </div>
            </div>
            <div class="row">
              <h5 class="col-auto">Eliminar elementos inconexos</h5>
            </div>
            <div class="row justify-content-center pb-3">
              <div class="col-10">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useRemoveDisconnected}
                      onChange={handleUseRemoveDisconnected}
                    />
                  }
                  label="Elementos inconexos."
                />
              </div>
            </div>
          </motion.div>
          <div class="col-1 p-3"></div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            class="col-md-4 panel p-3"
          >
            <SelectListObject
              filesDataStructure={filesDataStructure}
              selectedIDFile={selectedIDFile}
              handleListItemClickProps={handleListItemClick}
              resetOptions={handleResetOptions}
              handleFileUploaded={handleFileUploaded}
              handleDelete={handleDelete}
            />
          </motion.div>
        </div>
        <div class="row justify-content-center text-center">
          <div class="col-md-2"></div>
          {CommandRender()}
          <div class="col-md-2"></div>
        </div>
        <div class="row justify-content-center text-center pt-5 pb-2">
          <Button
            onClick={onFileUpload}
            class="custom_button col-5 pt-2 pb-2 p-1 mb-5 "
            component="span"
          >
            ¡Voxelizar!
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RenderPanel;
