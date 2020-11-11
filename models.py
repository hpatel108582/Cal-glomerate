"""
Instantiate and define database model definitions.
"""
# pylint: disable=no-member
# pylint: disable=redefined-builtin
# pylint: disable=too-few-public-methods
from app import db


class AuthUser(db.Model):
    """
    Defines AuthHistory table.
    """

    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(120))
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))

    def __init__(self, userid, name, email):
        self.userid = userid
        self.name = name
        self.email = email

    def __repr__(self):
        return "<User name: {}\ntype: {}".format(self.name, self.email)


class Calendars(db.Model):
    """
    Defines Calendars table.
    """

    ccode = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(120))

    def __init__(self, userid):
        self.userid = userid

    def __repr__(self):
        return "< userid: {}\nccode: {}".format(self.userid, self.ccode)


class Event(db.Model):
    """
    Defines Event table.
    """

    id = db.Column(db.Integer, primary_key=True)
    ccode = db.Column(db.Integer)
    title = db.Column(db.String(120))
    start = db.Column(db.String(120))
    end = db.Column(db.String(120))
    desc = db.Column(db.String(120))

    def __init__(self, ccode, title, start, end, desc):
        self.ccode = ccode
        self.title = title
        self.start = start
        self.end = end
        self.desc = desc

    def __repr__(self):
        return "<event ccode: {}\n title: {}\n start: {}\n end: {}\n desc: {}".format(
            self.ccode, self.title, self.start, self.end, self.desc
        )
