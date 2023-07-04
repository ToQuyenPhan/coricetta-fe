import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../../components/Header";
//import 'bootstrap/dist/js/bootstrap.min.js';
import jwt_decode from 'jwt-decode';



function UserProfile()  {
    const [profile, setProfile] = useState(null);
    const [tokenUser, setTokenUser] = useState(null);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const getUserId=()=> {
    if (token) {
        // Decode the token to get user information
        const decodedToken = jwt_decode(token);
        setTokenUser(decodedToken);
        console.log("tokenUser", JSON.stringify(decodedToken));
      }
  }

  const fetchProfileData = async () => {
    const res = await fetch(
      `https://localhost:44327/api/Users/byId?userId=${tokenUser.Id}`,
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
      console.log("data", JSON.stringify(data));
    }

  };

  useEffect(() => {
    if (localStorage) {
      var role = localStorage.getItem("Role");
      if (role !== "USER") {
        navigate("/");
      } else {
        getUserId();
        // fetchProfileData();
      }
    }
  }, []);

  useEffect(()=>{
    if(tokenUser !== null){
      fetchProfileData();
    }
  },[tokenUser])
  return (
    <div>
        <Header/>
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
              <div className="card-body text-center">
                <div  style={{ display: 'flex', justifyContent: 'center'}}>

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
  )}
  export default UserProfile;