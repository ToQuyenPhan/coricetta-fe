import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import Swal from "sweetalert2";
import { FaEllipsisV } from "react-icons/fa";
import { Popover, Transition } from "@headlessui/react";

function Comment() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingId, setIsEditingId] = useState(0);
  const [editingComment, setEditingComment] = useState("");
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("Id");
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
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCommentData();
  }, []);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleEditingCommentChange = (event) => {
    setEditingComment(event.target.value);
  };

  const handleEditClick = (id, content) => {
    setIsEditing(true);
    setIsEditingId(id);
    setEditingComment(content);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsEditingId(0);
  };

  const handleDelete = (id) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://localhost:44327/api/Actions?actionId=${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log("id", id);
        fetchCommentData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitClick = async (id) => {
    const res = await fetch(
      `https://localhost:44327/api/Actions/update?actionId=${id}`,
      {
        mode: "cors",
        method: "PUT",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          recipeId: recipeId,
          type: 1,
          content: editingComment,
        }),
      }
    );
    if (res.status === 200) {
      fetchCommentData();
      setIsEditing(false);
      setIsEditingId(0);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("https://localhost:44327/api/Actions/create", {
      mode: "cors",
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ recipeId: recipeId, type: 1, content: comment }),
    });
    if (res.status === 200) {
      fetchCommentData();
      setComment("");
    } else {
      const data = await res.text();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data,
      });
    }
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
              <input
                className="border border-gray-300 p-3 w-3/4 rounded font-sans text-base text-black focus:outline-0"
                type="text"
                placeholder="Hãy để lại bình luận của bạn!"
                required
                onChange={handleCommentChange}
                value={comment}
                minLength={1}
                maxLength={50}
              />

              <button
                className=" bg-gray-700 p-3 w-1/6 rounded font-sans text-base text-white hover:bg-gray-500 ml-3"
                type="submit"
              >
                Bình luận
              </button>
            </div>
          </form>
        </div>
        {comments?.items !== undefined ? (
          <div>
            <h3 className="pl-5">Một số bình luận: </h3>
            {comments?.items.map((item) => (
              <div className="row relative">
                {isEditing && parseInt(isEditingId) === parseInt(item?.id) ? (
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
                        <input
                          className="border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0 block"
                          type="text"
                          placeholder="Hãy để lại bình luận của bạn!"
                          required
                          onChange={handleEditingCommentChange}
                          value={editingComment}
                          minLength={1}
                          maxLength={50}
                        />
                        <p
                          onClick={handleCancelClick}
                          className="hover:cursor-pointer hover:underline mt-2 inline-block mx-2"
                        >
                          Hủy
                        </p>
                        <p
                          onClick={() => handleSubmitClick(item?.id)}
                          className="hover:cursor-pointer hover:underline mt-2 inline-block"
                        >
                          Chỉnh sửa
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-8">
                    <div className="card card-white post">
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>
                        <div className="post-heading">
                          <div className="float-left meta">
                            <div className="title h5">
                              <b>{item?.username}</b>
                            </div>
                            <h6 className="text-muted time">
                              {item?.dateTimeString}
                            </h6>
                          </div>
                        </div>
                        <div className="post-description">
                          <p className="text-2xl">{item?.content}</p>
                        </div>
                        </div>
                        <div className="ml-auto" style={{ marginRight: "0px" }}>
                          {parseInt(userId) === parseInt(item?.userId) ? (
                            <div className="flex items-center justify-end p-6">
                              <Popover.Group className="hidden lg:flex lg:gap-x-12">
                                <Popover className="relative">
                                  <Popover.Button className="flex items-center justify-center w-8 h-8 text-gray-600 rounded-full hover:bg-gray-100">
                                    <FaEllipsisV
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </Popover.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                  >
                                    <Popover.Panel className="absolute right-0 mt-2 w-48 overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-gray-300">
                                      <Popover.Button
                                        onClick={() =>
                                          handleEditClick(
                                            item?.id,
                                            item?.content
                                          )
                                        }
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                      >
                                        Chỉnh sửa
                                      </Popover.Button>
                                      <Popover.Button
                                        onClick={() => handleDelete(item?.id)}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full"
                                      >
                                        Xóa
                                      </Popover.Button>
                                    </Popover.Panel>
                                  </Transition>
                                </Popover>
                              </Popover.Group>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center font-bold text-gray-500 py-5">
            <h1>Hãy là người bình luận đầu tiên!</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
