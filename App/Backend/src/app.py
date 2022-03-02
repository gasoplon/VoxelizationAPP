from flask import Flask, request, jsonify
from config import config
from utils import *
from Exceptions import *

import uuid
import coloredlogs
import logging

#TODO: Implementar API KEY https://geekflare.com/es/securing-flask-api-with-jwt/
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

# Directorio de subida de archivos
# if not os.path.exists(config['DIRECTORY_UPLOADED_FILE']):
#     os.makedirs(config['DIRECTORY_UPLOADED_FILE'])
# TODO: Y si no existe el directorio?
uploads_dir = os.path.join(config['DIRECTORY_UPLOADED_FILE'])
os.makedirs(uploads_dir, exist_ok=True)

# Manejo de errores
def invalid_api_usage(e):
    # response = jsonify({'status': e.to_dict()})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response, e.status_code
    return jsonify(e.to_dict())

# Registro de manejadores
app.register_error_handler(InvalidAPIParameterException, invalid_api_usage)
app.register_error_handler(InvalidResolutionRangeException, invalid_api_usage)
app.register_error_handler(InvalidResolutionTypeException, invalid_api_usage)
app.register_error_handler(NotAllowedFileExtensionException, invalid_api_usage)
app.register_error_handler(MissingArgumentsException, invalid_api_usage)

# Método de apoyo para enviar respuesta
def sendResponse(exc):
    response = jsonify({'message': "OK" })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, exc.code

@app.route('/api/uploadFile', methods=['POST'])
def receive_file():
    # PARÁMETROS DE ENTRADA
    # Analizar el fichero de entrada
    response = jsonify({'message': 'Ok'})
    return response
    file = checkFileUploaded(request.files)

    # Resolucion para la voxelización
    resolution = request.form['resolutionVoxel']
    
    # Usar eliminar elementos inconexos
    removeDisconnectedElements = bool(request.form['useRemoveDisconnected'])

    missingArguments = []
    if(not resolution):
        missingArguments.append("resolution")
    if(not removeDisconnectedElements):
        missingArguments.append("remove_disconnected_elements")
    if(not file):
        missingArguments.append("file")

    if(len(missingArguments) > 0):
        raise MissingArgumentsException(missingArguments)

    try:
        resolution = int(resolution)
    except ValueError as exc:
        raise InvalidResolutionTypeException

    if(resolution > 24 or resolution < 1):
            raise InvalidResolutionRangeException    



    # Guardar archivo y voxelizar figura
    if file:
        new_UUID = uuid.uuid1()
        file_name = str(new_UUID) + '.obj'
        file.save(os.path.join(uploads_dir, file_name))

        # Voxelization Algorithm
        voxelization(file_name, resolution, removeDisconnectedElements);



    # TODO: Texturing.......



    # TODO: Minecraft Command.......



    # TODO: Send OK, archivo, comando...
    response = jsonify({'message': 'Ok'})
    return response


if __name__ == '__main__':
    app.run(debug=True)
