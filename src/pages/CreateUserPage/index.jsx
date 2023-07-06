import React, { useEffect } from 'react';
import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';

function CreateUser() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('Token');

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = "https://localhost:44327/api/Users/create";

    const handleEmailChange = event => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };
    const handleUserNameChange = event => {
        setUserName(event.target.value);
    };
    const handlePhoneNumberChange = event => {
        setPhoneNumber(event.target.value);
    };
    const handleRoleChange = event => {
        setRole(event.target.value);
    };
    const handleStatusChange = event => {
        setStatus(event.target.value);
    };

    const fetchUserData = async (event) => {
        event.preventDefault();
        
        try {
            const res = await fetch(url, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password,
                    email: email,
                    phoneNumber: phoneNumber,
                    role: role,
                    status: status
                }),
            });
            if (res.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Create user successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate('/users');
            } else {
                const data = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.title,
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while creating the user.',
            });
        }
    };

    // ...


    return (
        <div>
            <AdminHeader /> <br />
            <div className='text-center'><h1 className='text-black text-4xl mb-5 font-extrabold'>Create User</h1></div>
            <div>
                <div className="px-4 py-5">
                    <form onSubmit={fetchUserData}>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="email" placeholder="Email" required onChange={handleEmailChange} value={email} minLength={6} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="password" placeholder="Password" required onChange={handlePasswordChange} value={password} minLength={6} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="text" placeholder="User Name" required onChange={handleUserNameChange} value={userName} minLength={5} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="text" placeholder="Phone Number" required onChange={handlePhoneNumberChange} value={phoneNumber} minLength={10} maxLength={11} />
                        </div>
                        <div className='mb-4'>
                            <div className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'>
                                <select required value={role} onChange={handleRoleChange}>
                                    <option>Please choose role</option>
                                    <option value='USER'>User</option>
                                    <option value='ADMIN'>Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'>
                                <select required value={status} onChange={handleStatusChange}>
                                    <option>Please choose status</option>
                                    <option value='1'>Active</option>
                                    <option value='0'>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <button className=' bg-gray-700 p-3 w-full rounded-3xl font-sans text-base text-white hover:bg-gray-500' type='submit' >Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default CreateUser;

