import bpy
import sys
import bmesh
import time
import glob
# ////////////////////////  CTES  /////////////////////////////

DESC_FORMAT = "ERR_CODE: {} - {}."  # Errores
ERROR_NOT_ONE_ELEMENT_ON_SCENE = {
    'code': 200,
    'desc': DESC_FORMAT.format(1, 'Existe mas de un objeto en el archivo.')}
OTHERS_OBJS = ['Camera', 'Cube', 'Light']  # Otros objetos de la escena

# Conf
UV_IMAGE_RESOLUTION = 2048
ANGLE_LIMIT = 1.15191731  # 66º
APPLY_MODIFIERS = {
    "remesh": True,
    "triToQuad": True,
    "generateUVs": True,
    "extrude": True,
    "bake": True,
    "buildMosaic": False
}

# TIMES
TIMES_STR = "\n########## TIMES ##########\n"
TIMES_STR_FIN = "###########################\n"

# /////////////////  FUNCS AUXS.  ////////////////////////////


def setActive(obj):
    bpy.context.view_layer.objects.active = obj


def selectAllObjects():
    bpy.ops.object.select_all(action='SELECT')


def deselectAllObjects():
    bpy.ops.object.select_all(action='DESELECT')


def select_one_object(object_selected):
    setActive(object_selected)
    object_selected.select_set(True)


def remove_object(object):
    bpy.data.objects.remove(object)


# /////////////////////////////////////////////////////////////
# Parámetros de entrada
argv = sys.argv
argv = argv[argv.index("--") + 1:]
obj_in = argv[0]
obj_out = argv[1]
resolution = argv[2]
removeDisconnectedElements = True if argv[3] == "true" else False
file_name = argv[4]
baked_directory = argv[5]
baked_file_extension = argv[6]
# tiles_directory_path = argv[7]

# TimeStamp
DEBUG_TIME = True
start = None
end = None

# Importar escena
bpy.ops.import_scene.gltf(filepath=obj_in)

# Get object
obj_names = bpy.data.objects.keys()
obj_name = None
for o in obj_names:
    if(o not in OTHERS_OBJS):
        obj_name = o
    else:
        remove_object(bpy.data.objects[o])

# Comprobar que solo existe 1 objeto en la escena
if(len(obj_names) != 4 or obj_name == None):
    print(ERROR_NOT_ONE_ELEMENT_ON_SCENE['desc'])
    exit(ERROR_NOT_ONE_ELEMENT_ON_SCENE['code'])

for area in bpy.context.screen.areas:
    if area.type == 'OUTLINED':
        space_data = area.spaces.active
        break

# Copia original seleccionada para crear duplicada
original_object = bpy.data.objects[obj_name]
select_one_object(original_object)

# Duplicado
# bpy.ops.object.duplicate()

# Get new objects
remeshed_object = bpy.data.objects[0]
remeshed_object.name = "Remeshed_Object"

cage_remeshed_object = None

all_objects = [cage_remeshed_object, remeshed_object]

deselectAllObjects()

# Remesh(Voxelization)
if(APPLY_MODIFIERS["remesh"]):
    if(DEBUG_TIME):
        start = time.time()
    select_one_object(remeshed_object)
    modifierRemesh = remeshed_object.modifiers.new(
        type='REMESH', name="Remesh")
    modifierRemesh.mode = "BLOCKS"
    modifierRemesh.octree_depth = int(resolution)
    modifierRemesh.use_remove_disconnected = removeDisconnectedElements
    bpy.ops.object.modifier_apply(
        modifier=modifierRemesh.name
    )
    # Duplicado
    bpy.ops.object.duplicate()
    cage_remeshed_object = bpy.data.objects[1]
    cage_remeshed_object.name = "Cage_Remeshed_Object"
    deselectAllObjects()
    if(DEBUG_TIME):
        end = time.time()
        TIMES_STR += "Remesh Time:\t" + str(end-start) + "\n"

if(APPLY_MODIFIERS["triToQuad"]):
    if(DEBUG_TIME):
        start = time.time()
    # Select object to export
    deselectAllObjects()
    select_one_object(remeshed_object)
    # Remove triangles UVs
    bpy.ops.object.editmode_toggle()
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.tris_convert_to_quads()
    bpy.ops.object.editmode_toggle()
    if(DEBUG_TIME):
        end = time.time()
        TIMES_STR += "Tri2Quad Time:\t" + str(end-start) + "\n"

# Generate UV (Smart UV Project) from meshed object
if(APPLY_MODIFIERS["generateUVs"]):
    if(DEBUG_TIME):
        start = time.time()
    deselectAllObjects()
    select_one_object(remeshed_object)
    lm = remeshed_object.data.uv_layers.get("LightMap")
    if not lm:
        lm = remeshed_object.data.uv_layers.new(name="LightMap")
    lm.active = True
    bpy.ops.mesh.uv_texture_remove()
    bpy.ops.object.editmode_toggle()
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)
    bpy.ops.object.editmode_toggle()
    remeshed_object.select_set(False)
    if(DEBUG_TIME):
        end = time.time()
        TIMES_STR += "Generate UVs Time:\t" + str(end-start) + "\n"

if(APPLY_MODIFIERS["extrude"]):
    if(DEBUG_TIME):
        start = time.time()
    deselectAllObjects()
    select_one_object(cage_remeshed_object)
    bpy.ops.object.editmode_toggle()
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.transform.shrink_fatten(value=0.03)
    bpy.ops.object.editmode_toggle()
    remeshed_object.select_set(False)
    if(DEBUG_TIME):
        end = time.time()
        TIMES_STR += "Extrude Time:\t" + str(end-start) + "\n"

# Bake
if(APPLY_MODIFIERS["bake"]):
    if(DEBUG_TIME):
        start = time.time()
    image_name = remeshed_object.name + '_BakedTexture'
    texture_image = bpy.data.images.new(
        image_name, UV_IMAGE_RESOLUTION, UV_IMAGE_RESOLUTION)

    # Delete materials from remeshed object
    remeshed_object.data.materials.clear()

    # Material to Bake
    materialtoBake = bpy.data.materials.new(name="MaterialBake")
    materialtoBake.use_nodes = True
    remeshed_object.data.materials.append(materialtoBake)
    texImage = remeshed_object.data.materials["MaterialBake"].node_tree.nodes.new(
        'ShaderNodeTexImage')
    texImage.image = texture_image

    # Bake conf.
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.preferences.addons[
        "cycles"
    ].preferences.compute_device_type = "CUDA"
    bpy.context.scene.cycles.device = "GPU"
    # bpy.context.preferences.addons["cycles"].preferences.get_devices()

    # Select obj to bake
    deselectAllObjects()
    remeshed_object.select_set(True)
    original_object.select_set(True)
    setActive(original_object)
    print(bpy.context.selected_objects)
    print(bpy.context.active_object)

    # select_one_object(remeshed_object)
    # # original_object.select_set(True)

    # Bake
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={
        "COLOR"}, use_selected_to_active=True, margin=0, cage_object=cage_remeshed_object.name)

    if(DEBUG_TIME):
        end = time.time()
        TIMES_STR += "Bake Time:\t" + str(end-start) + "\n"

    # Save texture image
    texture_image.save_render(
        filepath='.\\' + baked_directory + "\\" + file_name + baked_file_extension)


if(DEBUG_TIME):
    print(TIMES_STR + TIMES_STR_FIN)

####################################### MOSAIC ##############################################
# Procesamiento de imagenes con las que se generará el mosaico
# if(APPLY_MODIFIERS["buildMosaic"]):
# Get tile files
# tiles = []
# for path_tile_file in glob.glob(tiles_directory_path):
#     tile = Image.open(path_tile_file)
#     # tile = tile.resize(tile_size)
#     tiles.append(tile)

# # Calcular el color dominante de cada imagen
# colors = []
# for tile in tiles:
#     mean_color = np.array(tile).mean(axis=0).mean(axis=0)
#     colors.append(mean_color)

# espacial_color = spatial.KDTree(colors)

# closest_tiles = np.zeros(
#     (UV_IMAGE_RESOLUTION, UV_IMAGE_RESOLUTION), dtype=np.uint32)

# for i in range(UV_IMAGE_RESOLUTION):
#     for j in range(UV_IMAGE_RESOLUTION):
#         closest = espacial_color.query(resized_photo.getpixel((i, j)))
#         closest_tiles[i, j] = closest[1]

#############################################################################################


# Export objects
# select_one_object(remeshed_object)
selectAllObjects()
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True, export_materials='EXPORT', export_apply=True)
##################################################################################################################
