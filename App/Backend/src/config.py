class Config:
    pass


class DevelopmentConfig(Config):
    DEBUG = True


config = {
    # APP Config
    'DEVELOPMENT_CONFIG': DevelopmentConfig,
    # Directories
    'DIRECTORY_UPLOADED_FILE': 'filesUploaded',
    'DIRECTORY_FILES_PROCESSED': 'filesProcessed',
    'DIRECTORY_FILES_BAKED_TEXTURES': 'bakedTextures',
    'DIRECTORY_MINECRAFT_TEXTURES': ".\\minecraft_textures\\block",
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
