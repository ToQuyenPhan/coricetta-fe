import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Banner from "./components/Banner";
import Comment from "./components/comment";
import "./index.css";

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const token = localStorage.getItem("Token");
  //const navigate = useNavigate();
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

  useEffect(() => {
    fetchRecipeData();
  }, []);

  return (
    <div className="w-full">
      <Header />
      <br />
      <br /><br /><br />
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
        <section className="section blog-wrap bg-gray">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12 mb-5">
                    <div className="single-blog-item">
                      <img
                        src={recipe?.image}
                        alt="Recipe"
                        class="img-fluid rounded"
                      />

                      <div className="blog-item-content bg-white p-5">
                        <h3 className="quote">{recipe?.recipeName}</h3>
                        <span className="text-muted text-capitalize mr-3 mb-4">
                          Tác giả: {recipe?.userName}
                        </span>
                        <p className="lead mb-4">Mô tả: {recipe?.description}</p>

                        <p className="lead mb-4 font-weight-normal text-black">
                          Thời gian chuẩn bị: {recipe?.prepareTime}
                        </p>
                        <p className="lead mb-4 font-weight-normal text-black">
                          Thời gian nấu: {recipe?.cookTime}
                        </p>
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
          </div>
        </section>
      )}
    </div>
  );
}

export default RecipeDetail;