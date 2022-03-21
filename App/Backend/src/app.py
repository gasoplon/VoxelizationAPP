from flask import Flask, request, jsonify
from config import config
from utils import *
from Exceptions import *
from flask_wtf.csrf import CSRFProtect

import uuid
import coloredlogs
import logging

import ERROR_CODES

# TODO: Implementar API KEY https://geekflare.com/es/securing-flask-api-with-jwt/


def create_app(enviroment):
    app = Flask(__name__)
    app.config.from_object(enviroment)
    return app


# Logger
logger = logging.getLogger(__name__)
coloredlogs.install(level='DEBUG')

# Configuración
enviroment = config['development']
app = create_app(enviroment)
# TODO: No funciona session cookie
# TODO: Comprobar CSRF
# app.secret_key = "secret_key"
# csrf = CSRFProtect(app)

# Directorio de subida de archivos
# if not os.path.exists(config['DIRECTORY_UPLOADED_FILE']):
#     os.makedirs(config['DIRECTORY_UPLOADED_FILE'])
# TODO: Y si no existe el directorio?
uploads_dir = os.path.join(config['DIRECTORY_UPLOADED_FILE'])
os.makedirs(uploads_dir, exist_ok=True)
processed_dir = os.path.join(config['DIRECTORY_FILES_PROCESSED'])
os.makedirs(processed_dir, exist_ok=True)

# Manejo de errores
# TODO: Cambiar codigo de vuelta


def invalid_api_usage(e):
    response = jsonify(e.to_dict())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 300


# Registro de manejadores
app.register_error_handler(InvalidAPIParameterException, invalid_api_usage)
# app.register_error_handler(InvalidResolutionRangeException, invalid_api_usage)
# app.register_error_handler(InvalidResolutionTypeException, invalid_api_usage)
# app.register_error_handler(NotAllowedFileExtensionException, invalid_api_usage)
# app.register_error_handler(MissingArgumentsException, invalid_api_usage)

# Método de apoyo para enviar respuesta
# def sendResponse(exc):
#     response = jsonify({'message': "OK" })
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response, exc.code


@app.route('/api/uploadFile', methods=['POST'])
def receive_file():
    # PARÁMETROS DE ENTRADA
    # ==============================================================
    # Resolucion para la voxelización
    try:
        resolution = request.form['resolutionVoxel']
    except KeyError as e:
        resolution = None
    # Usar eliminar elementos inconexos
    try:
        removeDisconnectedElements = request.form['useRemoveDisconnected']
    except KeyError as e:
        removeDisconnectedElements = None

    missingArguments = []
    if(not resolution):
        missingArguments.append("resolution")
    if(not removeDisconnectedElements):
        missingArguments.append("remove_disconnected_elements")
    if(not request.files or len(request.files) != 1):
        missingArguments.append("file")

    if(len(missingArguments) > 0):
        raise InvalidAPIParameterException(
            ERROR_CODES.MISSING_PARAMETERS_ERROR_013, missingArguments)

    try:
        resolution = int(resolution)
    except ValueError as exc:
        raise InvalidAPIParameterException(
            ERROR_CODES.INVALID_RESOLUTION_TYPE_ERROR_011)

    if(resolution > 24 or resolution < 1):
        raise InvalidAPIParameterException(
            ERROR_CODES.INVALID_RESOLUTION_RANGE_ERROR_010)

    if(removeDisconnectedElements not in ['true', 'false']):
        raise InvalidAPIParameterException(
            ERROR_CODES.INVALID_REMOVE_DISCONNECTED_ELEMENTS_TYPE_ERROR_014)

    removeDisconnectedElements = bool(removeDisconnectedElements)

    # Analizar el fichero de entrada
    file = checkFileUploaded(request.files)

    # ==============================================================
    # Guardar archivo y voxelizar figura
    if file:
        new_UUID = uuid.uuid1()
        file_name = str(new_UUID) + '.obj'
        file.save(os.path.join(uploads_dir, file_name))

        # Voxelization Algorithm
        voxelization(file_name, resolution, removeDisconnectedElements)

    # TODO: Texturing.......

    # TODO: Minecraft Command.......

    # TODO: Send OK, archivo, comando...
    response = jsonify({'message': 'Ok'})
    return response


if __name__ == '__main__':
    app.run(debug=True)
