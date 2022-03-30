import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import * as Constants from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

export default function SelectedListItem(props) {
  // ------------------- ESTADOS -----------------------------------------
  // Estado con la estructura de datos para los archivos
  const [filesUploadedItems, setFilesUploadedItems] = React.useState(
    initJSONDataFileStructure()
  );
  // Archivo seleccionado actualmente
  const [selectedIDFile, setSelectedIDFile] = React.useState();
  useEffect(() => {
    // Inicializar estado
    if (filesUploadedItems.files) {
      var keys = Object.keys(filesUploadedItems.files);
      setSelectedIDFile(keys[0]);
      props.handleSelectedFileChange(filesUploadedItems.files[keys[0]]);
    }
  }, []);
  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, id) => {
    setSelectedIDFile(id);
    props.handleSelectedFileChange(filesUploadedItems.files[id]);
  };
  const handleDelete = (event, key) => {
    delete filesUploadedItems.files[key];
  };
  const handleFileUploaded = (event) => {
    var newStructure = createFileDataStructure(
      event.target.files[0].name,
      Constants.DEMOS_EXTENSION,
      "",
      false,
      event.target.files[0]
    );
    addFileStructureToState(newStructure);
  };
  // ------------------- FUNCIONES AUXILIARES -----------------------------------------
  function addFileStructureToState(newDataStructure) {
    var newState = { ...filesUploadedItems };
    newState.files[newDataStructure.id] = newDataStructure;
    newState.numElements++;
    setFilesUploadedItems(newState);
  }
  function createFileDataStructure(
    fileName,
    extension,
    prePath,
    isDemoFile,
    file = null
  ) {
    var jsonObj = {};
    jsonObj.id = uuidv4();
    jsonObj.fileName = fileName + extension;
    jsonObj.isDemo = isDemoFile;
    if (!isDemoFile) {
      jsonObj.pathFile = URL.createObjectURL(file);
      jsonObj.originalPathFile = jsonObj.pathFile;
    } else {
      jsonObj.pathFile = prePath + fileName + extension;
      jsonObj.originalPathFile = prePath + fileName + extension;
    }
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
        // Crear estructura del archivo actual
        var newDS = createFileDataStructure(
          value,
          ".obj",
          Constants.ROOT_MODELS_DEMOS_PATH,
          true
        );
        jsonObj.files[newDS.id] = newDS;
        jsonObj.numElements++;
      });
    }
    return jsonObj;
  }
  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    var files = filesUploadedItems.files;
    var items = [];
    if (files) {
      Object.keys(files).forEach((key) => {
        if (files[key].isDemo) {
          items.push(
            <ListItemButton
              key={files[key].id}
              selected={selectedIDFile === key}
              onClick={(event) => handleListItemClick(event, key)}
            >
              <ListItemText primary={files[key].fileName} />
            </ListItemButton>
          );
        }
      });
    }
    return items;
  };

  const UploadedFilesItems = () => {
    var files = filesUploadedItems.files;
    var items = [];
    if (files) {
      Object.keys(files).forEach((key) => {
        if (!files[key].isDemo) {
          items.push(
            <ListItemButton
              key={files[key].id}
              selected={selectedIDFile === key}
              onClick={(event) => handleListItemClick(event, key)}
            >
              <ListItemText primary={files[key].fileName} />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(event) => handleDelete(event, key)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          );
        }
      });
    }
    return items;
  };

  // ------------------- RETURN -----------------------------------------
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        border: "1px solid #000",
      }}
    >
      <List component="nav" aria-label="main mailbox folders">
        <Typography sx={{ mt: 1, mb: 1 }} variant="subtitle2" component="div">
          Demos
        </Typography>
        {DemosListItems()}
        {/* <Divider /> */}
        <Typography sx={{ mt: 1, mb: 1 }} variant="subtitle2" component="div">
          Archivos
        </Typography>
        {UploadedFilesItems()}
      </List>
      <div>
        <input type="file" onChange={handleFileUploaded} />
        <button onClick={props.handleUploadFile}>Upload!</button>
      </div>
    </Box>
  );
}

SelectedListItem.propTypes = {
  handleUploadFile: PropTypes.func.isRequired,
  handleSelectedFileChange: PropTypes.func.isRequired,
};
