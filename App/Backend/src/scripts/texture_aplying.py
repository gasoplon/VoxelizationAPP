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

texture_image = bpy.data.images.load(os.path.abspath(backedTexture))
new_node = materialtoBake.node_tree.nodes.new('ShaderNodeTexImage')
new_node.image = texture_image
BSDF_node = materialtoBake.node_tree.nodes["Principled BSDF"]
# print(BSDF_node.inputs)
# print(materialtoBake.node_tree.nodes[0])
# print(materialtoBake.node_tree.nodes[1])
# print(materialtoBake.node_tree.nodes[2])
materialtoBake.node_tree.links.new(
    new_node.outputs["Color"], BSDF_node.inputs["Base Color"])
# print(materialtoBake.node_tree.nodes)
# materialtoBake = bpy.data.materials.new(name="MaterialBake")
# materialtoBake.use_nodes = True
# obj.data.materials.append(materialtoBake)
# texImage = obj.data.materials["MaterialBake"].node_tree.nodes.new(
#     'ShaderNodeTexImage')

# # texImage.image = bpy.ops.image.open(
# #     filepath=model_file, relative_path=True)

# p = os.path.abspath(backedTexture)
# print("PATH:" + p)
# texImage.image = bpy.data.images.load(p)
# bsdf = materialtoBake.node_tree.nodes["Principled BSDF"]
# materialtoBake.node_tree.links.new(
#     bsdf.inputs['Base Color'], texImage.outputs['Color'])

# ob = bpy.context.view_layer.objects.active

bpy.ops.export_scene.gltf(
    filepath=model_file, export_format='GLTF_EMBEDDED', use_selection=True, export_materials='EXPORT')
