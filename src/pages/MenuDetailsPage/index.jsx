import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";

function MenuDetails() {
    const [menu, setMenu] = useState(null);
    const token = localStorage.getItem("Token");
    const location = useLocation();
    const menuId = location.state?.menuId;

    const fetchMenuData = () => {
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://localhost:44327/api/Menus/${menuId}`,
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
                setMenu(response?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchMenuData();
    }, []);

    return (
        <div>
            <Header />
            {!menu ? (
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
                <div className="px-32">
                    <div className=" bg-orange-950 w-full">
                        <h1 className="py-20 font-extrabold text-yellow-600 text-6xl text-center">Menu</h1>
                        <h2 className="pb-5 font-extrabold text-white text-5xl text-center">{menu.menuName}</h2>
                        <h2 className="pb-20 font-extrabold text-white text-4xl text-center">{menu.description}</h2>
                        {menu.recipes?.length > 0 && (
                            menu.recipes.map(recipe => (
                                <div className="flex pb-14 justify-center items-center">
                                    <div className="w-1/2">
                                        <h3 className="font-extrabold text-white text-3xl">{recipe.recipeName}</h3>
                                        <p className="font-extrabold text-white text-2xl ">Tác giả: {recipe.userName}</p>
                                        <p className="font-extrabold text-white text-xl">Độ khó: {recipe.level}</p>
                                        <p className="font-extrabold text-white text-xl">Thời gian chuẩn bị: {recipe.prepareTime} phút</p>
                                        <p className="font-extrabold text-white text-xl">Thời gian nấu: {recipe.cookTime} phút</p>
                                    </div>
                                    <div className="w-1/3">
                                        <img className="h-1/3 object-cover rounded-full" src={recipe.image} alt="..." />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}

export default MenuDetails;