import os


class Config:
    pass


class DevelopmentConfig(Config):
    DEBUG = True


config = {
    # APP Config
    'DEVELOPMENT_CONFIG': DevelopmentConfig,
    'REMOVE_DIRECTORIES': True,
    # Directories
    'DIRECTORY_UPLOADED_FILE': os.path.join("..", "TEXTURAS_Y_MODELOS", "API_FILES", "filesUploaded"),
    'DIRECTORY_FILES_PROCESSED': os.path.join("..", "TEXTURAS_Y_MODELOS", "API_FILES", "filesProcessed"),
    'DIRECTORY_FILES_BAKED_TEXTURES': os.path.join("..", "TEXTURAS_Y_MODELOS", "API_FILES", "bakedTextures"),
    'DIRECTORY_MINECRAFT_TEXTURES': os.path.join("..", "TEXTURAS_Y_MODELOS", "MINECRAFT_TEXTURES"),
    'DIRECTORY_MOSAICS_GENERATED': os.path.join("..", "TEXTURAS_Y_MODELOS", "API_FILES", "mosaics"),
    # API Parameters
    'API_PARAM_MAIN_FILE': 'modelFile',
    'API_PARAM_ATTACHED_FILES': 'attachedFiles',
    'API_PARAM_RESOLUTION': 'resolutionVoxel',
    'API_PARAM_USE_REMOVE_DISCONNECTED': 'useRemoveDisconnected',
    # Allowed Extensions Model File
    'ALLOWED_EXTENSIONS_MODEL_FILE': ['glb'],
    'RETURNED_ALLOW_FILE_EXTENSION': 'gltf',
    'BAKED_FILES_EXTENSION': '.png',
    # Resolution gange
    'RESOLUTION_RANGE_ALLOWED': range(1, 8),
    # Use remove disconnected elements allowed values
    'USE_REMOVE_DISCONNECTED_ELEMENTS_ALLOWED': ['true', 'false'],
}
