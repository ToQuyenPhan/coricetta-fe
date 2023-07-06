import React, { useState, useEffect, Fragment } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BsShare, BsShareFill } from 'react-icons/bs';
import { BiSolidFlag, BiLike, BiSolidLike, BiSolidEdit, BiCart } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md';
import axios from "axios";
import Header from "../../components/Header";
import Comment from "./components/comment";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';
import {
  FacebookIcon,
  FacebookShareButton
} from "react-share";

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [open, setOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [authorId, setAuthorId] = useState('');
  const [like, setLike] = useState(null);
  const [description, setDescription] = useState('');
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("Id");
  const navigate = useNavigate();
  const location = useLocation();
  const recipeId = location.state?.recipeId;

  const fetchRecipeData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://localhost:44327/api/Recipes/${recipeId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("data", JSON.stringify(response.data));
        setRecipe(response?.data);
        setAuthorId(response.data.userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchReportedRecipeData = async () => {
    const res = await fetch(`https://localhost:44327/api/Reports/find?userId=${userId}&recipeId=${recipeId}`,
      {
        mode: 'cors', method: 'GET', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }),
      });
    if (res.status === 200) {
      setIsReported(true);
    }
  };

  const fetchReportRecipeData = async (e) => {
    setOpen(!open);
    e.preventDefault();
    const res = await fetch("https://localhost:44327/api/Reports/create",
      {
        mode: 'cors', method: 'POST', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ "recipeId": recipeId, "description": description })
      });
    if (res.status === 200) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Báo cáo thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/home");
    } else {
      const data = await res.text();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data
      })
    }
  };

  const fetchLikeData = async () => {
    const res = await fetch(`https://localhost:44327/api/Actions/getAction?userId=${userId}&recipeId=${recipeId}&Type=0`,
      {
        mode: 'cors', method: 'GET', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      });
    if (res.status === 200) {
      const data = await res.json();
      setIsLiked(true);
      setLike(data);
    }
  }

  const fetchShareData = async () => {
    const res = await fetch(`https://localhost:44327/api/Actions/getAction?userId=${userId}&recipeId=${recipeId}&Type=3`,
      {
        mode: 'cors', method: 'GET', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      });
    if (res.status === 200) {
      const data = await res.json();
      setIsShared(true);
      //setLike(data);
    }
  }

  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa công thức này không?',
      text: "Công thức này sẽ bị xóa vĩnh viễn!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`https://localhost:44327/api/Recipes/delete?recipeid=${recipeId}`, {
          mode: 'cors', method: 'DELETE', headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        });
        if (res.status === 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Đã xóa thành công!',
            showConfirmButton: false,
            timer: 1500
          });
          navigate("/my-recipes");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Someting wrong!'
          })
          navigate("/my-recipes");
        }
      }
    })
  }

  const handleLikeClick = async (event) => {
    event.preventDefault();
    const res = await fetch("https://localhost:44327/api/Actions/create",
      {
        mode: 'cors', method: 'POST', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ "recipeId": recipeId, "type": 0, "content": null })
      });
    if (res.status === 200) {
      fetchLikeData();
    } else {
      const data = await res.text();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data
      })
    }
  };

  const handleShareClick = async (event) => {
    event.preventDefault();
    const res = await fetch("https://localhost:44327/api/Actions/create",
      {
        mode: 'cors', method: 'POST', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ "recipeId": recipeId, "type": 3, "content": null })
      });
    if (res.status === 200) {
      fetchShareData();
    } else {
      const data = await res.text();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data
      })
    }
  };

  const handleDislikeClick = async (event) => {
    event.preventDefault();
    const res = await fetch(`https://localhost:44327/api/Actions?actionId=${like.id}`,
      {
        mode: 'cors', method: 'DELETE', headers: new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      });
    if (res.status === 200) {
      setIsLiked(false);
      fetchLikeData();
    }
  };

  const handleShoppingClick = (id) => {
    navigate("/shopping", { state: { recipeId: id } });
  }

  const handleOpen = () => setOpen(!open);

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const handleEditClick = (id) => {
    navigate("/edit", { state: { recipeId: id } });
  }

  const getUser = (id) => {
    navigate("/profile", { state: { newUserId: id } });
  };

  useEffect(() => {
    fetchRecipeData();
    fetchReportedRecipeData();
    fetchLikeData();
  }, []);

  return (
    <div className="w-full">
      <Header />
      {!recipe ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Đang tải...
        </div>
      ) : (
        <section className="section blog-wrap bg-gray-300">
          <div className="container bg-white">
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12 mb-5">
                    <div className="single-blog-item">
                      <div className="blog-item-content p-5">
                        <br />
                        {parseInt(userId) !== parseInt(authorId) ? (
                          <div className="w-fit float-right mr-5">
                            <Fragment className="grid place-items-center">
                              {isReported ? (
                                <div variant="gradient" className="shadow-none text-red-600">
                                  <span >Bạn đã báo cáo công thức!</span>
                                </div>
                              ) : (
                                <div className="flex">
                                  <Button onClick={handleOpen} variant="gradient" className="shadow-none text-yellow-400 hover:text-red-600 flex justify-center items-center 
                                hover:cursor-pointer">
                                    <span >Báo cáo</span>
                                    <BiSolidFlag size={20} />
                                  </Button>
                                  <Button onClick={() => handleShoppingClick(recipe.id)} variant="gradient" className="shadow-none text-black flex justify-center items-center 
                                hover:cursor-pointer hover:text-green-600">
                                    <span >Shopping</span>
                                    <BiCart size={30} />
                                  </Button>
                                </div>
                              )}

                              <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">

                                <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Báo cáo công thức</h2></DialogHeader>
                                <DialogBody divider>
                                  <form id="report" onSubmit={fetchReportRecipeData}>
                                    <div className="mb-4">
                                      <h5 className="text-left ml-3 font-bold">Mô tả:</h5>
                                      <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                        type="text" placeholder="Nhập mô tả về hành vi của công thức!" onChange={handleDescriptionChange} value={description}
                                        required minLength={10} maxLength={250} />
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
                                  <Button variant="gradient" color="red" type="submit" className=" bg-red-600 px-3 py-1" form="report">
                                    <span className="text-xl">Báo cáo</span>
                                  </Button>
                                </DialogFooter>
                              </Dialog>
                            </Fragment>
                          </div>
                        ) : (
                          <div className="w-fit float-right flex">
                            <Button onClick={() => handleEditClick(recipe.id)} variant="gradient" className="shadow-none text-black flex justify-center items-center 
                        hover:cursor-pointer hover:text-gray-600">
                              <span >Chỉnh sửa</span>
                              <BiSolidEdit size={30} />
                            </Button>
                            <Button onClick={handleDeleteClick} variant="gradient" className="shadow-none text-red-600 flex justify-center items-center 
                        hover:cursor-pointer hover:text-gray-600">
                              <span >Xóa</span>
                              <MdDeleteForever size={30} />
                            </Button>
                          </div>)}
                        <h3 className="quote">{recipe?.recipeName}</h3>
                        <span className="text-muted mr-3 mb-4">
                          Tác giả: <span onClick={() => getUser(recipe.userId)} className="font-bold hover:cursor-pointer">{recipe?.userName}</span>
                        </span>
                        <p className="my-3">Mô tả: {recipe?.description}</p>
                        <img
                          src={recipe?.image}
                          alt="Recipe"
                          class="rounded w-full"
                        />
                        <div className="flex flex-col my-3">
                          <h3>Thời gian: </h3>
                          <p className="lead mb-4 font-weight-normal text-black">
                            Thời gian chuẩn bị: {recipe?.prepareTime} phút
                          </p>
                          <p className="lead mb-4 font-weight-normal text-black">
                            Thời gian nấu: {recipe?.cookTime} phút
                          </p>
                        </div>
                        <div>
                          <h3>Loại món ăn: </h3>
                          <ul>
                            {recipe.categories.map((category, index) => (
                              <li key={index}>{category.categoryName}</li>
                            ))}
                          </ul>
                          <h3>Các nguyên liệu:</h3>
                          {recipe.ingredients.map((ingredient) => (
                            <li className="lowercase" key={ingredient.id}>
                              {ingredient?.quantity} &nbsp;
                              {ingredient?.measurement} &nbsp;
                              {ingredient?.ingredientName} &nbsp;
                            </li>
                          ))}
                        </div>

                        <div className="mt-4">
                          <h3>Các bước thực hiện:</h3>
                          <ol className="list-group">
                            {recipe.steps.map((step, index) => (
                              <li key={index} className="list-group-item">
                                Bước {step.stepNumber}: {step.description}
                              </li>
                            ))}
                          </ol>
                        </div>
                        {parseInt(userId) !== parseInt(authorId) ? (
                          <div className=" mt-5">
                            <h3>Đánh giá:</h3>
                            <div className="flex">
                              {isLiked ? (
                                <Button onClick={handleDislikeClick} variant="gradient" className="shadow-none text-blue-800 flex justify-center items-center 
                        hover:cursor-pointer hover:text-blue-600 gap-2">
                                  <span >Like</span>
                                  <BiSolidLike size={30} />
                                </Button>
                              ) : (
                                <Button onClick={handleLikeClick} variant="gradient" className="shadow-none text-blue-800 flex justify-center items-center 
                        hover:cursor-pointer hover:text-blue-600 gap-2">
                                  <span >Like</span>
                                  <BiLike size={30} />
                                </Button>
                              )}
                              <div>
                                {isShared ? (
                                  <Button variant="gradient" className="shadow-none text-blue-800 flex justify-center items-center 
                                    hover:cursor-pointer hover:text-blue-600 gap-2">
                                    <span >Share</span>
                                    <BsShareFill size={30} />
                                  </Button>
                                ) : (
                                  <Button onClick={handleShareClick} variant="gradient" className="shadow-none text-blue-800 flex justify-center items-center 
                        hover:cursor-pointer hover:text-blue-600 gap-2">
                                    <span >Share</span>
                                    <BsShare size={30} />
                                  </Button>
                                )}

                              </div>
                              <div>
                                <FacebookShareButton
                                  url={"https://github.com/thanhht3001"}
                                  quote={"CoRicetta"}
                                  picture={
                                    "https://pixabay.com/photos/football-sport-play-competition-4455306/"
                                  }
                                  className="Demo__some-network__share-button flex  text-blue-800 justify-center items-center hover:cursor-pointer hover:text-blue-600 gap-2"
                                >
                                  <span >Share on Facebook</span>
                                  <FacebookIcon size={32} round />
                                </FacebookShareButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Comment />
          </div>
        </section>
      )}

      <br />
    </div>
  );
}

export default RecipeDetail;