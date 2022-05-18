import bpy
import sys
import bmesh
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
    "subdivide": False,
    "remesh": True,
    "generateUVs": True,
    "shrinkWrap": False,
    "bake": False
}
# /////////////////  FUNCS AUXS.  ////////////////////////////


def selectAllObjects(objectsList):
    for o in objectsList:
        select_one_object(o, False)


def select_one_object(object_selected, deselectOthersObjects=True):
    if(deselectOthersObjects):
        bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = object_selected
    object_selected.select_set(True)


def remove_object(object):
    select_one_object(object)
    bpy.ops.object.delete()


def copy_object(source_object, new_name):
    new_obj = source_object.copy()
    new_obj.name = new_name
    new_obj.data = source_object.data.copy()
    new_obj.animation_data_clear()
    remove_UVs(new_obj)
    bpy.context.collection.objects.link(new_obj)
    return new_obj


# def set_active_object(object):
#     bpy.context.selected_objects = object


def remove_UVs(object):
    bmesh_from_object = bmesh.new()
    bmesh_from_object.from_mesh(object.data)
    UVLayers = bmesh_from_object.loops.layers.uv
    for UVLayer in bmesh_from_object.loops.layers.uv.items():
        UVLayers.remove(UVLayer[1])
    bmesh_from_object.to_mesh(object.data)
    object.data.update()


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
# Objetos
original_object = bpy.data.objects[obj_name]
shrinkwrapped_object = copy_object(original_object, "Shrinkwrapped_Object")
remeshed_object = copy_object(original_object, "Remeshed_Object")
remove_object(original_object)

# BMeshes
bmesh_shrinkwrapped_object = bmesh.new()

# Control
generateUVsDone = False  # Para hacer el bake se precisa de las UVs

# Add extra vertices
if(APPLY_MODIFIERS["subdivide"]):
    # Remove UV mappings
    bmesh_shrinkwrapped_object.from_mesh(shrinkwrapped_object.data)
    # Subdivide
    bmesh.ops.subdivide_edges(bmesh_shrinkwrapped_object,
                              edges=bmesh_shrinkwrapped_object.edges,
                              cuts=ITERATIONS_SUBDIVIDE)
    bmesh_shrinkwrapped_object.to_mesh(shrinkwrapped_object.data)
    shrinkwrapped_object.data.update()

# Remesh(Voxelization)
if(APPLY_MODIFIERS["remesh"]):
    select_one_object(remeshed_object)
    modifierRemesh = remeshed_object.modifiers.new(
        type='REMESH', name="Remesh")
    modifierRemesh.mode = "BLOCKS"
    modifierRemesh.octree_depth = int(resolution)
    modifierRemesh.use_remove_disconnected = bool(removeDisconnectedElements)
    bpy.ops.object.modifier_apply(
        modifier=modifierRemesh.name
    )


# Generate UV (Smart UV Project) from meshed object
if(APPLY_MODIFIERS["generateUVs"]):
    bpy.ops.object.editmode_toggle()
    bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)
    generateUVsDone = True

# Shrinkwrap
if(APPLY_MODIFIERS["shrinkWrap"]):
    select_one_object(shrinkwrapped_object)
    modifierShrinkwrap = shrinkwrapped_object.modifiers.new(
        type='SHRINKWRAP', name="Shrinkwrap")
    modifierShrinkwrap.target = remeshed_object
    modifierShrinkwrap.wrap_method = 'NEAREST_SURFACEPOINT'
    bpy.ops.object.editmode_toggle()
    bpy.ops.object.modifier_apply(
        modifier=modifierShrinkwrap.name
    )

# Bake
if(APPLY_MODIFIERS["bake"] and (generateUVsDone or not APPLY_MODIFIERS["generateUVs"])):

    image_name = remeshed_object.name + '_BakedTexture'
    texture_image = bpy.data.images.new(image_name, 1024, 1024)

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
    bpy.context.preferences.addons["cycles"].preferences.get_devices()

    # Select obj to bake
    select_one_object(remeshed_object)

    # Bake
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={
        "COLOR"}, use_selected_to_active=True, margin=0)

    # Save texture image
    texture_image.save_render(filepath='E:\\Documentos\\Temporal\\baked.png')

# Select all objets to export
selectAllObjects([shrinkwrapped_object, remeshed_object])

# Export objects
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True, export_materials='EXPORT', export_apply=True)
##################################################################################################################
