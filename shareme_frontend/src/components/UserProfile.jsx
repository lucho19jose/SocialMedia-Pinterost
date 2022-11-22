import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const UserProfile = () => {

  const [ user, setUser ] = useState(null);

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
        console.log(user);
        console.log(data);
      })
  }, [userId])

  const bgPrifile = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1661074670187-3237f445f10d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }

  if(!user){
    return ( <Spinner message={'Loading User'} /> )
  }

  return (
    <div className=''>
      <div style={bgPrifile} className="w-full flex flex-wrap justify-center items-center pt-20">
          <div className='w-full flex justify-center'>
            <img src={user?.image} alt="User Image" className='rounded-full'/>
          </div>
          <div>
            <p>{ user?.userName }</p>
          </div>
      </div>
    </div>
  )
}

export default UserProfile