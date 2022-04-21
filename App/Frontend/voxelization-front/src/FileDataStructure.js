import * as Constants from "./constants.js";
import { v4 as uuidv4 } from "uuid";

export class FilesStructure {
  //   #demos;

  constructor(fileUploaded = undefined, attachedFiles = {}) {
    this.demos = DEMOS;
    this.fileUploaded = fileUploaded;
    this.attachedFiles = attachedFiles;
  }

  // GETTERS
  get allFilesIDs() {
    var keys = Object.keys(this.demos);
    if (this.fileUploaded) keys.push(this.fileUploaded.id);
    if (this.attachedFiles) keys.push(this.attachedFiles);
    return keys;
  }

  demosFilesIDs() {
    return Object.keys(this.demos);
  }

  getFileByID(ID) {
    var file = this.demos[ID];
    if (!file && this.fileUploaded && this.fileUploaded.id === ID)
      file = this.fileUploaded;
    else if (!file && this.fileUploaded && this.attachedFiles)
      file = this.attachedFiles[ID];
    return file;
  }

  addUploadedFile(newDataStructure) {
    this.fileUploaded = newDataStructure;
  }

  removeByID(ID) {
    var file = this.getFileByID(ID);
    if (file) {
      if (file.isAttached) {
        console.log(this.attachedFiles[ID]);
        delete this.attachedFiles[ID];
      } else {
        this.attachedFiles = {};
        this.fileUploaded = undefined;
      }
    }
  }
  addAttachedFile(newDataStructure) {
    this.attachedFiles[newDataStructure.id] = newDataStructure;
  }

  clone() {
    return new FilesStructure(this.fileUploaded, this.attachedFiles);
  }
}

export class SingleFileDataStructure {
  constructor(
    fileName,
    extension,
    prePath,
    isDemoFile,
    file = null,
    isAttached
  ) {
    this.id = uuidv4();
    this.fileName = fileName + extension;
    this.isDemo = isDemoFile;
    this.errores = [
      // ["ERROR", "Demasiados objetos"],
      // ["WARN", "Demasiados objetos"],
    ];

    if (isAttached) this.isAttached = true;
    else {
      this.isAttached = false;
    }
    if (!isDemoFile) {
      this.pathFile = URL.createObjectURL(file);
      this.originalPathFile = this.pathFile;
    } else {
      this.pathFile = prePath + fileName + extension;
      this.originalPathFile = prePath + fileName + extension;
    }
  }
}
var DEMOS = {};
// Inicializa los DEMOS
if (Constants.DEMOS_MODELS) {
  Constants.DEMOS_MODELS.forEach((value) => {
    var newFile = new SingleFileDataStructure(
      value,
      ".obj",
      Constants.ROOT_MODELS_DEMOS_PATH,
      true
    );
    DEMOS[newFile.id] = newFile;
  });
}
