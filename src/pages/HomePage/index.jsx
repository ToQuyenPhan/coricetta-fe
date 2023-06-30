import React, { useState,useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import Header from "./components/Header";
import Banner from "./components/Banner";

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('Token');
    const navigate = useNavigate();

    const fetchRecipeData = async () => {
        const res = await fetch("https://localhost:44327/api/Recipes/all?currentPage=1&pageSize=3", { mode: 'cors', method: 'GET', headers: new Headers({
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })});
        if(res.status === 200){
            const data = await res.json();
            setRecipes(data.items);
        }
    }

    const fetchCategoryData = async () => {
      const res = await fetch("https://localhost:44327/api/Categories/all", { mode: 'cors', method: 'GET', headers: new Headers({
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      })});
      if(res.status === 200){
          const data = await res.json();
          setCategories(data);
      }
  }

  const getRecipe = (id) => {
      navigate('/recipeDetails', {state: {recipeId: id}});
  }

    useEffect(() => {
        if(localStorage){
          var role = localStorage.getItem('Role');
          if(role !== 'USER'){
            navigate('/');
          }else{
            fetchRecipeData();
            fetchCategoryData();
          }
        }
    }, [])

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <div>
        {recipes.length > 0 && (
            <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                  <div key={recipe.id} className="rounded-xl relative">
                      {/* Overlay */}
                      <div className="absolute w-full h-full bg-black/50 rounded-xl text-white">
                          <p className="font-bold text-2xl px-2 pt-4">{recipe.recipeName}</p>
                          <p className="px-2">Tác giả: {recipe.userName}</p>
                          <p className="px-2">Độ khó: {recipe.level}</p>
                          <span className="px-2">Loại:</span>
                          {recipe.categories.map(category => (
                              <span key={category.id} className="px-2">{category.categoryName}</span>
                          ))}
                          <br></br>
                          <button onClick={() => getRecipe(recipe.id)} className="border border-white rounded-xl px-5 py-1 bg-white text-black mx-2 absolute bottom-4">
                            Xem chi tiết!</button>
                      </div>
                      <img className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl" src={recipe.image} alt="/" />
                  </div>
              ))}
            </div>
        )}
        </div>
        <div className="max-w-[1640px] m-auto px-4 py-12">
          <h1 className="text-orange-600 font-bold text-4xl text-center">Các công thức phổ biến</h1>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row justify-between">
              {/* Filter Category */} 
              <div>
                <p className="font-bold text-gray-700">Các loại món ăn</p>
                <div className="flex justify-between flex-wrap">
                    <button className="border border-orange-600 text-orange-600 rounded-xl px-5 py-1 hover:bg-orange-600
                     hover:text-white m-1">Tất cả</button>
                    {categories.length > 0 && (
                        categories.map(category => (
                          <button key={category.id} className="border rounded-xl px-5 py-1 border-orange-600 text-orange-600
                          hover:bg-orange-600 hover:text-white m-1">{category.categoryName}</button>
                        )))}
                </div>
            </div>  
              {/* Filter Level */} 
              <div>
                <p className="font-bold text-gray-700">Độ khó:</p>
                <div className="flex justify-between max-w-[390px] w-full">
                  <button className="border rounded-xl px-5 py-1 border-orange-600 text-orange-600 hover:bg-orange-600 
                    hover:text-white m-1">Tất cả</button>
                  <button className="border rounded-xl px-5 py-1 border-orange-600 text-orange-600 hover:bg-orange-600 
                    hover:text-white m-1">Dễ</button>
                  <button className="border rounded-xl px-5 py-1 border-orange-600 text-orange-600 hover:bg-orange-600 
                    hover:text-white m-1">Trung bình</button>
                  <button className="border rounded-xl px-5 py-1 border-orange-600 text-orange-600 hover:bg-orange-600 
                    hover:text-white m-1">Khó</button>
                </div>
              </div>            
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {recipes.map(recipe => (
              <div key={recipe.id} className="border shadow-lg hover:scale-105 duration-300 rounded-lg">
                <img src={recipe.image} alt="/" className="w-full h-[200px] object-cover rounded-t-lg" />
                <div className="flex justify-between px-2 py-4">
                  <p className="font-bold">{recipe.recipeName}</p>
                  <p>
                    <span className="bg-orange-500 text-white p-1 rounded-full">{recipe.userName}</span>
                  </p>
                  </div>
              </div>
          ))}
        </div>
        <br></br>
        <br></br>
    </div>
  );
}

export default Home;