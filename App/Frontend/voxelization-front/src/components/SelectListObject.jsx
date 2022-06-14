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
import Button from "@mui/material/Button";

export default function SelectedListItem(props) {
  // ------------------- ESTADOS -----------------------------------------
  const {
    filesDataStructure,
    selectedIDFile,
    handleListItemClickProps,
    resetOptions,
    handleFileUploaded,
    handleDelete,
  } = props;
  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, id) => {
    resetOptions();
    handleListItemClickProps(event, id);
  };

  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    var filesIDs = filesDataStructure.demosFilesIDs;
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
              primary={filesDataStructure.getFileByID(demoID).fileName}
              class="texto_normal"
            />
          </ListItemButton>
        );
      });
    }
    return items;
  };

  const UploadedFileItem = () => {
    var file = filesDataStructure.fileUploaded;
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

  // ------------------- RETURN -----------------------------------------
  return (
    <Box>
      <List component="nav">
        <Typography sx={{ mt: 1, mb: 1 }} class="list_title" component="div">
          Demos
        </Typography>
        {DemosListItems()}
        <Typography sx={{ mt: 1, mb: 1 }} class="list_title" component="div">
          Archivo subido
        </Typography>
        {UploadedFileItem()}
      </List>
      <div class="row p-2">
        <input
          type="file"
          hidden
          id="contained-button-file"
          onChange={(event) => handleFileUploaded(event, false)}
        />
        <label htmlFor="contained-button-file">
          {!filesDataStructure.fileUploaded && (
            <Tooltip title="Upload new file">
              <Button
                class="custom_button col-5 pt-2 pb-2 p-1 "
                component="span"
                startIcon={<AddCircleOutlineIcon />}
              >
                Añadir archivo
              </Button>
            </Tooltip>
          )}
        </label>
      </div>
    </Box>
  );
}

{
  /* // SelectedListItem.propTypes = {
//   handleUploadFile: PropTypes.func.isRequired,
//   handleSelectedFileChange: PropTypes.func.isRequired,
//   resetOptions: PropTypes.func.isRequired,
// }; */
}
