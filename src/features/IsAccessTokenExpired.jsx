import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetAuthToken } from '../redux/action/isAuthSlice';
import { resetUserInfo } from '../redux/action/userInfoSlice';

function IsAccessTokenExpired() {
  const { access } = useSelector((state) => state.userInformation);
  const dispatch = useDispatch();

  if(access) {
    const token = JSON.parse(atob(access.split('.')[1]));
     console.log("Issued at:", new Date(token.iat * 1000));
    console.log("Expires at:", new Date(token.exp * 1000));

  const now = Date.now();
  const expiresAt = token.exp * 1000;

  console.log("Expired:", now >= expiresAt);
  const result = now>=expiresAt;

  if(result){
      dispatch(resetAuthToken());
      dispatch(resetUserInfo());
  }

  
  return result
  }





// const payload = JSON.parse(atob(access.split('.')[1]));;

// const currentTime = Date.now();        // milliseconds
// const expiryTime = payload.exp * 1000; // convert seconds → milliseconds

// if (currentTime >= expiryTime) {
//   console.log("Token expired");
// } else {
//   console.log("Token is still valid");
  
// }
}

export default IsAccessTokenExpired