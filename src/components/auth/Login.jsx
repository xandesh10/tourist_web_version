import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../features/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setUserInfo } from '../../redux/action/userInfoSlice'
import { setAuthToken } from '../../redux/action/isAuthSlice'

function Login() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    if (location.state?.verification) {
      toast.success(location.state.message, {
        position: "bottom-right",
      });
  
        navigate("/login", {
        replace: true,
        state: {},
      });
    }
  }, []);
  const handleKeyDown = (e) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
    }
  };
 const start = performance.now();
 const handleLoginSubmit = async (e) => {
  e.preventDefault();

  try {
    const start = performance.now();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    const responseTime = performance.now() - start;

    console.log("Response time:", responseTime, "ms");

    if (responseTime > 10 * 1000) {
      toast.error("Request took too long, please try again.", {
        position: "bottom-right",
      });
      return;
    }

    if (response.status === 200) {
      dispatch(
        setUserInfo({
          first_name: result.first_name,
          last_name: result.last_name,
          username: result.username,
          user_id: result.user_id,
          access: result.access,
          refresh: result.refresh,
        })
      );

      dispatch(setAuthToken());

      navigate("/", { replace: true , state: {
        loginSuccess: true,
        message: result.message

      }});

    } else if (response.status === 400) {
      setStatus("reject");

      toast.warning(result.message || "Invalid login details", {
        position: "bottom-right",
      });

    } else if (response.status === 429) {
      setStatus("reject");

      toast.warning("Too many requests", {
        position: "bottom-right",
      });

    } else if (response.status === 500) {
      setStatus("reject");

      toast.warning(result.message || "Server error", {
        position: "bottom-right",
      });
    }

  } catch (error) {
    console.error("FULL ERROR:", error);

    toast.warning("Unable to connect to server", {
      position: "bottom-right",
    });
  }
};




  return (
    <div className="login">
      <div className="div bg-button w-screen h-20">
        <div className="header p-5 text-white text-xl font-bold">
          LocalGuide
        </div>
      </div>
      <div className="flex flex-col items-center mt-20">
        <div className="header text-center">
          <h1 className="text-head font-bold text-3xl">Login</h1>
          <h3 className="font-regular text-gray-500 mt-2">Welcome Back!.</h3>
        </div>
        <div className="form-layout w-100 mt-5">
          <form
            action=""
            onSubmit={(e) => {
              (handleLoginSubmit(e), setLoading(false));
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
              onKeyDown={handleKeyDown}
            />
            <input
              type="text"
              name="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500 mt-5"
            />

            <div className="">
              <button
                type="submit"
                onClick={()=> {setLoading(true)}}
                className="w-100 mt-5 text-center text-white font-bold bg-button p-3 w-full outline-none rounded-lg focus:border-blue-500 cursor-pointer"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
      {loading ? <LoadingSpinner/> : ''}
    </div>
  );
}

export default Login;
