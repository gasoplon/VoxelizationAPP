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
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import {
  FilesStructure,
  SingleFileDataStructure,
} from "../FileDataStructure.js";

export default function SelectedListItem(props) {
  // ------------------- ESTADOS -----------------------------------------
  // Estado con la estructura de datos para los archivos
  const [filesUploadedItems, setFilesUploadedItems] = React.useState(
    new FilesStructure()
  );
  // Archivo seleccionado actualmente
  const [selectedIDFile, setSelectedIDFile] = React.useState();
  useEffect(() => {
    // Inicializar estado
    var demosIDs = filesUploadedItems.demosFilesIDs();
    if (demosIDs) {
      var key = demosIDs[0];
      setSelectedIDFile(key);
      props.handleSelectedFileChange(filesUploadedItems.getFileByID(key));
    }
  }, []);

  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, id) => {
    props.resetOptions();
    setSelectedIDFile(id);
    props.handleSelectedFileChange(filesUploadedItems.files[id]);
  };
  const handleDelete = (event, id) => {
    var file = filesUploadedItems.getFileByID(id);
    if (file.isAttached) {
      filesUploadedItems.removeAttached(id);
    } else {
      file.removeAllAttachedFiles();
      document.getElementById("contained-button-file").value = null;
    }
    setFilesUploadedItems(filesUploadedItems);
  };
  const handleFileUploaded = (event) => {
    var newFile = new SingleFileDataStructure(
      event.target.files[0].name.split(".")[0],
      Constants.DEMOS_EXTENSION,
      "",
      false,
      event.target.files[0],
      false
    );
    addFileStructureToState(newFile);
  };
  const handleFileAttachedUploaded = (event) => {
    var newStructure = new SingleFileDataStructure(
      event.target.files[0].name.split(".")[0],
      Constants.DEMOS_EXTENSION,
      "",
      false,
      event.target.files[0],
      true
    );
    addFileStructureToState(newStructure, true);
  };

  // ------------------- FUNCIONES AUXILIARES -----------------------------------------
  function addFileStructureToState(newDataStructure, isAttachedFile) {
    if (isAttachedFile)
      filesUploadedItems.fileUploaded.addAttachedFile(newDataStructure);
    else filesUploadedItems.addUploadedFile(newDataStructure);
    setFilesUploadedItems(filesUploadedItems);
    setSelectedIDFile(newDataStructure.id);
  }

  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    var filesIDs = filesUploadedItems.demosFilesIDs();
    var items = [];
    if (filesIDs) {
      filesIDs.forEach((demoID) => {
        items.push(
          <ListItemButton
            key={demoID}
            selected={selectedIDFile === demoID}
            onClick={(event) => handleListItemClick(event, demoID)}
          >
            <ListItemText
              primary={filesUploadedItems.getFileByID(demoID).fileName}
            />
          </ListItemButton>
        );
      });
    }
    return items;
  };

  const UploadedFileItem = () => {
    var file = filesUploadedItems.fileUploaded;
    var item;
    if (file) {
      item = (
        <ListItemButton
          key={file.id}
          selected={selectedIDFile === file.id}
          onClick={(event) => handleListItemClick(event, file.id)}
        >
          <ListItemText primary={file.fileName} />

          <Tooltip title="Delete">
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => handleDelete(event, file.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemButton>
      );
    }
    return item;
  };

  const UploadedAttachedItems = () => {
    var file = filesUploadedItems.fileUploaded;
    var items = [];
    if (file && file.attached) {
      Object.keys(file.attached).forEach((key) => {
        items.push(
          <ListItem key={key}>
            <ListItemText primary={file.attached[key].fileName} />

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
        {UploadedFileItem()}
        {filesUploadedItems.fileUploaded && (
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
        {!filesUploadedItems.fileUploaded && (
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
      <label htmlFor="contained-button-attached">
        {filesUploadedItems.fileUploaded && (
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
