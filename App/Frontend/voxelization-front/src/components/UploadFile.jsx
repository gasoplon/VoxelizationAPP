import React, { useState } from "react";
import axios from "axios";

export function UploadFile() {
  //Estado que guarda el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState(null);
  const [errores, setErrors] = useState("");

  //MANEJADORES
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // On file upload (click the upload button)
  const onFileUpload = () => {
    if (selectedFile === null) return;
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("fileUploaded", selectedFile, selectedFile.name);

    // Details of the uploaded file
    console.log(selectedFile);

    // Request made to the backend api
    // Send formData object
    axios
      .post("http://localhost:5000/api/uploadFile", formData)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        const error = {
          status: err.response["status"],
          message: err.response["data"]["message"],
        };
        console.error(error);
        setErrors(error["message"]);
      });
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Componente de carga(Pruebas de Algoritmo)</h1>
      <h3>File Upload using React!</h3>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {errores && (
        <h5 className="error" style={{ color: "red" }}>
          {errores}
        </h5>
      )}
      {fileData()}
    </div>
  );
}

export default UploadFile;
