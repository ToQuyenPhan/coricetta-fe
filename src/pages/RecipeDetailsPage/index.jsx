import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
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
      <Banner />
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
                        <span className="text-muted text-capitalize mr-3">
                          <i className="ti-pencil-alt mr-2"></i>
                          {recipe?.userName}
                        </span>
                        {/* <div className="blog-item-meta bg-gray py-1 px-2">
                          <span className="text-black text-capitalize mr-3">
                            <i className="ti-time mr-1"></i> {recipe.da}
                          </span>
                        </div> */}

                        <h3 className="quote">{recipe?.recipeName}</h3>
                        <p className="lead mb-4">{recipe?.description}</p>

                        <p className="lead mb-4 font-weight-normal text-black">
                          Prepared Time: {recipe?.prepareTime}
                        </p>
                        <p className="lead mb-4 font-weight-normal text-black">
                          Cook Time: {recipe?.cookTime}
                        </p>
                        <div className="mt-4">
                          <h3>Instructions</h3>
                          <ol className="list-group">
                            {recipe.steps.map((step, index) => (
                              <li key={index} className="list-group-item">
                                Step {step.stepNumber}: {step.description}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
      <h3>Categories</h3>
      <ul>
        {recipe.categories.map((category, index) => (
          <li key={index}>{category.categoryName}</li>
        ))}
      </ul>

      <table>
        <thead>
          <tr>
            <th>Ingredient Name</th>
            <th>Quantity</th>
            <th>Measurement</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          {recipe.ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient?.ingredientName}</td>
              <td>{ingredient?.quantity}</td>
              <td>{ingredient?.measurement}</td>
              <td>{ingredient?.calories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
                        <div className="mt-4">
                          <h3>Instructions</h3>
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
      <Comment />
    </div>
  );
}

export default RecipeDetail;
