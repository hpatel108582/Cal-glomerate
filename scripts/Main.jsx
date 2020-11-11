import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import { Cal_comp } from './CalenderComp';

const rootElement = document.getElementById('content');
ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  rootElement,
);
