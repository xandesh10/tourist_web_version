import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../features/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmailOnRedux } from "../../redux/action/emailAuthSlice";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showToastMessage = () => {
    toast.success("send", {
      position: "bottom-right",
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget; // 👈 ADD THIS

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const start = performance.now();
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("STATUS:", response.status);
      console.log("CONTENT TYPE:", response.headers.get("content-type"));

      const result = await response.json();
      const end = performance.now();
      const responseTime = end - start;

      console.log("server response time", responseTime);

      if(responseTime > 10 * 1000){
        setLoading(false)
          toast.error('toke too long to responed , please try again', {
          position: "bottom-right",
        });
      }else{
        
      if (response.ok) {
        setLoading(false);
        dispatch(setEmailOnRedux({
          email : formData.get('email')
        }))
        console.log(formData.get('email'));
        // toast.success(result.message, {
        //   position: "bottom-right",
        // });

        form.reset(); // 👈 now this works

         navigate("/auth/token",  { replace: true ,state : {
          SignUpSuccess : true,
          message : result.message
         }});
      } else {
        setLoading(false);

        toast.warning(result.message || "Something went wrong", {
          position: "bottom-right",
        });
      }
      }

    } catch (error) {
      setLoading(false);

      console.error("Request failed:", error);

      toast.error("Unable to connect to the server", {
        position: "bottom-right",
      });
    }
  }

  return (
    <div className="">
      <div className="div bg-button w-screen h-20">
        <div className="header p-5 flex">
          <h1 className="text-white text-xl font-bold">LocalGuide </h1>
        </div>
      </div>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10 p-6"
        onSubmit={(e) => {
          handleFormSubmit(e);
          setLoading(true);
        }}
      >
        {/* First Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            First Name
          </label>
          <input
            name="first_name"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter first name"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Last Name
          </label>
          <input
            name="last_name"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter last name"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Username */}
        {/* <div>
          <label className="block mb-2 font-medium text-gray-700">
            Username
          </label>
          <input
            name="username"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter username"
            onKeyDown={handleKeyDown}
          />
        </div> */}

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter email"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Gender</label>

          <select
            name="gender"
            defaultValue=""
            className="border border-gray-300 p-3 w-full outline-none rounded-lg bg-white focus:border-blue-500"
          >
            <option value="" disabled>
              -- Select gender --
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Nationality
          </label>
          <input
            name="nationality"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter nationality"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500 [appearance:textfield]
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Enter age"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="border border-gray-300 p-3 w-full outline-none rounded-lg focus:border-blue-500"
            placeholder="Enter password"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-button py-3 px-10 rounded-lg text-white cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            Submit
          </button>
        </div>

        <ToastContainer />
      </form>

      {loading ? <LoadingSpinner /> : ""}
    </div>
  );
}

export default SignUp;
