import React, { useState } from 'react';
import { Socket } from './Socket';

export function MergeCalenders(props){
    const [mergeInput, setMergeInput] = useState("");
    function handleSubmit(event){
        event.preventDefault();
        Socket.emit('cCodeToMerge',{
            'mergeCcode' : {mergeInput},
        });
        console.log('you entered the C-code ' + { mergeInput } + ' your calender will merge with that input');
    setMergeInput("");
        }
    
    function changed(event) {
        setMergeInput(event.target.value);
        }

    return (
        <div>
        <div><p>Your Calender code is <span> {props.ccode[0]}</span></p></div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={mergeInput} onChange={changed} placeholder="########" required/>
            <button type = "submit">Merge Calenders</button>
        </form>
        </div>

    );
}

