import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {
  const [ loading, setLoading ] = useState(false);
  const [ pins, setPins ] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    console.log("Hello from useEffect", categoryId);
    if(categoryId) {
      const query = searchQuery(categoryId);
      
      client.fetch(query)
        .then((data) => {
          console.log("query data", data);
          setPins(data);
          setLoading(false);
        })
    }else{
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
        console.log("fetched data", data, pins);
      })
    }
  }, [categoryId])  

  if(loading) return <Spinner message="we are adding new ideas to your feed" />


  return (
    <div>
      { pins && <MasonryLayout pins={pins}  /> }
    </div>
  )
}

export default Feed