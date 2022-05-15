import bpy
import sys

# Constantes
DESC_FORMAT = "ERR_CODE: {} - {}."

# Errores
ERROR_NOT_ONE_ELEMENT_ON_SCENE = {
    'code': 200,
    'desc': DESC_FORMAT.format(1, 'Existe mas de un objeto en el archivo.')
}

# Otros objetos de la escena
others_objs = ['Camera', 'Cube', 'Light']

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--"

obj_in = argv[0]
obj_out = argv[1]
resolution = argv[2]
removeDisconnectedElements = argv[3]

# bpy.ops.import_scene.obj(filepath=obj_in, axis_forward='-Z', axis_up='Y')
bpy.ops.import_scene.gltf(filepath=obj_in)

# Objects
# TODO: Comprobar que en la escena solo deba existir un elemento(o 4 que no sean Camera, Light o Cube) y otras figuras
obj_names = bpy.data.objects.keys()
obj_name = None
for o in obj_names:
    if(o not in others_objs):
        obj_name = o

if(len(obj_names) != 4 or obj_name == None):
    print(ERROR_NOT_ONE_ELEMENT_ON_SCENE['desc'])
    exit(ERROR_NOT_ONE_ELEMENT_ON_SCENE['code'])

obj_selected = bpy.data.objects[obj_name]

# Remesh(Voxelization).Apply modifier
modifier = obj_selected.modifiers.new(name="Remesh", type='REMESH')
modifier.mode = "BLOCKS"
modifier.octree_depth = int(resolution)
modifier.use_remove_disconnected = bool(removeDisconnectedElements)


# Save
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True)
##################################################################################################################


# #Deselect all
# bpy.ops.object.select_all(action='DESELECT')

# #Mesh objects
# MSH_OBJS = [m for m in bpy.context.scene.objects if m.type == 'MESH']

# for OBJS in MSH_OBJS:
#     #Select all mesh objects
#     OBJS.select_set(state=True)

#     #Makes one active
#     bpy.context.view_layer.objects.active = OBJS

# #Joins objects
# bpy.ops.object.join()
