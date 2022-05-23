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

  clone() {
    return new FilesStructure(this.fileUploaded);
  }
}

export class SingleFileDataStructure {
  constructor(fullNameFile, file = null) {
    this.id = uuidv4();
    this.fileName = fullNameFile;
    this.isDemo = !file;
    this.pathModifiedFile = null;
    if (this.isDemo)
      this.pathFile = Constants.ROOT_MODELS_DEMOS_PATH + fullNameFile;
    else this.pathFile = URL.createObjectURL(file);
    // var file_name = file ? file.name.split(".")[0] : fullNameFile.split(".")[0];
    // var file_ext = file ? file.name.split(".")[1] : fullNameFile.split(".")[1];
    // this.errores = [
    //   // ["ERROR", "Demasiados objetos"],
    //   // ["WARN", "Demasiados objetos"],
    // ];
  }

  getFile() {
    return this._getBlobByURL(this.pathFile);
  }

  async _getBlobByURL(URL) {
    const data = await fetch(URL);
    return await data.blob();
  }
}

// Carga de DEMOS
const DEMOS = {};
if (Constants.DEMOS_MODELS) {
  Constants.DEMOS_MODELS.forEach((value) => {
    var newFile = new SingleFileDataStructure(value, null);
    DEMOS[newFile.id] = newFile;
  });
}
