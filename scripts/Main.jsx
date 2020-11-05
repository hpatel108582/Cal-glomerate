import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';

const rootElement = document.getElementById('content');
ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  rootElement,
);
