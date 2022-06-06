import logging
import os

# from mosaic_generation import *

import ERROR_CODES
from Exceptions import *
from config import config
from re import *

from PIL import Image
from scipy import spatial
import numpy as np


import math
# Constantes
BLENDER_COMMAND_VOXELIZATION = 'blender --background --factory-startup --python ./scripts/voxelization.py -- {} {} {} {} {} {} {}'

BLENDER_COMMAND_APPLY_TEXTURE = 'blender --background --factory-startup --python ./scripts/texture_aplying.py -- {} {}'

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
    path_model_file_in = os.path.join(
        config['DIRECTORY_UPLOADED_FILE'], file_name)
    path_model_file_out = os.path.join(
        config['DIRECTORY_FILES_PROCESSED'], file_name)
    formatted_command = BLENDER_COMMAND_VOXELIZATION.format(
        path_model_file_in,
        path_model_file_out,
        resolution,
        removeDisconnectedElements,
        UUID,
        config['DIRECTORY_FILES_BAKED_TEXTURES'],
        config['BAKED_FILES_EXTENSION'])

    output = os.popen(formatted_command)
    out_str = output.read()
    errors = findall("ERR_CODE: \d", out_str)
    polygons = eval(search("VERTICES_INI(.+)VERTICES_FIN", out_str).group(1))
    # logger.info(polygons)
    logger.error(errors)
    for e in errors:
        if('1' in e):
            raise InvalidAPIParameterException(
                ERROR_CODES.NO_SINGLE_ELEMENT_IN_FILE_ERROR_030)
    return polygons


# GENERACIÓN DE MOISACO
def Mosaic(polygons, UUID):
    # start = time.time()
    # Configuracion
    main_photo_path = getAbsolutePath(
        config["DIRECTORY_FILES_BAKED_TEXTURES"], UUID + ".png")
    main_photo = Image.open(main_photo_path)
    width, height = main_photo.size

    # Cálculo del nº de tiles necesarias en cada eje
    tile_size = (polygons[0][1][0]-polygons[0][0][0])
    n_tiles = math.ceil(1.0 / tile_size)
    total_large = int(n_tiles * 16)
    mosaic_img = Image.new('RGB', (total_large, total_large))

    # Lecturas de texturas de las tiles
    tiles = []
    for tile_path in os.listdir(config['DIRECTORY_MINECRAFT_TEXTURES']):
        absolute_tile_path = getAbsolutePath(
            config['DIRECTORY_MINECRAFT_TEXTURES'], tile_path)
        tile = Image.open(absolute_tile_path)
        tiles.append(tile)

    # Colores mas usados de las tiles
    colors = []
    for tile in tiles:
        mean_color = np.array(tile).mean(axis=0).mean(axis=0)
        if(mean_color.shape and mean_color.shape[0] == 4):
            colors.append(mean_color)

    tree = spatial.KDTree(colors)

    # resized_photo = main_photo.resize((int(np.round(
    #     main_photo.size[0] / tile_size[0])), int(np.round(main_photo.size[1] / tile_size[1]))))

    for p in polygons:
        # Get crop image (left, upper, right, lower)
        A = [p[0][0] * width, (1.0 - p[0][1]) * height]
        B = [p[1][0] * width, (1.0 - p[1][1]) * height]
        crop_img = main_photo.crop((A[0], A[1], B[0], B[1]))

        # Media de color
        mean_color = np.array(crop_img).mean(axis=0).mean(axis=0)
        closest = tree.query(mean_color)

        # Cálculo del ángulo de rotación
        # p0 = [p[1][0], p[1][1]]
        # p1 = [p[0][0], p[0][1]]
        # p2 = [p[0][0], p[0][1] + tile_size]
        # # print(str(p[0][0])+", "+str(p[0][1]) +
        # #       " -- "+str(p[1][0])+", "+str(p[1][1]))
        # v0 = np.array(p0) - np.array(p1)
        # v1 = np.array(p2) - np.array(p1)
        # angle = np.degrees(np.math.atan2(
        #     np.linalg.det([v0, v1]), np.dot(v0, v1)))
        # print(angle)
        # if(angle != 45.0):
        #     tiles[closest[1]] = tiles[closest[1]].rotate(
        #         angle=angle)

        # Paste tile
        sup_izq = (int(p[0][0] * total_large),
                   math.ceil((1.0 - p[0][1]) * total_large))
        mosaic_img.paste(tiles[closest[1]], sup_izq)

    mosaic_img.save(
        config["DIRECTORY_MOSAICS_GENERATED"] + "/" + UUID + ".jpeg", "JPEG")

    # end = time.time()
    # print("TIME: " + str(end-start))


# APLICAICÓN DE TEXTURA GENERADA
def applyTexture(fileName, UUID):
    formatted_command = BLENDER_COMMAND_APPLY_TEXTURE.format(
        os.path.join(config['DIRECTORY_FILES_PROCESSED'], fileName),
        os.path.join(config['DIRECTORY_MOSAICS_GENERATED'], UUID + ".jpeg"))
    output = os.popen(formatted_command)
    logger.error(output.read())


def getAbsolutePath(root, *args):
    path = ""
    for p in args:
        path = os.path.join(path, p)
    return os.path.abspath(os.path.join(root, path))
