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
    # API Parameters
    'API_PARAM_MAIN_FILE': 'modelFile',
    'API_PARAM_ATTACHED_FILES': 'attachedFiles',
    'API_PARAM_RESOLUTION': 'resolutionVoxel',
    'API_PARAM_USE_REMOVE_DISCONNECTED': 'useRemoveDisconnected',
    # 'API_PARAM_RESOLUTION': 'resolutionVoxel',
    # Allowed Extensions Model File
    'ALLOWED_EXTENSIONS_MODEL_FILE': ['obj'],
    # Allowed Extensions Attached Files
    'ALLOWED_EXTENSIONS_ATTACHED_FILES': ['mrl', 'png', 'jpeg', 'jpg'],

}
