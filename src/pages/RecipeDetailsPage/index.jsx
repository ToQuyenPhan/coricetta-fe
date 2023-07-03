import React, { useState, useEffect, Fragment } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BiSolidFlag } from 'react-icons/bi';
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

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [open, setOpen] = useState(false);
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
      })
      .catch((error) => {
        console.log(error);
      });
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

  const handleOpen = () => setOpen(!open);

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  useEffect(() => {
    fetchRecipeData();
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
                        <div className="w-fit float-right mr-5">
                          <Fragment className="grid place-items-center">
                            <Button onClick={handleOpen} variant="gradient" className="shadow-none text-yellow-400 hover:text-red-600 flex justify-center items-center 
                    hover:cursor-pointer">
                              <span >Báo cáo</span>
                              <BiSolidFlag size={20} />
                            </Button>
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
                        <h3 className="quote">{recipe?.recipeName}</h3>
                        <span className="text-muted mr-3 mb-4">
                          Tác giả: <span className="font-bold">{recipe?.userName}</span>
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
                                Step {step.stepNumber}: {step.description}
                              </li>
                            ))}
                          </ol>
                        </div>
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