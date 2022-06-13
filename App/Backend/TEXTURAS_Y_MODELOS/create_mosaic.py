import json
import os
from PIL import Image
import math
import numpy as np


textures_path = "./MINECRAFT_TEXTURES"
f_out = open("map_coords_mosaic.txt", "w")
n_texts = 491
hw_text = 16
tiles_on_axis = math.ceil(math.sqrt(n_texts))
final_mosaic = Image.new(
    'RGB', (tiles_on_axis * hw_text, tiles_on_axis * hw_text))
index = 0
row = 0
sup_izq = (0, 0)
data_struct_textures = []

tiles = []
colors = []
i = 0
for tile_path in os.listdir(textures_path):
    absolute_tile_path = textures_path + "/" + tile_path
    tile = Image.open(absolute_tile_path)
    if(tile.mode == "RGB"):
        tile = tile.convert('RGBA')
    mean_color = np.array(tile).mean(axis=0).mean(axis=0)
    if(mean_color.shape and mean_color.shape[0] == 4):
        tiles.append(tile)
        colors.append(mean_color)
        final_mosaic.paste(tile, sup_izq)
        data_struct_textures.append({
            'texture_name': tile_path.split(".")[0],
            'x': sup_izq[0],
            'y': sup_izq[1],
            'mean_color': [mean_color[0], mean_color[1], mean_color[2], mean_color[3]]
        })
        index += 1
        if(index == tiles_on_axis):
            index = 0
            row += 1
        sup_izq = (index * hw_text, row * hw_text)

f_out.write(json.dumps(data_struct_textures))
f_out.close()
final_mosaic.save("./mosaic.jpeg", quality=100, subsampling=0)
