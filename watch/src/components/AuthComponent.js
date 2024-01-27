import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./auth.css";

const AuthComponent = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://watch-later.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('jwt', data.token, { expires: 1 / 24 });
        toast('Login successful!');
        
        navigate('/watchlist');
      } else {
        toast('Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast('An error occurred during login.');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('https://watch-later.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('jwt', data.token, { expires: 1 / 24 });
        toast('Signup successful!');
      } else {
        toast('Signup failed. Username may be taken.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast('An error occurred during signup.');
    }
  };

  return (
    <div className='page'>
      <div className='first'></div>
      <div className='second'>
        <p className='title'>Signin / Signup</p>
        <div className='fi'>
          <p className='name'>Name</p>
          <input
            className='inp1'
            type="text"
            id="username"
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='fi'>
          <p className='name'>Password</p>
          <input
            className='inp1'
            type="password"
            id="password"
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='but'>
          <button className='bu' onClick={handleLogin}>Signin</button>
          <button className='lo' onClick={handleSignup}>Signup</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthComponent;
