import React, { useState, useEffect } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { categories } from '../utils/data'
import { client } from '../client'
import Spinner from './Spinner'
import { Oval } from 'react-loader-spinner';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (ev) => {
    const selectedFile = ev.target.files[0];
    //  upload to sanity
    if(selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload Failed:', error.message);
        });
    }else{
      setLoading(false);
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    setSaving(true);
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };
      
      client.create(doc).then(() => {
        setSaving(false);
        navigate('/');
      });
    }else{
      setFields(true);
      setSaving(false);
      setTimeout(
        () => {
          setFields(false);
        }, 2000
      )
    }
  }

  useEffect(() => {
    console.log("the title value is", title);
  }, [title])

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      { fields && (/* show when the fields is not filled */
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please add all fields.</p>
      ) }
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && (
              <Spinner />
            )}
            {
              wrongImageType && (
                <p>It&apos;s wrong file type.</p>
              )
            }
            {!imageAsset ? (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}/* delete image */
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
        <input 
          type="text"
          name="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="add your title"
          className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
        />
        {user && (
          <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
            <img
              src={user.image}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />
            <p className="font-bold">{user.userName}</p>
          </div>
        )}
        <input 
          type="text"
          value={about}
          onChange={e => setAbout(e.target.value)}
          placeholder="Tell me what is your Pin is about"
          className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
        />
        <input 
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="add an Url Destination link "
          className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
        />
        <div className='flex flex-col'>
          <div>
            <p className='mb-2 font-semibold text:lg sm:text-xl'>Choose pin category</p>
            <select name="category"
              onChange={(e) => { setCategory(e.target.value) }}
              className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
            >
              <option value="others" className='sm:text-bg bg-white'>Select Category</option>
              { categories.map((item, i) => (
                <option value={item.name} key={i} className='text-base border-0 outline-none capitalize bg-white text-black'>
                  { item.name }
                </option>
              )) }

            </select>
          </div>
          <div className='flex justify-end items-end mt-5'>
            <button
              type='button'
              onClick={savePin}
              className='flex justify-center bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
            >
              <span>
                Save Pin
              </span>
              {saving && (
                  <div style={{ height: '10px', width: '25px' }}>
                    <Oval
                      height={20}
                      width={20}
                      color="black"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel='oval-loading'
                      secondaryColor="#4fa94d"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </div>
                )
              }
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CreatePin