import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    avatar: "",
  })
  
  // handling the input values
  const handleInputChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFormData({ ...formData, avatar: e.target.files[0] });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("avatar", formData.avatar);
    console.log(formDataToSend);
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        // here if we are done with login we want the user to get logged in and redisrected to the home page
        const loginResponse = await fetch("http://localhost:8000/api/v1/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        });
        if(loginResponse.ok){
          const data = await loginResponse.json();
          document.cookie = `accessToken=${data.data.acessToken}`;path="/";
          document.cookie = `refreshToken=${data.data.refreshToken}`;path="/";
          window.location.href = "/";
        }else{
          const error = await loginResponse.json();
          alert(error.message);
        }
      } else {
        toast.error('User Already Exists! Please Login.')
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
<div className="bg-gray-800 h-screen">
  <div className="flex justify-center items-center h-full">
    <div className="w-full max-w-md p-4 rounded-md shadow-lg sm:p-8 bg-gray-900 text-gray-100 relative">
<h2 className="mb-3 text-3xl font-semibold text-center">
              Create your account
            </h2>
            <p className="text-sm text-center text-gray-400">
              Already have an account?
              <Link to="/login" className="text-violet-600">
                {" "}
                Login
              </Link>
            </p>
            <div className="my-6 space-y-4">
              <button
                aria-label="Signup with Google"
                type="button"
                className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-600 focus:dark:ring-violet-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                </svg>
                <p>Signup with Google</p>
              </button>
              {/* Add similar buttons for GitHub and Twitter */}
            </div>
            <div className="flex items-center w-full my-4">
              <hr className="w-full dark:text-gray-600" />
              <p className="px-3 dark:text-gray-600">OR</p>
              <hr className="w-full dark:text-gray-600" />
            </div>

            {/* Signup form manually */}

            <form noValidate action="" className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="fullName" className="text-sm">
                        Full name
                      </label>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="enter your email address"
                      className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                      data-qa="input"
                    />
                  </div>

                  {/* password */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="text-sm">
                        Password
                      </label>
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="*****"
                      className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    />
                  </div>
                  {/* bio */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="bio" className="text-sm">
                        Bio
                      </label>
                    </div>
                    <input
                      type="text"
                      name="bio"
                      id="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    />
                  </div>

                  {/* Avatar */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="avatar" className="text-sm">
                        Profile Picture
                      </label>
                    </div>
                    <input
                      type="file"
                      name="avatar"
                      onChange={handleFileChange}
                      id="avatar"
                      placeholder="upload your profile picture"
                      className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                    />
                  </div>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
