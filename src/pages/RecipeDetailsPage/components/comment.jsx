import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";

function Comment() {
  const [comment, setComment] = useState(null);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  const recipeId = location.state?.recipeId;

  const fetchCommentData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://localhost:44327/api/Actions?recipeId=${recipeId}&Type=1&currentPage=1&pageSize=10`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("comment", JSON.stringify(response.data));
        setComment(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCommentData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const commentContent = event.target.comment.value;

    // Gửi bình luận đến API

    // Sau khi gửi thành công, có thể cần làm mới danh sách bình luận bằng cách gọi fetchCommentData() lại.
  };

  return (
    <div>
      <div className="container">
        <div className="col-lg-12">
          <form
            className=" bg-white rounded p-5"
            id="comment-form"
            onSubmit={handleSubmit}
          >
            <h3 className="mb-4">Viết bình luận:</h3>
            <div className="mb-4">
              <input className='border border-gray-300 p-3 w-3/4 rounded font-sans text-base text-black focus:outline-0'
                type="text" placeholder="Hãy để lại bình luận của bạn!" />

              <button className=' bg-gray-700 p-3 w-1/6 rounded font-sans text-base text-white hover:bg-gray-500 ml-3' 
                type='submit'>Bình luận</button>
            </div>
          </form>
        </div>
        <h3>Một số bình luận: </h3>
        {comment?.items.map((item, index) => (
          <div className="row" key={index}>
            <div className="col-8">
              <div className="card card-white post">
                <div className="post-heading">
                  <div className="float-left meta">
                    <div className="title h5">
                      <b>{item?.username}</b>
                    </div>
                    <h6 className="text-muted time">{item?.dateTime}</h6>
                  </div>
                </div>
                <div className="post-description">
                  <p>{item?.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Comment;
