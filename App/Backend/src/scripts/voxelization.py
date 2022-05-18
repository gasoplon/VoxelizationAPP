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
APPLY_MODIFIERS = {
    "generateUVs": False,
    "subdivide": True,
    "shrinkWrap": False,
    "remesh": False
}
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
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = object_selected
    object_selected.select_set(True)


def set_active_object(object):
    bpy.context.selected_objects = object


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
shrinkwrapped_object = copy_object(original_object, "Shrinkwrapped_Object")
remeshed_object = copy_object(original_object, "Remeshed_Object")

# Add extra vertices
if(APPLY_MODIFIERS["subdivide"]):
    print(bpy.context.active_object)
    select_one_object(shrinkwrapped_object)
    print(bpy.context.active_object)
    bpy.ops.mesh.subdivide(number_cuts=ITERATIONS_SUBDIVIDE)

# Remesh(Voxelization)
if(APPLY_MODIFIERS["remesh"]):
    modifierRemesh = remeshed_object.modifiers.new(
        type='REMESH', name="Remesh")
    modifierRemesh.mode = "BLOCKS"
    modifierRemesh.octree_depth = int(resolution)
    modifierRemesh.use_remove_disconnected = bool(removeDisconnectedElements)


# Generate UV (Smart UV Project) from meshed object
if(APPLY_MODIFIERS["generateUVs"]):
    bpy.ops.object.editmode_toggle()
    select_one_object(remeshed_object)
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)
    select_one_object(shrinkwrapped_object)
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)

# Shrinkwrap
if(APPLY_MODIFIERS["shrinkWrap"]):
    modifierShrinkwrap = shrinkwrapped_object.modifiers.new(
        type='SHRINKWRAP', name="Shrinkwrap")
    modifierShrinkwrap.target = remeshed_object
    modifierShrinkwrap.wrap_method = 'NEAREST_SURFACEPOINT'
    bpy.ops.object.editmode_toggle()
    bpy.ops.object.modifier_apply(
        modifier=modifierShrinkwrap.name
    )

# Bake
bpy.context.scene.render.engine = "CYCLES"
bpy.context.preferences.addons[
    "cycles"
].preferences.compute_device_type = "CUDA"
bpy.context.scene.cycles.device = "GPU"
bpy.context.preferences.addons["cycles"].preferences.get_devices()
# print(bpy.context.preferences.addons["cycles"].preferences.compute_device_type)
# for d in bpy.context.preferences.addons["cycles"].preferences.devices:
#     d["use"] = 1  # Using all devices, include GPU and CPU
#     print(d["name"], d["use"])

# bpy.context.space_data.context = 'RENDER'
# bpy.context.scene.render.engine = 'CYCLES'
# bpy.context.scene.cycles.device = 'GPU'
bpy.context.scene.cycles.bake_type = 'DIFFUSE'
bpy.context.scene.render.bake.use_pass_direct = False
bpy.context.scene.render.bake.use_pass_indirect = False
bpy.context.scene.render.bake.use_selected_to_active = True
bpy.context.scene.render.bake.margin = 0
bpy.ops.outliner.item_activate(deselect_all=True)
bpy.ops.outliner.item_activate(extend_range=True, deselect_all=True)


# Export objects
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True, export_materials='EXPORT', export_apply=True)
##################################################################################################################
