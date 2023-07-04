import React, { useState, useEffect, Fragment } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

function RecipeReport() {
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
                <section className=" bg-gray-300 h-full">
                    <div className="container bg-white">
                        <h1 className=" font-extrabold text-3xl text-center pt-5">Phê duyệt báo cáo công thức</h1>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-12 mb-5">
                                        <div className="single-blog-item">
                                            <div className="blog-item-content p-5">
                                                <br />
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
                                                <div className=" flex gap-2 justify-end">
                                                    <Button onClick={() => navigate("/reports")} className=" hover:text-black mr-2" color="secondary">Hủy bỏ</Button>
                                                    <Button className="mr-2" variant="contained" color="error">Từ chối</Button>
                                                    <Button variant="contained" color="success">
                                                        Phê duyệt
                                                    </Button>
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
            <br />
        </div>
    );
}

export default RecipeReport;