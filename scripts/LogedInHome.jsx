import * as React from 'react';
import { Cal_comp } from "./CalenderComp";
import { Create_event } from "./Add_Event";
export function HomePage(props) {
    let ccode = props.ccode;
    return (
        <div>
            <Create_event ccode={ccode} />
            <Cal_comp ccode={ccode} />
            
        </div>
    );
}
