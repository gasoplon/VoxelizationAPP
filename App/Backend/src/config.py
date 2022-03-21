class Config:
    pass


class DevelopmentConfig(Config):
    DEBUG = True


config = {
    'development': DevelopmentConfig,
    'DIRECTORY_UPLOADED_FILE': 'filesUploaded',
    'DIRECTORY_FILES_PROCESSED': 'filesProcessed'
}
