import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogin } from 'react-google-login';
import { Socket } from './Socket';
import './loginstyle.css';
import { Cal_comp } from "./CalenderComp.jsx";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  function loginUser(response) {
    const name = response.getBasicProfile().getName();
    const email = response.getBasicProfile().getEmail();
    const idToken = response.getAuthResponse().id_token;
    Socket.emit('new google user', {name: name, email: email, idtoken: idToken});
  }

  function loginUserFail() {
    return false;
  }

  function verifiedSession() {
    React.useEffect(() => {
      Socket.on('Verified', (data) => {
        setLoggedIn(true);
        setUsername(data);
      });
    });
  }

  verifiedSession();
  if (loggedIn) {
    return (<div><Cal_comp /></div>);
  }

  return (
    <div className="outermost">
      <div className="inner">
        <h1 className="header">Calglomerate</h1>
        <GoogleLogin
          clientId="698177391473-sfucar7t4qoum5rpt14mso7vkbuh1lao.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={loginUser}
          onFailure={loginUserFail}
          cookiePolicy="single_host_origin"
        />
      </div>
    </div>
  );
}
