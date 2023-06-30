import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";

function MyRecipe() {
  const [recipes, setRecipe] = useState(null);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  const recipeId = location.state?.recipeId;
  const userId = location.state?.userId;
  const navigate = useNavigate();

  const fetchRecipeData = async () => {
    const res = await fetch(
      `https://localhost:44327/api/Recipes/all?userId=1&currentPage=1&pageSize=10`,
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
      setRecipe(data.items);
      console.log("data", JSON.stringify(data));
    }
  };

  const getRecipe = (id) => {
    navigate("/recipeDetails", { state: { recipeId: id } });
  };

  useEffect(() => {
    if (localStorage) {
      var role = localStorage.getItem("Role");
      if (role !== "USER") {
        navigate("/");
      } else {
        fetchRecipeData();
      }
    }
  }, []);

  return (
    <div>
       {/* <Header />
      <Banner />  */}
      <div>
        {recipes?.length > 0 && (
          <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe?.id} className="rounded-xl relative">
                {/* Overlay */}
                <div className="absolute w-full h-full bg-black/50 rounded-xl text-white">
                  <p className="font-bold text-2xl px-2 pt-4">
                    {recipe?.recipeName}
                  </p>
                  <p className="px-2">Tác giả: {recipe?.userName}</p>
                  <p className="px-2">Độ khó: {recipe?.level}</p>
                  <span className="px-2">Loại:</span>
                  {recipe.categories.map((category) => (
                    <span key={category?.id} className="px-2">
                      {category?.categoryName}
                    </span>
                  ))}
                  <br></br>
                  <button
                    onClick={() => getRecipe(recipe?.id)}
                    className="border border-white rounded-xl px-5 py-1 bg-white text-black mx-2 absolute bottom-4"
                  >
                    Xem chi tiết!
                  </button>
                </div>
                <img
                  className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
                  src={recipe?.image}
                  alt="/"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRecipe;
