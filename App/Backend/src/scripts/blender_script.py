
##################################################################################################################
# import trimesh
# from trimesh.voxel import creation
# import os

# print(trimesh.available_formats())
# mesh = trimesh.exchange.load.load(open("../../../../Examples/Cuerpo.obj","r"), "obj")
# print(mesh)

# voxelized = creation.local_voxelize(mesh, mesh.centroid , mesh.extents.max() / 128, 64, fill=True)
##################################################################################################################

# import open3d as o3d

# textured_mesh = o3d.io.read_triangle_mesh("../../../../Examples/Cuerpo.obj",print_progress=True)
# print(type(textured_mesh))
##################################################################################################################

# import pywavefront

# scene = pywavefront.Wavefront("../../../../Examples/Cuerpo.obj")

# for name, material in scene.materials.items():
#     # Contains the vertex format (string) such as "T2F_N3F_V3F"
#     # T2F, C3F, N3F and V3F may appear in this string
#     print(material.vertex_format)
#     # Contains the vertex list of floats in the format described above
#     print(type(material.vertices))
#     # Material properties
#     material.diffuse
#     material.ambient
#     material.texture
##################################################################################################################

import bpy
import sys

useless_objects = ['Camera', 'Cube', 'Light']

argv = sys.argv
argv = argv[argv.index("--") + 1:] # get all args after "--"

obj_in = argv[0]
obj_out = argv[1]

bpy.ops.import_scene.obj(filepath=obj_in, axis_forward='-Z', axis_up='Y')

# Remesh(Voxelization)
# Objects
# TODO: Comprobar que en la escena solo deba existir un elemento(o 4 que no sean Camera, Light o Cube)
obj_name = bpy.data.objects.keys()
obj_selected = None;
for o in obj_name:
    if(o not in useless_objects):
        obj_selected = bpy.data.objects[o]

# Apply modifier
modifier = obj_selected.modifiers.new(name="Remesh", type='REMESH')
modifier.octree_depth = 8
modifier.mode = "BLOCKS"


# Save
bpy.ops.export_scene.obj(filepath=obj_out, use_mesh_modifiers=True, axis_forward='-Z', axis_up='Y')

##################################################################################################################