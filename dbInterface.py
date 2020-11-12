"""
Python Appeasment
"""
# pylint: disable=no-member
# pylint: disable=wrong-import-position
# pylint: disable=global-statement


CALENDER_EVENT_CHANNEL = "calendar_event"


class dbInterfaceClass:
    def __init__(self, db, models):
        self.db = db
        self.models = models

    def push_new_user_to_db(self, ident, name, email):
        """
        Pushes new user to database.
        """
        self.db.session.add(self.models.AuthUser(ident, name, email))
        self.db.session.commit()

    def add_event(self, event):
        """
        adds an event, returns id of added event
        """
        ccode, title, start, end, desc = (
            event["ccode"],
            event["title"],
            event["start"],
            event["end"],
            event["desc"],
        )
        addedEvent = self.models.Event(ccode, title, start, end, desc)
        self.db.session.add(addedEvent)
        self.db.session.commit()
        return addedEvent.id

    def add_calendar_for_user(self, userid):
        """
        adds an event, returns the ccode of the new calendar
        """
        addedCalendar = self.models.Calendars(userid)
        self.db.session.add(addedCalendar)
        self.db.session.commit()
        return addedCalendar.ccode

    def emit_events_to_calender(self, channel, cal_code, sid):
        """
        Emits all calendar events along channel
        """
        all_events = [
            {
                "start": record.start,
                "end": record.end,
                "title": record.title,
            }
            for record in self.db.session.query(self.models.Event)
            .filter_by(ccode=cal_code)
            .all()
        ]
        return all_events
