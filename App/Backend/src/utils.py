import logging
import os

import ERROR_CODES
from Exceptions import *
from config import config
from re import *

# Constantes
BLENDER_COMMAND = 'blender --background --factory-startup --python ./scripts/voxelization.py -- {} {} {} {}'

# Logger
logger = logging.getLogger(__name__)


def list_to_string(list):
    return ''.join(list)


def allowed_file_extension(filename, extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower(
           ) in extensions


def checkFileUploaded(files):
    # Get main file
    mainFile = files[config['API_PARAM_MAIN_FILE']]
    logger.debug(mainFile)

    if not allowed_file_extension(mainFile.filename, config['ALLOWED_EXTENSIONS_MODEL_FILE']):
        raise InvalidAPIParameterException(
            ERROR_CODES.NOT_ALLOWED_FILE_EXTENSION_ERROR_012, list_to_string(config['ALLOWED_EXTENSIONS_MODEL_FILE']))

    return mainFile


# METODOS DE VOXELIZACION
def voxelization(file_name, resolution, removeDisconnectedElements):
    formatted_command = BLENDER_COMMAND.format(
        config['DIRECTORY_UPLOADED_FILE'] + '/' + file_name, config['DIRECTORY_FILES_PROCESSED'] + '/' + file_name, resolution, removeDisconnectedElements)
    output = os.popen(formatted_command)
    print(output.read())
    errors = findall("ERR_CODE: \d", output.read())
    logger.error(errors)
    for e in errors:
        if('1' in e):
            raise InvalidAPIParameterException(
                ERROR_CODES.NO_SINGLE_ELEMENT_IN_FILE_ERROR_030)
    return None
