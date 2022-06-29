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


def scale(val, src, dst):
    return ((val - src[0]) / (src[1]-src[0])) * (dst[1]-dst[0]) + dst[0]


def Mosaic(uvs_info, UUID):
    # start = time.time()
    main_photo = Image.open(getAbsolutePath(
        config["DIRECTORY_FILES_BAKED_TEXTURES"], UUID + ".png"))
    h, w = main_photo.size
    mosaic_size = math.ceil(math.sqrt(uvs_info["n_tiles"])) * 16
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
            tiles.append([tile, tile_path.split(".")[0]])
            colors.append(mean_color)
    tree = spatial.KDTree(colors)
    textureBlocks = []
    # tile_size = uvs_info["wh_size"]
    for key in uvs_info["blocks"].keys():
        block = uvs_info["blocks"][key]
        texture = None
        for face in block:
            # UV esquina inferior izq. de la tile
            v = face["coord"]
            # esquina superior izq. para hacer el crop
            v0 = (v[0] * h, (mosaic_size - 16) - (v[1] * w))
            v1 = (v0[0] + 16,  v0[1] + 16)
            # print(v, v0, v1)
            crop_img = main_photo.crop((v0[0], v0[1], v1[0], v1[1]))
            mean_color = np.array(crop_img).mean(axis=0).mean(axis=0)
            closest = tree.query(mean_color)
            p_x = int(v0[0])
            p_y = int(v0[1])
            if(p_x % 16 != 0):
                p_x_0 = p_x - 1
                p_x_1 = p_x + 1
                if(p_x_0 % 16 == 0):
                    p_x = p_x_0
                else:
                    p_x = p_x_1
            if(p_y % 16 != 0):
                p_y_0 = p_y - 1
                p_y_1 = p_y + 1
                if(p_y_0 % 16 == 0):
                    p_y = p_y_0
                else:
                    p_y = p_y_1
            if(texture is None):
                texture = tiles[closest[1]][0]
                block_coords = key.split(",")
                textureBlocks.append(
                    [[block_coords[0], block_coords[1], block_coords[2]], tiles[closest[1]][1]])
                # uvs_info["blocks"][key]["blockName"] = tiles[closest[1]][1]
                # print(closest[1])
            mosaic_img.paste(texture, (p_x, p_y))
            # mosaic_img.paste(tiles[closest[1]], (p_x, p_y))
    # print(json.dumps(textureBlocks))
    mosaic_img.save(
        config["DIRECTORY_MOSAICS_GENERATED"] + "/" + UUID + ".jpeg", quality=95, subsampling=0)
    # end = time.time()
    # print("TIME: " + str(end-start))
    return textureBlocks


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

# CREAR COMANDO DE MINECRAFT


def createMinecraftCommand(blocks):
    command = "/summon falling_block ~ ~1 ~ {}"
    setblock_command = "/setblock ~{} ~{} ~{} minecraft:{}"
    FILL_COM = "{{Command:'"'/fill ~ ~-{} ~-1 ~ ~40 ~-1 redstone_block'"'}},Passengers:[{{id:falling_block,Block:redstone_block,Time:1}}]"
    # first_arg = Command, second_arg = Passengers
    passenger = "{{id:falling_block,Block:command_block,Time:1,TileEntityData:{{Command:'"'{}'"'}}{}}}"
    return command.format(recursiveCommandCreation(blocks, 0, len(blocks), passenger, setblock_command, FILL_COM))


def recursiveCommandCreation(blocks, indice, max, passenger, setblock_command, fill_com):
    if(indice == max):
        return passenger.format('/fill ~ ~-{} ~-1 ~ ~40 ~-1 redstone_block'.format(max), ",Passengers:[{id:falling_block,Block:redstone_block,Time:1}]")
    current_block = blocks[indice]
    sb_com = setblock_command.format(
        current_block[0][0], current_block[0][1], current_block[0][2], current_block[1])
    return passenger.format(sb_com, ",Passengers:[" + recursiveCommandCreation(blocks, indice+1, max, passenger, setblock_command, fill_com) + "]")
