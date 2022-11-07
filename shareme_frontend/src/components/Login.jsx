import React from 'react';
/* import GoogleLogin from 'react-google-login'; */
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { GoogleLogin, googleLogout } from '@react-oauth/google'
/* import { createOrGetUser } from '../utils/index' */
import jwt_decode from 'jwt-decode';

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logo.png'
import logowhite from '../assets/logowhite.png'

import { client } from '../client'

const Login = () => {
  const navigate = useNavigate();
  const createOrGetUser = async (response, addUser) => {
    const decoded = jwt_decode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded))
  
    const user = {
      _id: decoded.sub,
      _type: 'user',
      userName: decoded.name,
      image: decoded.picture
    }

    client.createIfNotExists(user).then(()=> {
      navigate('/', { replace: true })
    })
    console.log("user", user);
  }

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={ shareVideo }
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo'/>
          </div>
          <div className='shadow-2x1'>
            <div>
              <GoogleLogin
                onSuccess={(response) => createOrGetUser(response)}
                onError={(error) => console.log(error)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login