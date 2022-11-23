import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const UserProfile = () => {

  const [ user, setUser ] = useState(null);
  const [ text, setText ] = useState('created');
  const [ activeBtn, setActiveBtn ] = useState('created');

  const [ pins, setPins ] = useState([]);

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

  useEffect(()=>{
    if(text == 'created'){
      const CreatedPinsQuery = userCreatedPinsQuery(userId);
  
      client.fetch(CreatedPinsQuery)
        .then((data) => {
          setPins(data);
          console.log("created", {data});
        })
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);
  
      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data);
          console.log("saved",{data});
        })
    }
  }, [text, userId])

  const bgPrifile = {
    backgroundImage: 'url("https://source.unsplash.com/1600x900/?nature,photography,technology")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }

  const logout = () => {
    localStorage.clear();
    
    navigate('/login');
  }

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
  const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';


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
            <p className='font-bold text-xl text-white'>{ user?.userName }</p>
          </div>
          <div className='absolute top-1 z-1 right-10 p-2'>
            { userId === user._id && (
              <button onClick={logout}
                className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'>
                Logout
              </button>
            )}
          </div>
      </div>
      <div className='mt-2'>
        <div className='text-center mb-7'>
          <button
            type='button'
            onClick={(e) => {
              setText(e.target.textContent.toLowerCase());
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type='button'
            onClick={(e) => {
              setText(e.target.textContent.toLowerCase());
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>
        { pins?.length ? (
          <div className='px-2'>
            <MasonryLayout pins={pins}/>
          </div>
        ):(
          <div className='px-2 w-full text-center'>There is no pins yet!, Create One...</div>
        ) }
        
      </div>
    </div>
  )
}

export default UserProfile