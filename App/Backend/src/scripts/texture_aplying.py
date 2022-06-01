import bpy
import sys
import os

# CTES
OTHERS_OBJS = ['Camera', 'Cube', 'Light']  # Otros objetos de la escena

# Parámetros de entrada
argv = sys.argv[sys.argv.index("--") + 1:]
model_file = argv[0]
backedTexture = argv[1]

# Importar escena
bpy.ops.import_scene.gltf(filepath=model_file)

# Get object
obj_names = bpy.data.objects.keys()
obj_name = None
for o in obj_names:
    if(o not in OTHERS_OBJS):
        obj_name = o
    else:
        bpy.data.objects.remove(bpy.data.objects[o])

obj = bpy.data.objects[0]

materialtoBake = bpy.data.materials.new(name="MaterialBake")
materialtoBake.use_nodes = True
obj.data.materials.append(materialtoBake)
texImage = obj.data.materials["MaterialBake"].node_tree.nodes.new(
    'ShaderNodeTexImage')

# texImage.image = bpy.ops.image.open(
#     filepath=model_file, relative_path=True)

ss = "E:\\Documentos\\Git Repositories\\VoxelizationAPP\\App\\Backend\\TEXTURAS_Y_MODELOS\\API_FILES\\mosaics\\" + backedTexture
texImage.image = bpy.data.images.load(ss)
bsdf = materialtoBake.node_tree.nodes["Principled BSDF"]
materialtoBake.node_tree.links.new(
    bsdf.inputs['Base Color'], texImage.outputs['Color'])

ob = bpy.context.view_layer.objects.active

bpy.ops.export_scene.gltf(
    filepath=model_file, export_format='GLTF_EMBEDDED', use_selection=True, export_materials='EXPORT', export_apply=True)
