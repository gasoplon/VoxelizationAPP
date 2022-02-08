class Error(Exception):
    def __init__(self, message="Clase base de las excepciones"):
        self.message = message
        super().__init__(self.message)


class NoFileSendedError(Exception):
    def __init__(self, message="No se ha recibido ningún archivo."):
        self.message = message
        self.code = 460
        super().__init__(self.message)


class NotAllowedExtension(Exception):
    def __init__(self, message="No se admite la extensión del archivo."):
        self.message = message
        self.code = 415
        super().__init__(self.message)
