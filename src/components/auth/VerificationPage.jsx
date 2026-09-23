import { object } from "motion/react-client";
import React, { use, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../features/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {resetEmailOnRedux} from '../../redux/action/emailAuthSlice'


function VerificationPage() {
  const [loading, setLoading] = useState(false);
  const [status , setStatus] = useState('');
  const navigate = useNavigate();
  const email = useSelector((state) => state.emailForToken);
  const dispatch = useDispatch();
  const location = useLocation();

   useEffect(() => {
  if (location.state?.SignUpSuccess) {
    toast.success(location.state.message, {
      position: "bottom-right",
    });

      navigate("/auth/token", {
      replace: true,
      state: {},
    });
  }
}, []);

  async function handleCodeSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log(data);
  }

  function checkTokenLength(e) {
    const value = e.target.value;

    if (value.length > 6) {
      toast.error("Code limit reached", {
        position: "bottom-right",
      });
    }
  }

  async function handleSendtoken(e) {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);


      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/auth/token/`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
  ...data,
  email: email.email,
}),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        setStatus('success');
          dispatch(resetEmailOnRedux());
           navigate("/login",  { replace: true ,state: {
            verification: true,
            message : result.message
           }});
       
      } 

      if(response.status === 400) {
        setLoading(false);
        toast.warning(result.message, {
          position: "bottom-right",
        });
        
      }

      if(response.status === 404) {
        setLoading(false);
        toast.warning(result.message, {
          position: "bottom-right",
        });
      }
      
      if(response.status === 429) {
        setLoading(false);
        toast.warning('too many request', {
          position: "bottom-right",
        });
      }



    } catch (error) {
      console.error("FULL ERROR:", error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);
      toast.error("Unable to connect to the server", {
        position: "bottom-right",
      });
    }
  }



  const handleKeyDown = (e) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="div bg-button w-screen h-20">
        <div className="header p-5 text-white text-xl font-bold">
          LocalGuide
        </div>
      </div>
      <div className="form-card flex flex-col items-center mt-20">
        <div className="header text-center">
          <h1 className="text-head font-bold text-3xl">Verification Code</h1>
          <h3 className="font-regular text-gray-500 mt-2">
            We sent a 6 digit code in your email.
          </h3>
        </div>
        <div className="form-layout w-100 mt-5">
          <form
            action=""
            onSubmit={(e) => {
              (handleSendtoken(e), setLoading(false));
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              name="tokens"
              maxLength={6}
              onChange={checkTokenLength}
              placeholder="Enter your code"
              className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500   [appearance:textfield]
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none"
            />

            <div
              className=""
              onClick={() => {
                setLoading(true);
              }}
            >
              <button
                type="submit "
                className="w-100 mt-5 text-center text-white font-bold bg-button p-3 w-full outline-none rounded-lg focus:border-blue-500 cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
      {loading ? <LoadingSpinner /> : ""}
    </div>
  );
}

export default VerificationPage;
