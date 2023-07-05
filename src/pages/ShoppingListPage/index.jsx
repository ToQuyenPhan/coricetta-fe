import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

function ShoppingList() {
  const [recipe, setRecipe] = useState(null);
  const location = useLocation();
  const recipeId = location.state?.recipeId;
  const token = localStorage.getItem("Token");

  const fetchRecipeData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://localhost:44327/api/ShoppingList/${recipeId}`,
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
        <section className="section blog-wrap bg-gray-300">
          <div className="container bg-white">
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12 mb-5">
                    <div className="single-blog-item">
                      <div className="blog-item-content p-5">
                        <h3>Shopping List:</h3>
                        <div style={{ width: "100%", overflowX: "auto" }}>
                          <table
                            style={{
                              tableLayout: "auto",
                              width: "auto",
                              whiteSpace: "nowrap",
                              textAlign: "left",
                            }}
                          >
                            <thead>
                              <tr>
                                <th style={{ padding: "0 10px" }}>STT</th>
                                <th style={{ padding: "0 10px" }}>
                                  Tên nguyên liệu
                                </th>
                                <th style={{ padding: "0 10px" }}>Số lượng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recipe.map((ingredient, index) => (
                                <tr key={ingredient.id}>
                                  <td
                                    style={{
                                      padding: "0 10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td style={{ padding: "0 10px" }}>
                                    {ingredient?.ingredientName}
                                  </td>
                                  <td style={{ padding: "0 10px" }}>
                                    {ingredient?.quantity}{" "}
                                    {ingredient?.measurement}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

export default ShoppingList;
