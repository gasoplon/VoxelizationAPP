import logging
import os
from Exceptions import *

# Constantes
FILE_NAME = 'fileUploaded'
ALLOWED_EXTENSIONS = {'obj'}


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

    # Save file
    # file[FILE_NAME].save(os.path.join('./', 'prueba.txt'))

    return None
