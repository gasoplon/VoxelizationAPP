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

materialtoBake = bpy.data.materials["MaterialBake"]
materialtoBake.use_nodes = True

new_node = materialtoBake.node_tree.nodes.new('ShaderNodeTexImage')
materialtoBake.node_tree.nodes["Image Texture"].interpolation = 'Closest'

texture_image = bpy.data.images.load(os.path.abspath(backedTexture))
new_node.image = texture_image
BSDF_node = materialtoBake.node_tree.nodes["Principled BSDF"]
# BSDF_node.inputs["Specular"].default_value = 0.0
materialtoBake.specular_intensity = 0.0
materialtoBake.node_tree.links.new(
    new_node.outputs["Color"], BSDF_node.inputs["Base Color"])

bpy.ops.export_scene.gltf(
    filepath=model_file, export_format='GLTF_EMBEDDED', use_selection=True, export_materials='EXPORT')
