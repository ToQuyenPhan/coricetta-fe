import React, { useEffect } from 'react';
import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const userId = location.state?.userId;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = "https://localhost:44327/api/Users/create";

    const fetchUpdateData = async () => {
        const res = await fetch(
            `https://localhost:44327/api/Users/byId?userId=${userId}`,
            {
                mode: "cors",
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
            }
        );
        if (res.status === 200) {
            const data = await res.json();
            setEmail(data.email);
            setPassword(data.password);
            setPhoneNumber(data.phoneNumber);
            setUserName(data.userName);
            setRole(data.role);
            setStatus(data.status);
        }
    };


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
        if (role !== 'USER' && role !== 'ADMIN') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hãy chọn vai trò cho người dùng!',
            });
            return;
        }
        if (parseInt(status) !== 1 && parseInt(status) !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hãy chọn trạng thái cho người dùng!',
            });
            return;
        }
        try {
            if (userId !== undefined) {
                const res = await fetch("https://localhost:44327/api/Users/update", {
                    mode: 'cors',
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
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
                        title: 'Chỉnh sửa thành công!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate('/users');
                } else {
                    const data = await res.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data,
                    });
                }
            } else {
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
                        title: 'Tạo người dùng mới thành công!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate('/users');
                } else {
                    const data = await res.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data,
                    });
                }
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

    useEffect(() => {
        if (userId !== undefined) {
            fetchUpdateData();
        }
    }, []);

    return (
        <div>
            <AdminHeader /> <br />
            {userId !== undefined ? (
                <div className='text-center'><h1 className='text-black text-4xl mb-5 font-extrabold'>Chỉnh Sửa Thông Tin Người Dùng</h1></div>
            ) : (
                <div className='text-center'><h1 className='text-black text-4xl mb-5 font-extrabold'>Tạo Người Dùng Mới</h1></div>
            )}
            <div>
                <div className=" px-96 py-5">
                    <form onSubmit={fetchUserData}>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="email" placeholder="Email" required onChange={handleEmailChange} value={email} minLength={6} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="password" placeholder="Mật khẩu" required onChange={handlePasswordChange} value={password} minLength={6} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="text" placeholder="Tên người dùng" required onChange={handleUserNameChange} value={userName} minLength={5} maxLength={50} />
                        </div>
                        <div className="mb-4">
                            <input className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'
                                type="text" placeholder="Số điện thoại" required onChange={handlePhoneNumberChange} value={phoneNumber} minLength={10} maxLength={11} />
                        </div>
                        <div className='mb-4'>
                            <div className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'>
                                <select required value={role} onChange={handleRoleChange} className='w-full'>
                                    <option>Hãy chọn vai trò cho người dùng</option>
                                    <option value='USER'>User</option>
                                    <option value='ADMIN'>Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='border border-gray-300 p-3 w-full rounded-3xl font-sans text-base text-black focus:outline-0'>
                                <select required value={status} onChange={handleStatusChange} className='w-full'>
                                    <option>Hãy chọn trạng thái cho người dùng</option>
                                    <option value='1'>Hoạt động</option>
                                    <option value='0'>Vô hiệu hóa</option>
                                </select>
                            </div>
                        </div>
                        {userId !== undefined ? (
                            <div className="mb-4">
                                <button className=' bg-gray-700 p-3 w-full rounded-3xl font-sans text-base text-white hover:bg-gray-500' type='submit' >Chỉnh sửa</button>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <button className=' bg-gray-700 p-3 w-full rounded-3xl font-sans text-base text-white hover:bg-gray-500' type='submit' >Tạo</button>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );

}

export default CreateUser;
