import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { AiOutlinePlusCircle, AiFillDelete } from "react-icons/ai";
import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";
import Swal from 'sweetalert2';
import axios from "axios";

const Edit = () => {
    const [recipe, setRecipe] = useState("");
    const [oldRecipe, setOldRecipe] = useState(null);
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [imageUpload, setImageUpload] = useState(null);
    const [image, setImage] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [selectedLevel, setSelectedLevel] = useState();
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [stepList, setStepList] = useState([""]);
    const [prepareTime, setPrepareTime] = useState();
    const [cookTime, setCookTime] = useState();
    const [mode, setMode] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");
    const location = useLocation();
    const recipeId = location.state?.recipeId;

    const categoryList = categories.map(category => {
        return { value: category.id, label: category.categoryName }
    })

    const ingredientActiveList = ingredients.map(ingredient => {
        return { value: ingredient.id, label: ingredient.ingredientName + " (đơn vị: " + ingredient.measurement + ")" }
    })

    const levelList = [
        { value: '0', label: 'Dễ' },
        { value: '1', label: 'Trung bình' },
        { value: '2', label: 'Khó' }
    ]

    const handleRecipeNameChange = (event) => {
        setRecipe(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleIngredientNameChange = (index, event) => {
        const updatedIngredientList = [...ingredientList];
        updatedIngredientList[index].name = event.value;
        setIngredientList(updatedIngredientList);
        setSelectedIngredients(event);
    };

    const handleQuantityChange = (index, event) => {
        const updatedIngredientList = [...ingredientList];
        updatedIngredientList[index].quantity = parseInt(event.target.value);
        setIngredientList(updatedIngredientList);
    };

    const handleStepChange = (index, event) => {
        const updatedStepList = [...stepList];
        updatedStepList[index] = event.target.value;
        setStepList(updatedStepList);
    };

    const handleAddIngredient = () => {
        setIngredientList([...ingredientList, { name: "", quantity: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        const updatedIngredientList = [...ingredientList];
        updatedIngredientList.splice(index, 1);
        setIngredientList(updatedIngredientList);
    };

    const handleAddStep = () => {
        setStepList([...stepList, ""]);
    };

    const handleRemoveStep = (index) => {
        const updatedStepList = [...stepList];
        updatedStepList.splice(index, 1);
        setStepList(updatedStepList);
    };


    const handleImageClick = () => {
        inputRef.current.click();
    }

    const handleImageChange = (e) => {
        setImageUpload(e.target.files[0]);
        setImage(e.target.files[0]);
    }

    const handleSelectLevel = (data) => {
        setSelectedLevel(data);
    }

    const handleSelectCategories = (data) => {
        setSelectedCategories(data);
    }

    const handlePrepareTimeChange = (e) => {
        setPrepareTime(e.target.value);
    }

    const handleCookTimeChange = (e) => {
        setCookTime(e.target.value)
    }

    const handleModeChange = (e) => {
        setMode(e.target.value);
    }

    const getRecipe = (id) => {
        navigate('/recipeDetails', {state: {recipeId: id}});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (imageUpload == null) {
            if (imageLink === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Bạn quên chọn hình ảnh rồi!"
                });
                return;
            }
        }
        if (selectedLevel === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Hãy chọn độ khó cho công thức!"
            });
            return;
        }
        if (selectedCategories.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Hãy chọn loại món ăn cho công thức!"
            });
            return;
        }
        if (ingredientList.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Hãy nhập các nguyên liệu cho công thức!"
            });
            return;
        }
        if (stepList.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Hãy nhập các bước thực hiện cho công thức!"
            });
            return;
        }
        if (mode === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Bạn muốn công khai công thức không?"
            });
            return;
        }
        let imageData = "";
        if (imageLink === "") {
            const imageRef = ref(storage, `images/${imageUpload.name}`)
            imageData = "https://firebasestorage.googleapis.com/v0/b/recipeorganizer-98c9b.appspot.com/o/images%2F"
                + imageUpload.name + "?alt=media";
            uploadBytes(imageRef, imageUpload).then(() => {

            })
        } else { imageData = imageLink; }
        let modeStatus = 0;
        if (mode === "public") modeStatus = 1;
        let categoryIds = selectedCategories.map(category => category.value);
        let ingredientIds = ingredientList.map(ingredient => ingredient.name);
        let quantities = ingredientList.map(ingredient => ingredient.quantity);
        const res = await fetch(`https://localhost:44327/api/Recipes/update?recipeId=${recipeId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                "recipeName": recipe, "level": selectedLevel.value, "prepareTime": prepareTime, "cookTime": cookTime,
                "image": imageData, "description": description, "status": modeStatus, "categories": categoryIds, "steps": stepList,
                "ingredients": ingredientIds, "quantities": quantities
            })
        });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Chỉnh sửa công thức thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            navigate("/my-recipes")
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    }

    const fetchCategoryData = async () => {
        const res = await fetch("https://localhost:44327/api/Categories/all", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setCategories(data);
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    };

    const fetchIngridientData = async () => {
        const res = await fetch("https://localhost:44327/api/Ingredients/all", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setIngredients(data);
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    };

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
                setOldRecipe(response?.data);
                setRecipe(response?.data.recipeName);
                setDescription(response?.data.description);
                setImageLink(response?.data.image);
                switch (response?.data.level) {
                    case "Easy":
                        setSelectedLevel(levelList[0]);
                        break;
                    case "Normal":
                        setSelectedLevel(levelList[1]);
                        break;
                    case "Hard":
                        setSelectedLevel(levelList[2]);
                        break;
                    default:
                        break;
                }
                var categories = response?.data.categories.map(category => {
                    return { value: category.id, label: category.categoryName }
                });
                setSelectedCategories(categories);
                var steps = response?.data.steps.map(step => step.description);
                setStepList(steps);
                var ingredients = response?.data.ingredients.map(ingredient => {
                    return { name: ingredient.id, quantity: ingredient.quantity }
                });
                var selectedIngredients = response?.data.ingredients.map(ingredient => {
                    return { value: ingredient.id, label: ingredient.ingredientName + " (đơn vị: " + ingredient.measurement + ")" }
                });
                setSelectedIngredients(selectedIngredients);
                setIngredientList(ingredients);
                setCookTime(response?.data.cookTime);
                setPrepareTime(response?.data.prepareTime);
                switch (response?.data.status) {
                    case "Public":
                        setMode("public");
                        break;
                    case "Private":
                        setMode("private");
                        break;
                    default:
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (localStorage) {
            var role = localStorage.getItem("Role");
            if (role !== "USER") {
                navigate("/");
            } else {
                fetchCategoryData();
                fetchIngridientData();
                fetchRecipeData();
            }
        }
    }, []);

    //#endregion
    return (
        <div className="w-full">
            <Header />
            <hr className="mt-100 mb-50" />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="w-full">
                    <div
                        className="d-flex justify-content-center align-items-center shadow mb-3"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <div className="border rounded p-4">
                            <p
                                className="fw-bold mb-4 text-center border-b-4"
                                style={{
                                    fontSize: "4rem",
                                    fontWeight: "bold",
                                    borderBottom: "1rem solid #e7ab46",
                                    paddingLeft: "1rem",
                                    paddingRight: "3rem",
                                    fontFamily: "Your Artistic Font",
                                }}
                            >
                                Chỉnh sửa công thức
                            </p>
                            <div className="d-flex flex-column align-items-center">
                                <hr className="mt-10 mb-5" />
                                <h6 className="text-center mt-3 mb-3">
                                    Hãy cải thiện công thức của bạn và chia sẻ đến bạn bè và gia đình
                                    nhé!
                                </h6>
                                <form
                                    id="create-form"
                                    onSubmit={handleSubmit}
                                    className="w-full"
                                >
                                    <div className="container" style={{ display: "flex" }}>
                                        <div className="left" style={{ flex: 1 }}>
                                            <div>
                                                <label
                                                    htmlFor="recipeName"
                                                    className="h6 fw-bold control-label mr-5"
                                                    style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                                                >
                                                    Tên công thức:
                                                </label>
                                                <div className="form-group mb-3">
                                                    <input
                                                        id="recipeName"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Cho công thức của bạn một cái tên nhé!"
                                                        value={recipe}
                                                        onChange={handleRecipeNameChange}
                                                        style={{
                                                            width: "95%",
                                                            border: "1px solid black",
                                                            padding: "10px",
                                                            borderRadius: "5px",
                                                        }}
                                                        required minLength={5} maxLength={50}
                                                    />
                                                </div>
                                                <label
                                                    htmlFor="description"
                                                    className="h6 fw-bold control-label mr-20"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "10px",
                                                        fontWeight: "bold",
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    Mô tả:
                                                </label>
                                                <div
                                                    className="form-group mb-3"
                                                    style={{ display: "flex", alignItems: "center" }}
                                                >
                                                    <textarea
                                                        id="description"
                                                        rows="7"
                                                        className="form-control"
                                                        value={description}
                                                        placeholder="Cho công thức của bạn một cái tên nhé!"
                                                        onChange={handleDescriptionChange}
                                                        style={{
                                                            width: "95%",
                                                            border: "1px solid black",
                                                            padding: "10px",
                                                            borderRadius: "5px",
                                                        }}
                                                        required
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right hover:cursor-pointer" style={{ flex: 1 }} onClick={handleImageClick}>
                                            {image ? (
                                                <img
                                                    src={URL.createObjectURL(image)} alt="..."
                                                />) : (
                                                <img src={imageLink}
                                                    className="w-full h-full object-cover" alt="" />
                                            )}

                                            <input type="file" onChange={handleImageChange} ref={inputRef} className="hidden" />
                                        </div>
                                    </div>
                                    <hr className="mt-10 mb-5" />
                                    <div>
                                        <div className="form-group mb-3">
                                            <div style={{ display: "flex" }} className="gap-3">
                                                <div className="left" style={{ flex: 1 }}>
                                                    <label
                                                        className="h6 fw-bold control-label mr-5"
                                                        style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                                                    >
                                                        Độ khó
                                                    </label>
                                                    <Select className="" options={levelList} placeholder="Chọn độ khó cho công thức!"
                                                        value={selectedLevel} onChange={handleSelectLevel} />
                                                </div>
                                                <div className="right" style={{ flex: 2 }}>
                                                    <label
                                                        className="h6 fw-bold control-label mr-5"
                                                        style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                                                    >
                                                        Loại món ăn
                                                    </label>
                                                    <div>
                                                        <Select options={categoryList} placeholder="Chọn loại món ăn cho công thức"
                                                            value={selectedCategories}
                                                            onChange={handleSelectCategories} isMulti />
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="mt-10 mb-5" />

                                            <label
                                                className="h6 fw-bold control-label mr-5"
                                                style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                                            >
                                                Nguyên liệu
                                            </label>
                                            {ingredientList.map((ingredient, index) => (
                                                <div key={index} className="flex justify-center items-center mb-2">
                                                    <Select options={ingredientActiveList} className="w-2/3 flex-1"
                                                        placeholder="Chọn nguyên liệu cho công thức!" value={selectedIngredients[index]} onChange={(event) =>
                                                            handleIngredientNameChange(index, event)} isSearchable />
                                                    <input
                                                        type="number"
                                                        className="form-control flex-1/2 ml-2"
                                                        style={{
                                                            width: "20%",
                                                            border: "1px solid black",
                                                            padding: "10px",
                                                            borderRadius: "5px",
                                                        }}
                                                        placeholder="Số lượng"
                                                        value={ingredient.quantity}
                                                        onChange={(event) =>
                                                            handleQuantityChange(index, event)
                                                        }
                                                        min={1} required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger ms-2"
                                                        onClick={() => handleRemoveIngredient(index)}
                                                    >
                                                        <AiFillDelete size={25} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleAddIngredient}
                                            >
                                                <AiOutlinePlusCircle size={25} />
                                            </button>
                                        </div>
                                        <hr className="mt-10 mb-5" />
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label
                                                    className="h6 fw-bold control-label mb-2"
                                                    style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                                                >
                                                    Các bước thực hiện
                                                </label>
                                                {stepList.map((step, index) => (
                                                    <div key={index} className="d-flex mb-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{
                                                                width: "91%",
                                                                border: "1px solid black",
                                                                padding: "10px",
                                                                borderRadius: "5px",
                                                            }}
                                                            placeholder={`Bước ${index + 1}`}
                                                            value={step}
                                                            onChange={(event) =>
                                                                handleStepChange(index, event)
                                                            }
                                                            required minLength={5}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger ms-2"
                                                            onClick={() => handleRemoveStep(index)}
                                                        >
                                                            <AiFillDelete size={25} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={handleAddStep}
                                                >
                                                    <AiOutlinePlusCircle size={25} />
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="mt-10 mb-5" />
                                        <div style={{ display: "flex" }} className="justify-center items-center">
                                            <div className="left" style={{ flex: 1 }}>
                                                <label
                                                    className="h6 fw-bold control-label mr-5"
                                                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                                                >
                                                    Thời gian chuẩn bị ( phút )
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={prepareTime}
                                                    onChange={handlePrepareTimeChange}
                                                    style={{
                                                        width: "20%",
                                                        border: "1px solid black",
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                    }}
                                                    min={0} required
                                                />
                                            </div>
                                            <div className="right" style={{ flex: 1 }}>
                                                <label
                                                    className="h6 fw-bold control-label mr-5"
                                                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                                                >
                                                    Thời gian nấu ( phút )
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    onChange={handleCookTimeChange}
                                                    style={{
                                                        width: "20%",
                                                        border: "1px solid black",
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                    }}
                                                    value={cookTime}
                                                    min={0} required
                                                />
                                            </div>
                                            <div className="flex-1" >
                                                <h5 className="ml-3 font-bold mb-3">Chọn chế độ:</h5>
                                                <input type="radio" value="public" checked={mode === "public"} onChange={handleModeChange}
                                                    className="ml-5" />
                                                Công khai
                                                <input type="radio" value="private" checked={mode === "private"} onChange={handleModeChange} className="ml-3" />
                                                Riêng tư
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-mid my-10 mx-10 float-right">
                                    <button onClick={() => getRecipe(oldRecipe?.id)}
                                            type="submit"
                                            className="btn btn-primary  bg-yellow-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xl py-2 px-6"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary ml-3  bg-yellow-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xl py-2 px-6"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;