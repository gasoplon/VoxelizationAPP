# class Error(Exception):
#     def __init__(self, message="Clase base de las excepciones"):
#         self.message = message
#         super().__init__(self.message)

class InvalidAPIParameterException(Exception):
    def __init__(self, message, status_code):
        super().__init__()
        self.message = message
        self.status_code = status_code

    def to_dict(self):
        rv = dict()
        rv['message'] = self.message
        rv['status_code'] = self.status_code
        return rv

class InvalidResolutionRangeException(InvalidAPIParameterException):
    def __init__(self):
        super().__init__("Debe ser un valor entero comprendido entre 1 y 24[ambos inclusive].", 415)

class InvalidResolutionTypeException(InvalidAPIParameterException):
    def __init__(self):
        super().__init__("La resolución debe ser un nº entero.", 416)

class NotAllowedFileExtensionException(InvalidAPIParameterException):
    def __init__(self):
        super().__init__("El archivo debe tener extensión .obj .", 417)

class MissingArgumentsException(InvalidAPIParameterException):
    def __init__(self, missingArguments):
        super().__init__("Falta algún parámetro: {}".format(missingArguments), 418)

class InvalidRemoveDisconnectedElementsTypeException(InvalidAPIParameterException):
    def __init__(self):
        super().__init__("remove_disconnected_elements debe ser un valor booleano: 'true' o 'false'.", 419)
