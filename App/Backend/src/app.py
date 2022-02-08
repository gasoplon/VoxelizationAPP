from flask import Flask, request, jsonify
from config import config
from utils import checkFileUploaded
from Exceptions import *

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


@app.route('/api/uploadFile', methods=['POST'])
def receive_file():
    # Analizar el fichero de entrada
    try:
        checkFileUploaded(request.files)
    except Exception as exc:
        response = jsonify({'message': exc.message})

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(debug=True)
