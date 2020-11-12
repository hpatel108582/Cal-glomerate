import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import * as dates from './dates';
import moment from 'moment';
import './CalenderStyle.css';
import { Socket } from './Socket';
import ExampleControlSlot from './ControlSlot';

export function Cal_comp(props){
    const [events, setEvents] = React.useState([]);
    const localizer = momentLocalizer(moment);
  
  React.useEffect(() => { Socket.emit('get events', props.ccode[0]); }, []);
    
  function new_Event() {
  React.useEffect(() => {
    Socket.on('calender_event', (data) => {
      console.log("title " + data['title']);
      console.log("start: " +  data['start'] );
      console.log("end: " + data['end']);

      let intstart = parseInt(data['start']);
      let start = new Date(intstart*1000);
      console.log(start);
      let intend = parseInt(data['end']);
      let end = new Date(intend*1000);
            console.log(end);

      let title= data['title'];
            setEvents([
          ...events,
          {
            start,
            end,
            title,
          },
        ],
      );
    });
  }, []);
 }
 
function handleSelect({start, end}){
    const title = window.prompt('New Event name');
    if (title)
      setEvents([
          ...events,
          {
            start,
            end,
            title,
          },
        ],
      );
  }

    new_Event();

 return (
      <div>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          step={60}
          defaultView={Views.MONTHS}
          max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2020, 11, 1)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={handleSelect}
        />
      </div>
    );
  }