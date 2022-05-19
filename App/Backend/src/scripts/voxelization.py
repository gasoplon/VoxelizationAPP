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


def setActive(obj):
    bpy.context.view_layer.objects.active = obj


def selectAllObjects():
    bpy.ops.object.select_all(action='SELECT')
    # setActive(None)
    # for o in all_objects:
    #     o.select_set(True)


def deselectAllObjects():
    bpy.ops.object.select_all(action='DESELECT')
    # setActive(None)
    # for o in all_objects:
    #     o.select_set(False)


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
removeDisconnectedElements = argv[3]

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
bpy.ops.object.duplicate()
bpy.ops.object.duplicate()

# Get new objects
shrinkwrapped_object = bpy.data.objects[1]
remeshed_object = bpy.data.objects[2]
shrinkwrapped_object.name = "Shrinkwrapped_Object"
remeshed_object.name = "Remeshed_Object"
all_objects = [shrinkwrapped_object, remeshed_object]

# Remove useless objects
remove_object(original_object)

deselectAllObjects()

# print(list(bpy.data.objects))

# BMeshes
bmesh_shrinkwrapped_object = bmesh.new()

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
    deselectAllObjects()


# Generate UV (Smart UV Project) from meshed object
if(APPLY_MODIFIERS["generateUVs"]):
    deselectAllObjects()

    for obj in all_objects:
        if (obj.type == 'MESH'):
            select_one_object(obj)
            print(obj.name)
            lm = obj.data.uv_layers.get("LightMap")
            if not lm:
                lm = obj.data.uv_layers.new(name="LightMap")
            lm.active = True
            bpy.ops.mesh.uv_texture_remove()
            bpy.ops.object.editmode_toggle()
            bpy.ops.mesh.select_all(action='SELECT')
            bpy.ops.uv.smart_project(angle_limit=ANGLE_LIMIT)
            bpy.ops.object.editmode_toggle()
            obj.select_set(False)

# Shrinkwrap
if(APPLY_MODIFIERS["shrinkWrap"]):
    select_one_object(shrinkwrapped_object)
    modifierShrinkwrap = shrinkwrapped_object.modifiers.new(
        type='SHRINKWRAP', name="Shrinkwrap")
    modifierShrinkwrap.target = remeshed_object
    modifierShrinkwrap.wrap_method = 'NEAREST_SURFACEPOINT'
    bpy.ops.object.modifier_apply(
        modifier=modifierShrinkwrap.name
    )

# Bake
if(APPLY_MODIFIERS["bake"]):

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
    # bpy.ops.object.bake(type="DIFFUSE", pass_filter={
    #     "COLOR"}, use_selected_to_active=True, margin=0)

    # Save texture image
    texture_image.save_render(filepath='E:\\Documentos\\Temporal\\baked.png')

# Select all objets to export
selectAllObjects()

# Export objects
bpy.ops.export_scene.gltf(
    filepath=obj_out, export_format='GLB', use_selection=True, export_materials='EXPORT', export_apply=True)
##################################################################################################################
