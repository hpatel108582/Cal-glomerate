'''
Instantiate and define database model definitions.
'''
# pylint: disable=no-member
# pylint: disable=redefined-builtin
# pylint: disable=too-few-public-methods
from app import db

class AuthUser(db.Model):
    '''
    Defines AuthHistory table.
    '''
    id = db.Column(db.String(25), primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    ccode = db.Column(db.String(120))

    def __init__(self, id, name, email, ccode):
        self.id = id
        self.name = name
        self.email = email
        self.ccode = ccode
    def __repr__(self):
        return "<User name: {}\ntype: {}".format(self.name, self.email)
        