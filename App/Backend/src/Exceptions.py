import ERROR_CODES 

class InvalidAPIParameterException(Exception):
    def __init__(self, ERROR_CODE, payload = None):
        super().__init__()
        self.message = ERROR_CODE['message']
        self.status_code = ERROR_CODE['code']
        if(payload and self.status_code == ERROR_CODES.MISSING_PARAMETERS_ERROR_013['code']):
            self.message = self.message.format(payload)

    def to_dict(self):
        rv = dict()
        rv['message'] = self.message
        rv['status_code'] = self.status_code
        return rv

# class InvalidResolutionRangeException(InvalidAPIParameterException):
#     def __init__(self):
#         super().__init__("Debe ser un valor entero comprendido entre 1 y 24[ambos inclusive].", 415)

# class InvalidResolutionTypeException(InvalidAPIParameterException):
#     def __init__(self):
#         super().__init__("La resolución debe ser un nº entero.", 416)

# class NotAllowedFileExtensionException(InvalidAPIParameterException):
#     def __init__(self):
#         super().__init__("El archivo debe tener extensión .obj .", 417)

# class MissingArgumentsException(InvalidAPIParameterException):
#     def __init__(self, missingArguments):
#         super().__init__("Falta algún parámetro: {}".format(missingArguments), 418)

# class InvalidRemoveDisconnectedElementsTypeException(InvalidAPIParameterException):
#     def __init__(self):
#         super().__init__("remove_disconnected_elements debe ser un valor booleano: 'true' o 'false'.", 419)
