import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import events from './events';
import * as dates from './dates';
import moment from 'moment';
import './CalenderStyle.css';


export function Cal_comp(){
let allViews = Object.keys(Views).map(k => Views[k]);

const localizer = momentLocalizer(moment);

return(
  <Calendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
    defaultDate={new Date(2015, 3, 1)}
    components={{
    }}
    localizer={localizer}
  />

);
}