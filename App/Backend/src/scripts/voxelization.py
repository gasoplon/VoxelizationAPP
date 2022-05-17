import bpy
import sys

# ////////////////////////  CTES  /////////////////////////////

DESC_FORMAT = "ERR_CODE: {} - {}."  # Errores
ERROR_NOT_ONE_ELEMENT_ON_SCENE = {
    'code': 200,
    'desc': DESC_FORMAT.format(1, 'Existe mas de un objeto en el archivo.')}
OTHERS_OBJS = ['Camera', 'Cube', 'Light']  # Otros objetos de la escena

# Conf
ANGLE_LIMIT = 1.15191731  # 66º
ITERATIONS_SUBDIVIDE = 7  # Nº de iteraciones del subdivide
APPLY_MODIFIERS = True
# /////////////////  FUNCS AUXS.  ////////////////////////////


def add_object_to_scene(object):
    bpy.context.collection.objects.link(object)


def copy_object(source_object, new_name):
    new_obj = source_object.copy()
    new_obj.name = new_name
    new_obj.data = source_object.data.copy()
    new_obj.animation_data_clear()
    add_object_to_scene(new_obj)
    return new_obj


def select_one_object(object_selected):
    bpy.context.scene.objects.active = object_selected


# /////////////////////////////////////////////////////////////
# Parámetros de entrada
argv = sys.argv
argv = argv[argv.index("--") + 1:]
obj_in = argv[0]
obj_out = argv[1]
resolution = argv[2]
removeDisconnectedElements = argv[3]

# Importar escena
bpy.ops.import_scene.gltf(filepath=obj_in)

# Get object
obj_names = bpy.data.objects.keys()
obj_name = None
for o in obj_names:
    if(o not in OTHERS_OBJS):
        obj_name = o

# Comprobar que solo existe 1 objeto en la escena
if(len(obj_names) != 4 or obj_name == None):
    print(ERROR_NOT_ONE_ELEMENT_ON_SCENE['desc'])
    exit(ERROR_NOT_ONE_ELEMENT_ON_SCENE['code'])

# Copias para ser modificadas
original_object = bpy.data.objects[obj_name]
remeshed_object = copy_object(original_object, "Remeshed_Object")
shrinkwrapped_object = copy_object(original_object, "Shrinkwrapped_Object")

# Remesh(Voxelization)
modifierRemesh = remeshed_object.modifiers.new(type='REMESH', name="Remesh")
modifierRemesh.mode = "BLOCKS"
modifierRemesh.octree_depth = int(resolution)
modifierRemesh.use_remove_disconnected = bool(removeDisconnectedElements)

# Generate UV (Smart UV Project) from meshed object
bpy.ops.object.editmode_toggle()
if(APPLY_MODIFIERS):
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)
    # Add extra vertices
    bpy.ops.mesh.subdivide(number_cuts=ITERATIONS_SUBDIVIDE)

    select_one_object(shrinkwrapped_object)
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)

# Shrinkwrap
modifierRemesh = shrinkwrapped_object.modifiers.new(
    type='SHRINKWRAP', name="Shrinkwrap")
modifierRemesh.target = remeshed_object
modifierRemesh.wrap_method = 'NEAREST_SURFACEPOINT'
bpy.ops.object.editmode_toggle()
if(APPLY_MODIFIERS):
    bpy.ops.object.modifier_apply(
        modifier=modifierRemesh.name
    )

# Bake
bpy.context.space_data.context = 'RENDER'
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.device = 'GPU'
bpy.context.scene.cycles.bake_type = 'DIFFUSE'
bpy.context.scene.render.bake.use_pass_direct = False
bpy.context.scene.render.bake.use_pass_indirect = False
bpy.context.scene.render.bake.use_selected_to_active = True
bpy.context.scene.render.bake.margin = 0


# Export objects
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True, export_materials='EXPORT', export_apply=True)
##################################################################################################################
