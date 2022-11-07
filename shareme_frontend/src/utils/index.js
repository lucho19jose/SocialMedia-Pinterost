import jwt_decode from 'jwt-decode';

export const createOrGetUser = async (response, addUser) => {
  const decoded = jwt_decode(response.credential);
  console.log(decoded);

  const user = {
    _id: decoded.sub,
    _type: 'user',
    userName: decoded.name,
    image: decoded.picture
  }
}