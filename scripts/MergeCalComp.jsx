import React, { useState } from 'react';
import { Socket } from './Socket';

export function MergeCalenders({ ccode }) {
  const [mergeInput, setMergeInput] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    Socket.emit('cCodeToMerge', {
      mergeCcode: { mergeInput }
    });
    console.log(
      `you entered the C-code ${mergeInput} your calender will merge with that input`
    );
    setMergeInput('');
    Socket.emit('merge with', {
      currentUser: ccode[0],
      userToMergeWith: mergeInput
    });
  }

  function changed(event) {
    console.log(mergeInput);
    setMergeInput(event.target.value);
  }

  return (
    <div>
      <div>
        <p>Your Calender code is {ccode[0]}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={mergeInput}
          onChange={changed}
          placeholder="########"
          required
        />
        <button type="submit">Merge Calenders</button>
      </form>
    </div>
  );
}
