import React, { useEffect } from 'react';
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [confirmPassword, setConfirmPasword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let url = "https://localhost:44327/api/Users/signup";

  useEffect(() => {
    if(localStorage){
      var role = localStorage.getItem('Role');
      if(role === 'USER'){
        navigate('/home');
      }
    }
}, [message])

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPasword(event.target.value);
  };
  const handleConfirmPasswordChange = event => {
    setConfirmPasword(event.target.value);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };
  const handlePhoneChange = event => {
    setPhone(event.target.value);
  };


  const fetchUserData = async (e) => {
    e.preventDefault();
    const res = await fetch(url, { mode: 'cors', method: 'POST', headers: headers, body: JSON.stringify({ "email" : email, "password": password, "confirmPassword" : confirmPassword, "username": name, "phoneNumber" : phone})});
    if (res.status === 200) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Sign Up successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const data = await res.text();
      setMessage(data);
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data
      });
    }
  };

  return (
    <div className="flex items-center w-full h-screen bg-[url('./assets/backgroundImage.jpeg')] bg-cover bg-center text-white relative">
      <div className="align-items-center absolute w-1/3 left-20 shadow-2xl">
        <div className="p-7 w-full bg-white">
          <div className='text-center'><h1 className='text-black text-4xl mb-5 font-extrabold'>Sign Up</h1></div>
          <div className='text-center text-black font-bold text-lg mb-3'>Explore <span className=' text-green-700'>delightful and enticing</span> Vietnamese recipes!</div> 
          <div>
            <div className="px-4 py-5">
              <form onSubmit={fetchUserData}>
                <div className="mb-4">
                  <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0' 
                  type="email" placeholder="Email" required onChange={handleEmailChange} value={email} minLength={6} maxLength={50}/>
                </div>
                <div className="mb-4">
                  <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0' 
                  type="password" placeholder="Password" required onChange={handlePasswordChange} value={password} minLength={6} maxLength={50}/>
                </div>
                <div className="mb-4">
                  <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0' 
                  type="password" placeholder="Confirm Password" required onChange={handleConfirmPasswordChange} value={confirmPassword} 
                  minLength={6} maxLength={50}/>
                </div>
                <div className="mb-4">
                  <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0' 
                  type="text" placeholder="Username" required onChange={handleNameChange} value={name} minLength={1} maxLength={50}/>
                </div>
                <div className="mb-4">
                  <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0' 
                  type='text' placeholder="Phone number" required onChange={handlePhoneChange} value={phone} />
                </div>
                <div className="mb-4">
                  <button className=' bg-gray-700 p-3 w-full rounded-3xl font-sans text-base text-white hover:bg-gray-500' type='submit'>SignUp</button>
                </div>
                <div className='text-center'>
                    <p className='text-black inline-block'>
                        Have an account? 
                        <Link to="/" className='ml-1 italic underline text-blue-800'>Sign In</Link>
                    </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

