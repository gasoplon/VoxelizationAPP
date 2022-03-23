import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import * as Constants from "../constants.js";
export default function SelectedListItem(props) {
  // ------------------- ESTADOS -----------------------------------------

  const [selectedIDFile, setSelectedIDFile] = React.useState(
    props.filesUploaded.files[0].id
  );

  // ------------------- MANEJADORES -----------------------------------------
  const handleListItemClick = (event, id) => {
    setSelectedIDFile(id);
  };
  // ------------------- FUNCIONES AUXILIARES -----------------------------------------

  // ------------------- ITEMS -----------------------------------------
  const DemosListItems = () => {
    var files = props.filesUploaded.files;
    var items = [];
    if (files) {
      for (let i = 0; i < Object.keys(files).length; i++) {
        if (files[i].isDemo) {
          items.push(
            <ListItemButton
              key={files[i].id}
              selected={selectedIDFile === files[i].id}
              onClick={(event) => handleListItemClick(event, files[i].id)}
            >
              <ListItemText primary={files[i].fileName} />
            </ListItemButton>
          );
        }
      }
    }
    return items;
  };

  const UploadedFilesItems = () => {
    // var files = props.filesUploaded.files;
    // var items = [];
    // if (files) {
    //   for (let i = 0; i < Object.keys(files).length; i++) {
    //     if (!files[i].isDemo) {
    //       items.push(
    //         <ListItemButton
    //           key={files[i].id}
    //           selected={selectedIDFile === files[i].id}
    //           onClick={(event) => handleListItemClick(event, files[i].id)}
    //         >
    //           <ListItemText primary={files[i].fileName} />
    //           <IconButton edge="end" aria-label="delete">
    //             <DeleteIcon />
    //           </IconButton>
    //         </ListItemButton>
    //       );
    //     }
    //   }
    // }
    // return items;
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
    </Box>
  );
}
