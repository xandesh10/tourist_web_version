import React from 'react'
import { Route , Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SignUp from './components/auth/SignUp'
import VerificationPage from './components/auth/VerificationPage'
import Login from './components/auth/Login'
import NotFoundPage from './components/NotFoundPage'
import { useSelector } from 'react-redux'
import IsAccessTokenExpired from './features/IsAccessTokenExpired'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const { status } = useSelector((state) => state.isAuth);
  const exp_status = IsAccessTokenExpired();



  return (
   <div>
   <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/signup' element={status === false  ? <SignUp/> : <NotFoundPage/>}/>
    <Route path='/auth/token' element={status === false   ? <VerificationPage/> : <NotFoundPage/>}/>
    <Route path='/login' element={status === false ? <Login/> : <NotFoundPage/>}/>
   </Routes>
     <ToastContainer/>
   </div>
  )
}

export default App