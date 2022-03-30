import bpy
import sys

# Constantes
DESC_FORMAT = "ERR_CODE: {} - {}."

# Errores
errores = [{
    'code': 1,
    'desc': DESC_FORMAT.format(1, 'Existe mas de un objeto en el archivo OBJ')
}]

# Otros objetos de la escena
others_objs = ['Camera', 'Cube', 'Light']

argv = sys.argv
argv = argv[argv.index("--") + 1:] # get all args after "--"

obj_in = argv[0]
obj_out = argv[1]
resolution = argv[2]
removeDisconnectedElements = argv[3]

bpy.ops.import_scene.obj(filepath=obj_in, axis_forward='-Z', axis_up='Y')

# Objects
# TODO: Comprobar que en la escena solo deba existir un elemento(o 4 que no sean Camera, Light o Cube) y otras figuras
obj_names = bpy.data.objects.keys()
obj_name = None
for o in obj_names:
    if(o not in others_objs):
        obj_name = o

if(len(obj_names) != 4 or obj_name == None):
    print(errores[0]['desc'])
    exit(1)

obj_selected = bpy.data.objects[obj_name]

# Remesh(Voxelization).Apply modifier
modifier = obj_selected.modifiers.new(name="Remesh", type='REMESH')
modifier.mode = "BLOCKS"
modifier.octree_depth = int(resolution)
modifier.use_remove_disconnected = bool(removeDisconnectedElements)


# Save
bpy.ops.export_scene.obj(filepath=obj_out, use_mesh_modifiers=True, axis_forward='-Z', axis_up='Y', use_selection=True)

##################################################################################################################