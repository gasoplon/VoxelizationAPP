from flask import Flask, request, jsonify
from config import config
from utils import *
from Exceptions import *

import uuid
import coloredlogs
import logging


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
uploads_dir = os.path.join(config['DIRECTORY_UPLOADED_FILE'])
os.makedirs(uploads_dir, exist_ok=True)



@app.route('/api/uploadFile', methods=['POST'])
def receive_file():
    file = None
    resolution = None
    # Analizar el fichero de entrada
    try:
        file = checkFileUploaded(request.files)
        # Resolucion para la voxelización
        resolution = int(request.form['resolutionVoxel'])
        # Usar eliminar elementos inconexos
        removeDisconnectedElements = bool(request.form['useRemoveDisconnected'])
    except Exception as exc:
        response = jsonify({'message': exc.message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, exc.code
    
    if(not resolution):
        # TODO: Lanzar excepion
        pass
    if(1 < resolution or resolution > 24):
        # TODO: Lanzar excepcion
        pass

    # Save file and voxelization
    if file:
        #TODO: filename = secure_filename(file.filename)
        new_UUID = uuid.uuid1()
        file_name = str(new_UUID) + '.obj'
        file.save(os.path.join(uploads_dir, file_name))

        # Voxelization Algorithm
        voxelization(file_name, resolution, removeDisconnectedElements);

    response = jsonify({'message': 'Ok'})
    return response


if __name__ == '__main__':
    app.run(debug=True)
