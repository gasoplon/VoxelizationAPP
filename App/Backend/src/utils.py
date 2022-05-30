import logging
import os
from statistics import mean
# from mosaic_generation import *

import ERROR_CODES
from Exceptions import *
from config import config
from re import *

from PIL import Image
from scipy import spatial
import numpy as np
import glob

import time


import math
# Constantes
BLENDER_COMMAND = 'blender --background --factory-startup --python ./scripts/voxelization.py -- {} {} {} {} {} {} {}'

# TimeStamp
DEBUG_TIME = False
start = None
end = None


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
def Voxelization(UUID, file_name, resolution, removeDisconnectedElements):
    formatted_command = BLENDER_COMMAND.format(
        config['DIRECTORY_UPLOADED_FILE'] + '/' + file_name, config['DIRECTORY_FILES_PROCESSED'] + '/' + file_name, resolution, removeDisconnectedElements, UUID, config['DIRECTORY_FILES_BAKED_TEXTURES'], config['BAKED_FILES_EXTENSION'])
    output = os.popen(formatted_command)
    out_str = output.read()
    print(out_str)
    errors = findall("ERR_CODE: \d", out_str)
    polygons = eval(search("VERTICES_INI(.+)VERTICES_FIN", out_str).group(1))
    # logger.info(polygons)
    logger.error(errors)
    for e in errors:
        if('1' in e):
            raise InvalidAPIParameterException(
                ERROR_CODES.NO_SINGLE_ELEMENT_IN_FILE_ERROR_030)
    return polygons


def Mosaic(polygons, UUID):
    # start = time.time()
    # Configuracion
    main_photo = Image.open(
        "..\\TEXTURAS_Y_MODELOS\\API_FILES\\bakedTextures\\" + UUID + ".png")
    width, height = main_photo.size

    tile_paths = []
    for tile_path in os.listdir(config['DIRECTORY_MINECRAFT_TEXTURES']):
        tile_paths.append(
            str(config['DIRECTORY_MINECRAFT_TEXTURES'] + '\\'+tile_path))

    tiles = []
    # Cálculo del nº de tiles necesarias en cada eje
    tile_size = (polygons[0][1][0]-polygons[0][0][0])
    n_tiles = math.ceil(1.0 / tile_size)
    total_large = int(n_tiles * 16)
    mosaic_img = Image.new('RGB', (total_large, total_large))
    for path in tile_paths:
        tile = Image.open(path)
        # tile = tile.resize(tile_size)
        tiles.append(tile)

    colors = []
    for tile in tiles:
        mean_color = np.array(tile).mean(axis=0).mean(axis=0)
        if(mean_color.shape and mean_color.shape[0] == 4):
            colors.append(mean_color)

    tree = spatial.KDTree(colors)

    for p in polygons:
        # p[0][0] *= width
        # p[0][1] *= height
        # p[1][0] *= width
        # p[1][1] *= height
        # Get crop image
        crop_img = main_photo.crop(
            (p[0][0] * width, p[0][1] * height, p[1][0] * width, p[1][1] * height))
        mean_color = np.array(crop_img).mean(axis=0).mean(axis=0)
        closest = tree.query(mean_color)
        sup_izq = (int(p[0][0] * total_large),  int(p[0][1] * total_large))
        sup_der = (int(p[0][0] * total_large) +
                   16,  int(p[0][1] * total_large))
        inf_izq = (int(p[0][0] * total_large),
                   int(p[0][1] * total_large) + 16)
        inf_der = (int(p[1][0] * total_large),  int(p[1][1] * total_large))
        mosaic_img.paste(tiles[closest[1]],
                         box=(sup_izq, sup_der, inf_izq, inf_der))

    mosaic_img.save("mosaic_img.jpg")

    # end = time.time()
    # print("TIME: " + str(end-start))

    pass
