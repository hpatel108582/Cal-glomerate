import * as React from 'react';
import { Cal_comp } from "./CalenderComp";
import { Create_event } from "./Add_Event";
import { MergeCalenders } from "./MergeCalComp"
import "./HomePage.css"
export function HomePage(props) {
    let ccode = props.ccode;
    return (
        <div className= "conent_wrapper">
        <div className="interact_side">
            <MergeCalenders ccode = {ccode} />
            <Create_event ccode={ccode} />        
        </div>
        <div className="calender_side"><Cal_comp ccode={ccode} /></div>
        </div>
    );
}
