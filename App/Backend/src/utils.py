import logging
import os
from Exceptions import *
from config import config

# Constantes
FILE_NAME = 'fileUploaded'
ALLOWED_EXTENSIONS = {'obj'}
BLENDER_COMMAND = 'blender --background --factory-startup --python ./scripts/blender_script.py -- {} {}'

def allowed_file_extension(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def checkFileUploaded(files):
    # Logger
    logger = logging.getLogger(__name__)

    # Check file sended
    if files is None:
        raise NoFileSendedError

    # Get file
    file = files[FILE_NAME]
    logger.debug(file)

    # Check file type
    if not file or not allowed_file_extension(file.filename):
        raise NotAllowedExtension

    return file

# METODOS DE VOXELIZACION


def voxelization(file_name):
    os.system(BLENDER_COMMAND.format(config['DIRECTORY_UPLOADED_FILE'] +'/'+ file_name, config['FILES_PROCESSED'] + '/' + file_name))
    return None
