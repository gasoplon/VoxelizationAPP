import logging
import os
import cv2
from cv2 import norm
import ERROR_CODES
from Exceptions import *
from config import config
from re import *
from PIL import Image, ImageDraw
from scipy import spatial
import numpy as np
import json
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
    # logger.error(out_str)
    errors = findall("ERR_CODE: \d", out_str)
    logger.error(errors)
    uvs_info = eval(search("UV_INFO(.+)UV_INFO", out_str).group(1))
    # logger.info(polygons)
    for e in errors:
        if('1' in e):
            raise InvalidAPIParameterException(
                ERROR_CODES.NO_SINGLE_ELEMENT_IN_FILE_ERROR_030)
    return uvs_info

# GENERACIÓN DE MOISACO


def Mosaic(uvs_info, UUID):
    # start = time.time()
    # Configuracion
    file = open("map_coords_mosaic.txt", "r")
    tiles_textures = json.loads(file.read())
    main_photo = Image.open(getAbsolutePath(
        config["DIRECTORY_FILES_BAKED_TEXTURES"], UUID + ".png"))
    h, w = main_photo.size
    mosaic_size = int(math.sqrt(uvs_info["n_tiles"])) * 16
    mosaic_img = Image.new('RGB', (mosaic_size, mosaic_size))

    colors = []
    tiles = []
    for tile_path in os.listdir(config['DIRECTORY_MINECRAFT_TEXTURES']):
        absolute_tile_path = getAbsolutePath(
            config['DIRECTORY_MINECRAFT_TEXTURES'], tile_path)
        tile = Image.open(absolute_tile_path)
        if(tile.mode == "RGB"):
            tile = tile.convert('RGBA')
        mean_color = np.array(tile).mean(axis=0).mean(axis=0)
        if(mean_color.shape and mean_color.shape[0] == 4):
            tiles.append(tile)
            colors.append(mean_color)
    tree = spatial.KDTree(colors)

    tile_size = uvs_info["wh_size"]
    verts = uvs_info["verts"]
    for v in verts:
        vv = (v[0] + tile_size, v[1] + tile_size)
        v0 = (v[0] * h, (1.0 - v[1]) * w)
        v1 = (vv[0] * h, (1.0 - vv[1]) * w)
        crop_img = main_photo.crop((v0[0], v0[1], v1[0], v1[1]))
        mean_color = np.array(crop_img).mean(axis=0).mean(axis=0)
        closest = tree.query(mean_color)
        p_x = int(v[0] * mosaic_size)
        # if(p_x % 16 != 0):
        #     p_x = p_x - 1
        v_paste = (p_x, int((1.0 - v[1]) * mosaic_size))
        mosaic_img.paste(tiles[closest[1]], v_paste)
    mosaic_img.save(
        config["DIRECTORY_MOSAICS_GENERATED"] + "/" + UUID + ".jpeg", quality=100, subsampling=0)
    # Lecturas de texturas de las tiles
    # tiles = []
    # colors = []
    # for tile_path in os.listdir(config['DIRECTORY_MINECRAFT_TEXTURES']):
    #     absolute_tile_path = getAbsolutePath(
    #         config['DIRECTORY_MINECRAFT_TEXTURES'], tile_path)
    #     tile = Image.open(absolute_tile_path)
    #     if(tile.mode == "RGB"):
    #         tile = tile.convert('RGBA')
    #     mean_color = np.array(tile).mean(axis=0).mean(axis=0)
    #     if(mean_color.shape and mean_color.shape[0] == 4):
    #         tiles.append(tile)
    #         colors.append(mean_color)

    # tree = spatial.KDTree(colors)
    # for p in polygons:
    #     # Get crop image (left, upper, right, lower)
    #     # logger.error(p[2])
    #     A = [p[0][0] * width, (1.0 - p[0][1]) * height]
    #     B = [p[1][0] * width, (1.0 - p[1][1]) * height]
    #     crop_img = main_photo.crop((A[0], A[1], B[0], B[1]))

    #     # Media de color
    #     mean_color = np.array(crop_img).mean(axis=0).mean(axis=0)
    #     closest = tree.query(mean_color)
    #     ####################################################################
    #     # Aplicar rotación
    #     ang = p[2][0]
    #     if(ang != 0.0):
    #         p2 = Image.fromarray(rotateImageByAngle(
    #             np.array(tiles[closest[1]]), ang))
    #         # mosaic_img_array = np.array(mosaic_img)
    #         # img = pasteImg(mosaic_img_array[:, :, :3].copy(), crop_img_rotated[:, :, :3],
    #         #                int(A[0]), int(A[1]), crop_img_rotated[:, :, 3] / 255.0)
    #         # mosaic_img =
    #         sup_izq = (round(p[0][0] * total_large),
    #                    round((1.0 - p[0][1]) * total_large))
    #         mosaic_img.paste(p2, sup_izq)
    #     else:
    #         ####################################################################
    #         # Paste tile
    #         sup_izq = (round(p[0][0] * total_large),
    #                    round((1.0 - p[0][1]) * total_large))
    #         mosaic_img.paste(tiles[closest[1]], sup_izq)

    mosaic_img.save(
        config["DIRECTORY_MOSAICS_GENERATED"] + "/" + UUID + ".jpeg", quality=100, subsampling=0)

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
