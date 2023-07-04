import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../../components/Header";
//import 'bootstrap/dist/js/bootstrap.min.js';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { BiSolidEdit } from 'react-icons/bi';



function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("Id");
  const navigate = useNavigate();

  const fetchProfileData = async () => {
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
      setProfile(data);
      setName(data.userName);
      setEmail(data.email);
      setPassword(data.password);
      setPhone(data.phoneNumber);
      console.log("data", JSON.stringify(data));
    }

  };

  const fetchUpdateMenuData = async (e) => {
    setOpen(!open);
    e.preventDefault();
    const res = await fetch("https://localhost:44327/api/Users/update",
      {
        mode: 'cors', method: 'PUT', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ "userId": userId, "userName": name, "email": email, "password": password, "phoneNumber": phone, 
          "role": "USER", "status": 1})
      });
    if (res.status === 200) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Chỉnh sửa hồ sơ thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      fetchProfileData();
    } else {
      const data = await res.text();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data
      })
    }
  };

  const handleOpen = () => setOpen(!open);

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handlePhoneChange = event => {
    setPhone(event.target.value);
  };

  useEffect(() => {
    if (localStorage) {
      var role = localStorage.getItem("Role");
      if (role !== "USER") {
        navigate("/");
      } else {
        fetchProfileData();
      }
    }
  }, []);

  return (
    <div>
      <Header />
      {profile !== null ? (
        <section style={{ backgroundColor: '#eee' }}>
          <div className="container py-5">
            {/* <div className="row">
          <div className="col">
            <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="#">User</a></li>
                <li className="breadcrumb-item active" aria-current="page">User Profile</li>
              </ol>
            </nav>
          </div>
        </div> */}

            <div className="row">
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-body text-center relative">
                    <div className="absolute top-1 right-1 hover:text-white flex">
                      <Fragment className="grid place-items-center">
                        <Button onClick={handleOpen} variant="gradient" className="shadow-none text-black flex justify-center items-center 
                        hover:cursor-pointer hover:text-yellow-300">
                          <span >Chỉnh sửa hồ sơ</span>
                          <BiSolidEdit size={30} />
                        </Button>
                        <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">

                          <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Chỉnh Sửa Hồ Sơ</h2></DialogHeader>
                          <DialogBody divider>
                            <form id="update" onSubmit={fetchUpdateMenuData}>
                              <div className="mb-4">
                                <h5 className="text-left ml-3 font-bold">Tên người dùng:</h5>
                                <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                  type="text" placeholder="Nhập họ và tên của bạn!" onChange={handleNameChange} value={name}
                                  required minLength={6} maxLength={50} />
                              </div>
                              <div className="mb-4">
                                <h5 className="text-left ml-3 font-bold">Email:</h5>
                                <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                  type="email" placeholder="Nhập địa chỉ email mới của bạn!" onChange={handleEmailChange} value={email}
                                  required minLength={5} maxLength={50} />
                              </div>
                              <div className="mb-4">
                                <h5 className="text-left ml-3 font-bold">Mật khẩu:</h5>
                                <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                  type="text" placeholder="Nhập mật khẩu mới của bạn!" onChange={handlePasswordChange} value={password}
                                  required minLength={5} maxLength={50} />
                              </div>
                              <div className="mb-4">
                                <h5 className="text-left ml-3 font-bold">Số điện thoại:</h5>
                                <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                  type="text" placeholder="Nhập số điện thoại mới của bạn!" onChange={handlePhoneChange} value={phone}
                                  required minLength={5} maxLength={50} />
                              </div>
                            </form>
                          </DialogBody>
                          <DialogFooter className="flex justify-end">
                            <Button
                              variant="text"
                              color="red"
                              onClick={handleOpen}
                              className="mr-3"
                            >
                              <span className="text-xl">Hủy bỏ</span>
                            </Button>
                            <Button variant="gradient" color="green" type="submit" className=" bg-green-600 px-3 py-1" form="update">
                              <span className="text-xl">Chỉnh sửa</span>
                            </Button>
                          </DialogFooter>
                        </Dialog>
                      </Fragment>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>

                      <img src="https://www.shareicon.net/data/128x128/2016/09/01/822751_user_512x512.png" alt="avatar" className="rounded-circle img-fluid" style={{ width: '100px' }} />
                    </div>
                    <h5 className="my-3">{profile?.userName}</h5>
                    {/* <p className="text-muted mb-1">{profile?.phoneNumber}</p>
                <p className="text-muted mb-4">{profile?.email}</p> */}
                    {/* <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">Follow</button>
                  <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                </div> */}
                  </div>
                </div>
                {/* <div className="card mb-4 mb-lg-0">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fas fa-globe fa-lg text-warning"></i>
                    <p className="mb-0">https://mdbootstrap.com</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-github fa-lg" style={{ color: '#333333' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }}></i>
                    <p className="mb-0">@mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-instagram fa-lg" style={{ color: '#ac2bac' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                </ul>
              </div>
            </div> */}
              </div>
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3 inline-block">
                        <p className="mb-0 font-bold mr-5">Tên người dùng: </p>
                      </div>
                      <div className="col-sm-9 inline-block">
                        <p className="text-muted mb-0">{profile?.userName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3 inline-block">
                        <p className="mb-0 font-bold mr-5">Email: </p>
                      </div>
                      <div className="col-sm-9 inline-block">
                        <p className="text-muted mb-0">{profile?.email}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3 inline-block">
                        <p className="mb-0 font-bold mr-5">Số điện thoại: </p>
                      </div>
                      <div className="col-sm-9 inline-block">
                        <p className="text-muted mb-0">{profile?.phoneNumber}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3 inline-block">
                        <p className="mb-0 font-bold mr-5">Vai trò: </p>
                      </div>
                      <div className="col-sm-9 inline-block">
                        <p className="text-muted mb-0">{profile?.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="row">
              <div className="col-md-6">
                <div className="card mb-4 mb-md-0">
                  <div className="card-body">
                    <p className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</p>
                    <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                    <div className="progress rounded mb-2" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-4 mb-md-0">
                  <div className="card-body">
                    <p className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</p>
                    <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                    <div className="progress rounded mb-2" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
              </div>
            </div>
          </div>

        </section>
      ) : null}
    </div>
  )
}
export default UserProfile;