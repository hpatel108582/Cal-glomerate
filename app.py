"""
Python Appeasment
"""
# pylint: disable=no-member
# pylint: disable=wrong-import-position
# pylint: disable=global-statement
import os
from os.path import join, dirname
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime

app = flask.Flask(__name__)

##BOILER PLATE CODE TO INITIATE SOCKETS
socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

# BOILER PLATE CODE TO INSTANTIATE PSQL AND SQLALCHEMY

database_uri = os.environ["DATABASE_URL"]

app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)

db.init_app(app)
db.app = app

CALENDER_EVENT_CHANNEL='calendar_event'

import models

def push_new_user_to_db(ident, name, email):
    """
    Pushes new user to database.
    """
    db.session.add(models.AuthUser(ident, name, email))
    db.session.commit()

def get_sid():
    """
    returns sid.
    """
    sid = flask.request.sid
    return sid

def add_event(event):
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
    addedEvent = models.Event(ccode, title, start, end, desc)
    db.session.add(addedEvent)
    db.session.commit()
    return addedEvent.id

def add_calendar_for_user(userid):
    """
    adds an event, returns the ccode of the new calendar
    """
    addedCalendar = models.Calendars(userid)
    db.session.add(addedCalendar)
    db.session.commit()
    return addedCalendar.ccode

def emit_events_to_calender(channel, cal_code):
    '''
    Emits all calendar events along channel
    '''
    sid = get_sid()
    all_events = [
        {
            "start": record.start,
            "end": record.end,
            "title": record.title,
        }
        for record in db.session.query(models.Event).filter_by(ccode=cal_code).all()
    ]
    for event in all_events:
        print(event)
        socketio.emit(channel, event, room=sid)
    
##SOCKET EVENTS
@socketio.on("connect")
def on_connect():
    """
    Runs on connect.
    """
    print("Someone connected!")


@socketio.on("disconnect")
def on_disconnect():
    """
    Runs on disconnect.
    """
    print("Someone disconnected!")


@socketio.on("new google user")
def on_new_google_user(data):
    """
    Runs verification on google token.
    """
    print("Beginning to authenticate data: ", data)
    sid = get_sid()
    try:
        idinfo = id_token.verify_oauth2_token(
            data["idtoken"],
            requests.Request(),
            "658056760445-ejq8q635n1948vqieqf95vsa6c6e1fvp.apps.googleusercontent.com",
        )
        userid = idinfo["sub"]
        print("Verified user. Proceeding to check database.")
        exists = (
            db.session.query(models.AuthUser.userid).filter_by(userid=userid).scalar()
            is not None
        )
        if not exists:
            push_new_user_to_db(userid, data["name"], data["email"])
            add_calendar_for_user(userid)
        all_ccodes = [ record.ccode for record in db.session.query(models.Calendars).filter_by(userid=userid).all() ]
        socketio.emit("Verified", {"name": data["name"], "ccodes": all_ccodes}, room=sid)
        return userid
    except ValueError:
        # Invalid token
        print("Could not verify token.")
        return "Unverified."
    except KeyError:
        print("Malformed token.")
        return "Unverified."



@socketio.on("add calendar")
def on_add_calendar(data):
    """
    add a new calednar for user
    """
    userid = data["userid"]
    ccode = add_calendar_for_user(userid)
    print(ccode)


@socketio.on("get events")
def send_events_to_calendar(data):
    print("LOOKING FOR CALCODE: ", data)
    emit_events_to_calender("calender_event", data)
    print("SENT EVENTS!")


    
def time_convert(time,date):
    time=time.split()
    if time[1]=="pm":
        time=time[0]+" PM"
    elif time[1]=="am":
        time=time[0]+" AM"
    military_time = datetime.strptime(time, '%I:%M %p').strftime('%H:%M')
    date_string = date+"T"+military_time
    format_date = datetime.strptime(date_string, '%Y-%m-%dT%H:%M')
    return int(format_date.timestamp())
    
@socketio.on("new event")
def on_new_event(data):
    """
    add a new event for to calendar
    """
    title = data['title']
    date = data['date']
    start = data['start']
    end = data['end']
    ccode = data['ccode']
    print(start)
    print(end)
    start_time=time_convert(start,date)
    end_time=time_convert(end,date)
    print(start_time,end_time)
    addedEventId = add_event( {
            "ccode": ccode,
            "title": title,
            "start": start_time,
            "end": end_time,
            "desc": "some words"
        })
    print(addedEventId)

# @socketio.on("add event")
# def on_add_event(data):
#     """
#     add a new event for to calendar
#     """
#     event = data["event"]
#     addedEventId = add_event(event)
#     print(addedEventId)

   

@app.route("/")
def hello():
    """
    Runs at page-load.
    """
    models.db.create_all()
    db.session.commit()
    add_event(
        {
            "ccode": "2",
            "title": "Lunch",
            "start": "1604965556",
            "end": "1604964556",
            "desc": "I'm hungry, let's eat",
        }
    )

    add_calendar_for_user("3")
    return flask.render_template("index.html")


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", "8080")),
        debug=True,
    )
