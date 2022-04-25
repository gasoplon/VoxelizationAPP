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
    var demosIDs = filesUploadedItems.demosFilesIDs;
    if (demosIDs && !filesUploadedItems.fileUploaded) {
      var key = demosIDs[0];
      setSelectedIDFile(key);
      props.handleSelectedFileChange(filesUploadedItems.getFileByID(key));
    }
  }, [filesUploadedItems]);

  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, id) => {
    props.resetOptions();
    setSelectedIDFile(id);
    props.handleSelectedFileChange(filesUploadedItems.getFileByID(id));
  };
  const handleDelete = (event, id) => {
    var copy = filesUploadedItems.clone();
    copy.removeFileByID(id);
    document.getElementById("contained-button-file").value = null;
    document.getElementById("contained-button-attached").value = null;
    setFilesUploadedItems(copy);
  };
  const handleFileUploaded = (event, isAttachedFile) => {
    var newFile = new SingleFileDataStructure(
      !isAttachedFile
        ? event.target.files[0].name.split(".")[0]
        : event.target.files[0].name,
      !isAttachedFile ? Constants.DEMOS_EXTENSION : "",
      "",
      false,
      event.target.files[0],
      isAttachedFile
    );
    addFileStructureToState(newFile, isAttachedFile);
  };

  // ------------------- FUNCIONES AUXILIARES -----------------------------------------
  function addFileStructureToState(newDataStructure, isAttachedFile = false) {
    var copy = filesUploadedItems.clone();
    if (isAttachedFile) copy.addAttachedFile(newDataStructure);
    else copy.addUploadedFile(newDataStructure);
    setFilesUploadedItems(copy);
  }

  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    var filesIDs = filesUploadedItems.demosFilesIDs;
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
    var items = [];
    var attachedFiles = filesUploadedItems.fileUploaded.attachedFiles;
    if (filesUploadedItems.fileUploaded && attachedFiles) {
      Object.keys(attachedFiles).forEach((key) => {
        items.push(
          <ListItem key={key}>
            <ListItemText
              primary={filesUploadedItems.getFileByID(key).fileName}
            />

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
        onChange={(event) => handleFileUploaded(event, false)}
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
        onChange={(event) => handleFileUploaded(event, true)}
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
