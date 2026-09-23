import React, { use, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { display , undoDisplay } from '../redux/action/infoSlice'
import UserIsAuth from '../protection/UserIsAuth';
import { resetUserInfo } from '../redux/action/userInfoSlice'
import { resetAuthToken } from '../redux/action/isAuthSlice'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IsAccessTokenExpired from '../features/IsAccessTokenExpired'
import { useLocation, useNavigate } from 'react-router-dom';
import everest from '../assets/everest.jpg'
import { FaPerson } from 'react-icons/fa6';
import { IoPerson, IoSearch } from 'react-icons/io5';

function LandingPage() {
  const { status } = useSelector((state) => state.isAuth);
  const { access , refresh} = useSelector((state) => state.userInformation);
  const [loggedOut , setLoggedOut] = useState('');
  const navlist = ['Home', 'Explore Guides', 'Destination', 'About Us'];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutShow, setLogOutShow] = useState(false);
  // console.log(access)

  const location = useLocation();


 useEffect(() => {
  if (location.state?.loginSuccess) {
    toast.success(location.state.message, {
      position: "bottom-right",
    });

      navigate("/", {
      replace: true,
      state: {},
    });
  }
}, []);
  
const handleLogout = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          refresh_token: refresh,
        }),
      }
    );

    const result = await response.json();

    console.log("Status:", response.status);
    console.log("Result:", result);

    if (response.ok) {
      setLoggedOut("success");

      dispatch(resetUserInfo());
      dispatch(resetAuthToken());

      toast.success(result.message, {
        position: "bottom-right",
      });
    } else if (response.status === 400) {
      setLoggedOut("reject");

      toast.warning(result.message || "Bad request", {
        position: "bottom-right",
      });
    } else if (response.status === 401) {
      setLoggedOut("reject");

      toast.warning("Unauthorized", {
        position: "bottom-right",
      });
    } else if (response.status === 429) {
      setLoggedOut("reject");

      toast.warning("Too many requests", {
        position: "bottom-right",
      });
    } else {
      toast.warning(result.message || "Something went wrong", {
        position: "bottom-right",
      });
    }
  } catch (error) {
    console.error("Logout error:", error);

    toast.warning(error.message, {
      position: "bottom-right",
    });
  }
};

  useEffect(() => {
    if(loggedOut === 'success') {
      window.location.reload
    }
  }, [loggedOut]);

  IsAccessTokenExpired();






  return (
   <div className="">
 <div className="absolute landing-image h-screen">
  <img src="https://images.pexels.com/photos/18651260/pexels-photo-18651260.jpeg" alt="" className='w-screen h-screen object-cover'/>
  <div className="absolute inset-0 pt-5 pl-5 pr-10 flex items-center justify-between h-20 w-screen">
    <div className="heading">
      <h2 className="text-xl font-bold text-white">
     LocalGuide
    </h2>
    </div>
    <div className="nav-list flex gap-15 items-center">
     {navlist.map((item, index) => {
  return (
    <ul className="text-white font-bold" key={index}>
      <li className={`hover:cursor-pointer ${index === 0 ? "underline underline-offset-8 decoration-button" : ""}`}>
        {item}
      </li>
    </ul>
  );
})}

      <div className="button hover:cursor-pointer">
        <IoSearch color='white'/>
    </div>

     {status === true ? <div className="relative">
      <img
  src="https://images.pexels.com/photos/18651260/pexels-photo-18651260.jpeg"
  alt="Profile"
  className="w-6 h-6 rounded-full border-2 border-button object-cover hover:cursor-pointer"
  onClick={() => {
    if(logOutShow === false){
      setLogOutShow(true)
    }else{
      setLogOutShow(false);
    }
  }}
/>

{logOutShow === true ? <div className="list absolute">
 <ul className='bg-white text-sm p-1 mt-2'>
 <li onClick={(e) =>{ handleLogout(e)}} className='hover:cursor-pointer'>Logout</li>
 </ul>
</div> : ''}

     </div>
 : <div className="button hover:cursor-pointer" onClick={() =>{navigate('/login')}}>
        <IoPerson color='white'/>
    </div>}
    </div>
  </div>
 </div>


    
    <ToastContainer/>
   </div>
  )
}

export default LandingPage