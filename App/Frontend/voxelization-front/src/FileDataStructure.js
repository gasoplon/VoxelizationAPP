import * as Constants from "./constants.js";
import { v4 as uuidv4 } from "uuid";

export class FilesStructure {
  #demos;
  fileUploaded;

  constructor(fileUploaded = undefined) {
    this.#demos = DEMOS;
    this.fileUploaded = fileUploaded;
  }

  // GETTERS
  get demosFilesIDs() {
    var keys;
    this.#demos ? (keys = Object.keys(this.#demos)) : (keys = []);
    return keys;
  }

  // METODOS
  getFileByID(ID) {
    var file = this.#demos[ID];
    if (!file && this.fileUploaded && this.fileUploaded.id === ID)
      file = this.fileUploaded;
    else if (!file && this.fileUploaded)
      file = this.fileUploaded._getAttachedByID(ID);
    return file;
  }

  addUploadedFile(newDataStructure) {
    this.fileUploaded = newDataStructure;
  }

  removeFileByID(ID) {
    var file = this.getFileByID(ID);
    if (file) {
      if (file.isAttached) {
        this.fileUploaded._removeAttachedFile(ID);
      } else {
        this.fileUploaded = undefined;
      }
    }
  }
  addAttachedFile(newDataStructure) {
    this.fileUploaded._addAttachedFile(newDataStructure);
  }

  clone() {
    return new FilesStructure(this.fileUploaded);
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
    this.attachedFiles = {};
    this.isAttached = isAttached;
    if (!isDemoFile) {
      this.pathFile = URL.createObjectURL(file);
      this.originalPathFile = this.pathFile;
    } else {
      this.pathFile = prePath + fileName + extension;
      this.originalPathFile = prePath + fileName + extension;
    }
  }

  _getAttachedByID(ID) {
    var file = this.attachedFiles[ID];
    return file;
  }

  _removeAttachedFile(ID) {
    delete this.attachedFiles[ID];
  }

  _addAttachedFile(newDataStructure) {
    this.attachedFiles[newDataStructure.id] = newDataStructure;
  }

  _getAttachedIDs() {
    return Object.keys(this.attachedFiles);
  }

  getBlobs() {
    let fileNames = [];
    let promises = [];
    // Main file
    promises.push(this._getBlobByURL(this.pathFile));
    fileNames.push(this.fileName);
    // Attacheds files
    Object.keys(this.attachedFiles).forEach((ID) => {
      let f = this._getAttachedByID(ID);
      promises.push(this._getBlobByURL(f.pathFile));
      fileNames.push(f.fileName);
    });
    let masterPromise = Promise.allSettled(promises);
    return { fileNames, masterPromise };
  }

  async _getBlobByURL(URL) {
    const data = await fetch(URL);
    return await data.blob();
  }
}

const DEMOS = {};
if (Constants.DEMOS_MODELS) {
  Constants.DEMOS_MODELS.forEach((value) => {
    var newFile = new SingleFileDataStructure(
      value,
      Constants.DEMOS_EXTENSION,
      Constants.ROOT_MODELS_DEMOS_PATH,
      true
    );
    DEMOS[newFile.id] = newFile;
  });
}
