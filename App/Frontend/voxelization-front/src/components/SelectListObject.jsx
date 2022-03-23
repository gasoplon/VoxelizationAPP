import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import * as Constants from "../constants.js";

export default function SelectedListItem() {
  // ------------------- ESTADOS -----------------------------------------
  // Estado con la estructura de datos necesaria
  const [filesUploadedItems, setFilesUploadedItems] = React.useState(
    initJSONDataFileStructure()
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  // ------------------- FUNCIONES AUXILIARES -----------------------------------------
  function addFileStructureToState(index, newDataStructure) {
    var newState = { ...filesUploadedItems };
    newState.files[index] = newDataStructure;
    newState.numElements++;
    setFilesUploadedItems(newState);
  }

  function createFileDataStrcuture(fileName, extension, prePath, isDemoFile) {
    var jsonObj = {};
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
        var newDS = createFileDataStrcuture(
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
  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    if (Constants.DEMOS_MODELS) {
      return Constants.DEMOS_MODELS.map((value) => {
        // Index
        const index = Constants.DEMOS_MODELS.indexOf(value, 0);
        // Return
        return (
          <ListItemButton
            key={value}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
          >
            <ListItemText primary={value} />
          </ListItemButton>
        );
      });
    } else return <div></div>;
  };

  const SelectedFilesListItems = () => {
    if (filesUploadedItems.length > 0) {
      return filesUploadedItems.map((value) => {
        const index = filesUploadedItems.indexOf(value, 0);
        return (
          <ListItemButton
            key={value}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
          >
            <ListItemText primary={value} />
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        );
      });
    } else return <div></div>;
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
        {SelectedFilesListItems()}
      </List>
    </Box>
  );
}
