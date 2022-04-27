import ERROR_CODES


class InvalidAPIParameterException(Exception):
    def __init__(self, ERROR_CODE, payload=None):
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
