import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons();
const rootElement = document.getElementById('content');
ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  rootElement
);
