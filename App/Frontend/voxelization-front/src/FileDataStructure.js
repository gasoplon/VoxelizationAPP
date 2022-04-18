import * as Constants from "./constants.js";
import { v4 as uuidv4 } from "uuid";

export class FilesStructure {
  //   #demos;

  constructor() {
    this.demos = {};
    this.fileUploaded = undefined;

    // Inicializa los DEMOS
    if (Constants.DEMOS_MODELS) {
      Constants.DEMOS_MODELS.forEach((value) => {
        var newFile = new SingleFileDataStructure(
          value,
          ".obj",
          Constants.ROOT_MODELS_DEMOS_PATH,
          true
        );
        this.demos[newFile.id] = newFile;
      });
    }
  }

  // GETTERS
  get allFilesIDs() {
    var keys = Object.keys(this.demos);
    if (this.fileUploaded) keys.push(this.fileUploaded.id);
    return keys;
  }

  demosFilesIDs() {
    return Object.keys(this.demos);
  }

  getFileByID(ID) {
    var file = this.demos[ID];
    if (!file && this.fileUploaded && this.fileUploaded.id === ID)
      file = this.fileUploaded;
    // else if (this.fileUploaded) file = this.fileUploaded.attached[ID];
    return file;
  }

  addUploadedFile(newDataStructure) {
    this.fileUploaded = newDataStructure;
  }

  removeAttached(ID) {
    delete this.attached[ID];
  }
}

export class SingleFileDataStructure {
  attached;

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
      this.attached = {};
    }
    if (!isDemoFile) {
      this.pathFile = URL.createObjectURL(file);
      this.originalPathFile = this.pathFile;
    } else {
      this.pathFile = prePath + fileName + extension;
      this.originalPathFile = prePath + fileName + extension;
    }
  }
  // GETTERS
  //   get attached() {
  //     return this.attached;
  //   }

  //METHODS
  addAttachedFile(newDataStructure) {
    this.attached[newDataStructure.id] = newDataStructure;
  }

  removeAllAttachedFiles() {
    //TODO: Remove URLs generated
    this.attached = {};
  }
}
