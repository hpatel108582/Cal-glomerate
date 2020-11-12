import  React, { useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import * as dates from './dates';
import moment from 'moment';
import './CalenderStyle.css';
import { Socket } from './Socket';
import ExampleControlSlot from './ControlSlot';
import Modal from 'react-modal';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import 'rc-time-picker/assets/index.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

  
export function Cal_comp(){
    const [events, setEvents] = React.useState([]);
    const localizer = momentLocalizer(moment);
    const [modal, setModal] = React.useState(0);
    const [state,setState] = React.useState(
        {
            title: '',
            start:'',
            end:'',
            date:''
        }
    )
    const [startDate, setStartDate] = useState(new Date());
    const now = moment().hour(0).minute(0);
   const format = 'hh:mm a';
   const dateToFormat = 'YYYY/MM/DD';
   
    function onSChange(value) {
 
        console.log(value);
        setState({...state,start:value.format(format)})
        
        
  
    } 

    function onEChange(value) {
        console.log(value && value.format(format));
        setState({...state,end:value.format(format)})
    }
    
    
    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
  
    }
    const handleSubmit= (event)=> {
      
        event.preventDefault(); 
        const { title,date,start,end } =state
      console.log(title);
      console.log(date);
      console.log(start);
      console.log(end);
      Socket.emit('new event',  {
          'title': title,
          'date':date,
          'start':start,
          'end':end
          
      })
      
     
      
    }
    
    function onDChange(value){
        console.log(value)
        console.log(typeof(value))
        var newDate = value.toString()
        setState({...state,date:moment(newDate).format("YYYY-MM-DD")})
    }
    
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
  });
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
      <div>
       <button onClick={()=> setModal(true)}> Open Modal </button> 
            <Modal  
                isOpen={modal}
                onRequestClose={()=>setModal(false)}
                className="ReactModal__Overlay"
                align="center"
            >
            
          <form onSubmit={handleSubmit}>
      
        <h1>Add Event</h1>
        
        <h3> Title  </h3>
        <input
          type="text"
          name="title"
          value={state.title}
          onChange={handleChange}
        />
        
        <h3> Date </h3>
     <DatePicker selected={startDate} onChange={onDChange} />
        
        <h3> Start Time </h3>
            <TimePicker 
                showSecond={false}
                defaultValue={now}
                name="starttime"
                
                onChange={onSChange}
                format={format}
                use12Hours
                inputReadOnly
            /> 
            <h3> End  Time </h3>
            <TimePicker 
                showSecond={false}
                defaultValue={now}
                name="endtime"
                
                onChange={onEChange}
                format={format}
                use12Hours
                inputReadOnly
            /> 
      
      <button  type = "submit" onClick={()=> setModal(true)}>Send</button>
      
    </form>
     </Modal>
     </div>
        <Calendar
        //   selectable
          localizer={localizer}
          events={events}
          step={60}
          defaultView={Views.MONTHS}
          max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2020, 11, 1)}
        //   onSelectEvent={event => alert(event.title)}
        //   onSelectSlot={handleSelect}
        />
      </div>
    );
  }