import React, { useState, useEffect } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { categories } from '../utils/data'
import { client } from '../client'
import Spinner from './Spinner'

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

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
        navigate('/');
      });
    }else{
      setFields(true);
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
      <div>
        <input 
          type="text"
          name="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="add your title"
        />
        <input 
          type="text"
          value={about}
          onChange={e => setAbout(e.target.value)}
          placeholder="Tell me what is your Pin is about"
        />
        <input 
          type="url"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="add an Url Destination link "
        />
        <div>
          <div>
            <p>Choose pin category</p>
            <select name="category"
              onChange={(e) => { setCategory(e.target.value) }}
            >
              <option value="others">Select Category</option>
              { categories.map((item, i) => (
                <option value={item.name} key={i}>
                  { item.name }
                </option>
              )) }

            </select>
          </div>
          <div>
            <button
              type='button'
              onClick={savePin}
              className=''
            >
              Save Pin
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CreatePin