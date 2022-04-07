import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Typography from "@mui/material/Typography";
import * as Constants from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";

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
    props.resetOptions();
    setSelectedIDFile(id);
    props.handleSelectedFileChange(filesUploadedItems.files[id]);
  };
  const handleDelete = (event, id) => {
    delete filesUploadedItems.files[id];
    var newState = { ...filesUploadedItems };
    newState.numElements--;
    setFilesUploadedItems(newState);
    document.getElementById("contained-button-file").value = null;
  };
  const handleFileUploaded = (event) => {
    var newStructure = createFileDataStructure(
      event.target.files[0].name.split(".")[0],
      Constants.DEMOS_EXTENSION,
      "",
      false,
      event.target.files[0]
    );
    addFileStructureToState(newStructure);
  };
  const handleFileAttachedUploaded = (event) => {
    //TODO: Change
    var newStructure = createFileDataStructure(
      event.target.files[0].name.split(".")[0],
      Constants.DEMOS_EXTENSION,
      "",
      false,
      event.target.files[0]
    );
    var newState = { ...filesUploadedItems };
    newState.files[filesUploadedItems.files[2]].attached = newStructure;
    setFilesUploadedItems(newState);
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
    jsonObj.errores = [
      // ["ERROR", "Demasiados objetos"],
      // ["WARN", "Demasiados objetos"],
    ];
    jsonObj.attached = [];
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

              <Tooltip title="Delete">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(event) => handleDelete(event, key)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          );
        }
      });
    }
    return items;
  };

  const UploadedAttachedItems = () => {
    var files = filesUploadedItems.files;
    var items = [];
    if (files && files.attached) {
      Object.keys(files.attached).forEach((key) => {
        if (!files[key].isDemo) {
          items.push(
            <ListItem
              key={files[key].attached[key]}
              // selected={selectedIDFile === key}
              // onClick={(event) => handleListItemClick(event, key)}
            >
              <ListItemText primary={files[key].fileName} />

              <Tooltip title="Delete">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(event) => handleDelete(event, key)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
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
        {filesUploadedItems.numElements !== 2 && (
          <div>
            <Typography
              sx={{ mt: 1, mb: 1 }}
              variant="subtitle2"
              component="div"
            >
              Adjuntos
            </Typography>
            {UploadedAttachedItems()}
          </div>
        )}
      </List>
      <input
        type="file"
        hidden
        id="contained-button-file"
        onChange={handleFileUploaded}
      />
      <label htmlFor="contained-button-file">
        {filesUploadedItems.numElements === 2 && (
          <Tooltip title="Upload new file">
            <Button
              sx={{ mt: 3, mb: 3 }}
              variant="outlined"
              color="primary"
              component="span"
              startIcon={<AddCircleOutlineIcon />}
            >
              Añadir archivo
            </Button>
          </Tooltip>
        )}
      </label>
      <input
        type="file"
        hidden
        id="contained-button-attached"
        onChange={handleFileAttachedUploaded}
      />
      <label htmlFor="contained-button-file">
        {filesUploadedItems.numElements !== 2 && (
          <Tooltip title="Upload new attached file">
            <Button
              sx={{ mt: 3, mb: 3 }}
              variant="outlined"
              color="primary"
              component="span"
              startIcon={<AddCircleOutlineIcon />}
            >
              Añadir adjunto
            </Button>
          </Tooltip>
        )}
      </label>
      <br />
      <Button
        onClick={props.handleUploadFile}
        variant="contained"
        color="primary"
        component="span"
      >
        Upload!
      </Button>
    </Box>
  );
}

SelectedListItem.propTypes = {
  handleUploadFile: PropTypes.func.isRequired,
  handleSelectedFileChange: PropTypes.func.isRequired,
};
