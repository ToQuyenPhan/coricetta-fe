import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BsFillPlusCircleFill } from 'react-icons/bs';
import Header from "../../components/Header";
import EmptyBox from '../../assets/empty.png';

function MyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  const recipeId = location.state?.recipeId;
  const userId = localStorage.getItem("Id");
  const navigate = useNavigate();

  const fetchRecipeData = async () => {
    const res = await fetch(
      `https://localhost:44327/api/Recipes/all?userId=${userId}&currentPage=1&pageSize=10`,
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
      setRecipes(data.items);
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
      <Header />
      {recipes?.length > 0 ? (
        <div className="mt-5">
          <div>
            <h1 className="text-orange-600 font-bold text-4xl mb-3 inline-block">Danh sách các thực đơn của bạn:</h1>
            <h2 className="inline-block float-right font-bold mr-3">Tổng cộng {recipes?.length} công thức</h2>
          </div>
          <div className="ml-5 mt-3 w-fit">
            <Link to="/create">
              <BsFillPlusCircleFill size={30} color="green" />
            </Link>
          </div>

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
                <span className=" bg-blue-600 text-white p-1 rounded-full px-3 py-1 absolute top-2 right-2">{recipe.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div>
            <h1 className="text-orange-600 font-bold text-4xl mb-3 inline-block">Danh sách các công thức của bạn:</h1>
            <h2 className="inline-block float-right font-bold mr-3">Tổng cộng 0 công thức</h2>
          </div>
          <div className="ml-5 mt-3 w-fit">
            <Link to="/create">
              <BsFillPlusCircleFill size={30} color="green" />
            </Link>
          </div>
          <div className="my-5">
          {/* <div>
            <h2 className="text-center font-bold mr-3">Không tìm thấy công thức nào!</h2>
          </div> */}
          <br />
          <br />
          <br />
          <div className="flex justify-center items-center">
            <img src={EmptyBox} alt="..." width={300} height={300} />
          </div>
          <br />
          <br />
          <br />
        </div>
        </div>
      )}
    </div>
  );
}

export default MyRecipe;
