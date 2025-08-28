import React from 'react'
import logo from "../../public/a.png"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from "axios"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from 'react';
import toast from 'react-hot-toast'

const Home = () => {

    const [courses, setCourses] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(()=>{
      const token = localStorage.getItem("user");
      if(token){
        setLoggedIn(true)
      } else {
        setLoggedIn(false)

      }
    },[])
    useEffect(()=>{
        const getCourses = async() => {
            try {
                const response = await axios.get("http://localhost:4001/api/v1/courses")
                console.log(response.data.courses)
                setCourses(response.data.courses)
                
            } catch (error) {
                console.log(error)
              
                
            }
        }

        getCourses();

},[]);

const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay : true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen w-screen overflow-hidden">
    <div className=" text-white container mx-auto">
        <header className="flex items-center justify-between p-7">
            <div className="flex space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full"/>
                <h1 className="text-2xl text-orange-400 font-bold">Course Heaven</h1>
            </div>
            <div className=" space-x-3">
                {loggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
            </div>
        </header>
        <hr />


        <section className="text-center my-8">
            <h1 className="text-4xl text-orange-400 font-bold">Course Heaven</h1>
            
            <p className="pt-6">ohken fehnfe fehfe fkefe fekhbfe</p>
            <div className='p-8 space-x-4'>
                <Link to={"/courses"} className="bg-green-600 hover:bg-white duration-300 px-6 py-3 border border-white rounded text-black font-semibold">Explore Courses</Link>
                <Link className="bg-green-600 hover:bg-white duration-300 px-6 py-3 border border-white rounded text-black font-semibold">Courses Videos</Link>
            </div>
        </section>
        <section className="px-19">
             <Slider {...settings}>
                {courses.map((course) => (
              <div key={course._id} className="p-6 ">
                <div className="relative flex-shrink-0 w-62 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden p-6">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-2xl font-bold text-white pb-8">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} className="mt-9 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        
      </Slider>
        </section>


  <hr />
        <footer className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full"/>
                <h1 className="text-2xl text-orange-400 font-bold">Course Heaven</h1>
            </div>
                <div className="items-center flex flex-col">
                    <h2 className="text-gray-400">Connects</h2>
                    <ul>
                        <li className="font-semibold text-gray-700">kbfwb</li>
                        <li className="font-semibold text-gray-700">jbfbw</li>
                        <li className="font-semibold text-gray-700">hjvejbwk</li>
                    </ul>
                </div>
                <div className="items-center flex flex-col">
                    <h2 className="text-gray-400">Copyright @2025</h2>
                    <ul>
                        <li className="font-semibold text-gray-700">kbfwb</li>
                        <li className="font-semibold text-gray-700">jbfbw</li>
                        <li className="font-semibold text-gray-700">hjvejbwk</li>
                    </ul>
                </div>
            </div>
        </footer>
    </div>

    </div>
  )
}

export default Home