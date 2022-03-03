import logging
import os
import ERROR_CODES
from Exceptions import *
from config import config

# Constantes
FILE_NAME = 'fileUploaded'
ALLOWED_EXTENSIONS = {'obj'}
BLENDER_COMMAND = 'blender --background --factory-startup --python ./scripts/blender_script.py -- {} {} {} {}'

# Logger
logger = logging.getLogger(__name__)

def allowed_file_extension(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def checkFileUploaded(files):
    # Get file
    file = files[FILE_NAME]
    logger.debug(file)
        
    if not allowed_file_extension(file.filename):
        raise InvalidAPIParameterException(ERROR_CODES.NOT_ALLOWED_FILE_EXTENSION_ERROR_012)
    
    return file

# METODOS DE VOXELIZACION
def voxelization(file_name, resolution = 4, removeDisconnectedElements = False):
    # os.system(BLENDER_COMMAND.format(config['DIRECTORY_UPLOADED_FILE'] +'/'+ file_name, config['FILES_PROCESSED'] + '/' + file_name))
    formatted_command = BLENDER_COMMAND.format(config['DIRECTORY_UPLOADED_FILE'] +'/'+ file_name, config['FILES_PROCESSED'] + '/' + file_name, resolution, removeDisconnectedElements)
    output = os.popen(formatted_command)
    logger.debug(output.read())
    # logger.debug(output.returncode)
    return None
