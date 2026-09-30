import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { display, undoDisplay } from "../redux/action/infoSlice";
import UserIsAuth from "../protection/UserIsAuth";
import { resetUserInfo } from "../redux/action/userInfoSlice";
import { resetAuthToken } from "../redux/action/isAuthSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IsAccessTokenExpired from "../features/IsAccessTokenExpired";
import { useLocation, useNavigate } from "react-router-dom";
import everest from "../assets/everest.jpg";
import { FaPerson } from "react-icons/fa6";
import { IoPerson, IoSearch } from "react-icons/io5";
import FadeIn from "../features/FadeIn";

function LandingPage() {
  const { status } = useSelector((state) => state.isAuth);
  const { access, refresh,first_name , last_name } = useSelector((state) => state.userInformation);
  const [loggedOut, setLoggedOut] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutShow, setLogOutShow] = useState(false);
  const [destination, setDestination] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [experience , setExperience] = useState('');
  const [guideLanguage ,setGuideLanguage] = useState('');

  const navlist = [
    "Home",
    "Find a Guide",
    "Destinations",
    "Experiences",
    "Become a Guide",
    "How It Works",
    "About Us",
  ];
  // console.log(access)

  const location = useLocation();

const handleSearch = (e) => {
  e.preventDefault();

  switch (true) {
    case !destination:
      toast.warning("Select a destination", {
        position: "bottom-right",
      });
      break;
    
     case !experience:
      toast.warning("Select a experience", {
        position: "bottom-right",
      });
      break;

     case !guideLanguage:
      toast.warning("Select a language", {
        position: "bottom-right",
      });
      break;
    
      case !eventDate:
      toast.warning("Select a date", {
        position: "bottom-right",
      });
      break;

    case !status:
      toast.warning("Please log in", {
        position: "bottom-right",
      });
      break;

    default:
      toast.info("Guide will be soon available", {
        position: "bottom-right",
      });
      break;
  }
};



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
        },
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
    if (loggedOut === "success") {
      window.location.reload;
    }
  }, [loggedOut]);

  IsAccessTokenExpired();

  const noAuthActivity=(e)=> {
    e.preventDefault();

   if(status == false){
      toast.warning('please Log in', {
        position: "bottom-right",
      });
   }else{
     toast.info('guide will be soon available', {
        position: "bottom-right",
      });
   }

  }




  return (
    <div className="h-screen font-inter pl-5 pt-2 pr-5 ">
      <div className="nav-section flex justify-between items-center rounded-md p-5">
        <div className="logo text-xl">
          <h1 className="font-bold text-head">LocalGuide</h1>
        </div>
        <div className="nav-items flex gap-9 text-sm">
          {navlist.map((item, index) => {
            return (
              <ul key={index}>
                <li className="hover:cursor-pointer">{item}</li>
              </ul>
            );
          })}
        </div>
        <div className="auth-room">
          {status == true ? (
            <div className="div ">
              <img
                src="https://images.pexels.com/photos/18651260/pexels-photo-18651260.jpeg"
                alt="Profile"
                className="w-6 h-6 rounded-full border-2 border-button object-cover hover:cursor-pointer"
                onClick={() => {
                  if (logOutShow == false) {
                    setLogOutShow(true);
                  } else {
                    setLogOutShow(false);
                  }
                }}
              />

              {logOutShow === true ? (
                <div className="z-10">
                  <div
                    className="logout bg-button p-2 absolute right-3 rounded-sm top-17  mt-2 w-32 z-50 text-white hover:cursor-pointer"
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    logout
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div
              className="button hover:cursor-pointer bg-head pl-5 pr-5 pt-2 pb-2 rounded-sm text-white text-sm"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </div>
          )}
        </div>
      </div>
      <div className="relative landing-section h-[700px] overflow-visible rounded-md bg-button">
        {/* Image */}
        <div className="image h-full w-full overflow-hidden rounded-md mask-l-from-40% mask-l-to-90%">
          <img
            src="https://images.pexels.com/photos/35917995/pexels-photo-35917995.jpeg"
            alt="Travel destination"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex items-center">
          <FadeIn className="ml-20 max-w-xl">
            <h1 className="text-7xl font-bold leading-tight text-white drop-shadow-xl">
              Explore More,
              <br />
              Guided Better
            </h1>

            <p className="mt-4 text-lg text-white/90">
              Discover new places with local guides who make every journey
              memorable.
            </p>
          </FadeIn>
        </div>

       <div className="absolute left-1/2 -bottom-16 z-20 w-[90%] max-w-6xl -translate-x-1/2">
  <form
    className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-2xl sm:grid-cols-2 lg:grid-cols-5"
    onSubmit={handleSearch}
  >
    {/* Destination */}
    <div>
      <label
        htmlFor="destination"
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Destination
      </label>

      <select
        id="destination"
        name="destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="" disabled>
          Destination
        </option>
        <option value="kathmandu">Kathmandu</option>
        <option value="pokhara">Pokhara</option>
        <option value="chitwan">Chitwan</option>
        <option value="everest">Everest Region</option>
        <option value="annapurna">Annapurna Region</option>
      </select>
    </div>

    {/* Experience */}
    <div>
      <label
        htmlFor="experience"
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Experience
      </label>

      <select
        id="experience"
        name="experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="any">Any Experience</option>
        <option value="1-3">1–3 Years</option>
        <option value="3-5">3–5 Years</option>
        <option value="5-10">5–10 Years</option>
        <option value="10+">10+ Years</option>
      </select>
    </div>

    {/* Language */}
    <div>
      <label
        htmlFor="language"
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Language
      </label>

      <select
        id="language"
        name="language"
        value={guideLanguage}
        onChange={(e) => setGuideLanguage(e.target.value)}
        className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="any">Any Language</option>
        <option value="english">English</option>
        <option value="nepali">Nepali</option>
        <option value="hindi">Hindi</option>
        <option value="french">French</option>
        <option value="german">German</option>
        <option value="spanish">Spanish</option>
        <option value="chinese">Chinese</option>
        <option value="japanese">Japanese</option>
      </select>
    </div>

    {/* Date */}
    <div>
      <label
        htmlFor="date"
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Date
      </label>

      <input
        id="date"
        name="date"
        type="date"
        value={eventDate}
        onChange={(e)=> {setEventDate(e.target.value)}}
        className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>

    {/* Search */}
    <div className="flex items-end">
      <button
        type="submit"
        className="h-12 w-full rounded-lg bg-head px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      >
        Search Guides
      </button>
    </div>
  </form>
</div>

      </div>

      <ToastContainer />
    </div>
  );
}

export default LandingPage;
