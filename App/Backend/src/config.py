class Config:
    pass


class DevelopmentConfig(Config):
    DEBUG = True


config = {
    # APP Config
    'DEVELOPMENT_CONFIG': DevelopmentConfig,
    # Directories
    'DIRECTORY_UPLOADED_FILE': '..\\TEXTURAS_Y_MODELOS\\API_FILES\\filesUploaded',
    'DIRECTORY_FILES_PROCESSED': '..\\TEXTURAS_Y_MODELOS\\API_FILES\\filesProcessed',
    'DIRECTORY_FILES_BAKED_TEXTURES': '..\\TEXTURAS_Y_MODELOS\\API_FILES\\bakedTextures',
    'DIRECTORY_MINECRAFT_TEXTURES': '..\\TEXTURAS_Y_MODELOS\\MINECRAFT_TEXTURES',
    # API Parameters
    'API_PARAM_MAIN_FILE': 'modelFile',
    'API_PARAM_ATTACHED_FILES': 'attachedFiles',
    'API_PARAM_RESOLUTION': 'resolutionVoxel',
    'API_PARAM_USE_REMOVE_DISCONNECTED': 'useRemoveDisconnected',
    # Allowed Extensions Model File
    'ALLOWED_EXTENSIONS_MODEL_FILE': ['glb'],
    'BAKED_FILES_EXTENSION': '.png',
    # Resolution gange
    'RESOLUTION_RANGE_ALLOWED': range(1, 24),
    # Use remove disconnected elements allowed values
    'USE_REMOVE_DISCONNECTED_ELEMENTS_ALLOWED': ['true', 'false'],
}
