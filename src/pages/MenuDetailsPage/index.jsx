import React, { useState, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { BiSolidEdit } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';

function MenuDetails() {
    const [menu, setMenu] = useState(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("Id");
    const location = useLocation();
    const menuId = location.state?.menuId;
    let modeStatus = 0;

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
                setName(response?.data.menuName);
                setDescription(response?.data.description);
                setMode(response?.data.status.toString().toLowerCase());
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchUpdateMenuData = async (e) => {
        setOpen(!open);
        e.preventDefault();
        if (mode === "public") modeStatus = 1;
        const res = await fetch("https://localhost:44327/api/Menus/update",
            {
                mode: 'cors', method: 'PUT', headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ "menuId": menuId, "menuName": name, "description": description, "status": modeStatus })
            });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Chỉnh sửa menu thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate("/my-menus");
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

    const handleNameChange = event => {
        setName(event.target.value);
    };

    const handleDescriptionChange = event => {
        setDescription(event.target.value);
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    }

    const handleDeleteClick = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn xóa menu này không?',
            text: "Menu này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Hủy',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:44327/api/Menus/delete?menuId=${menu.id}`, {
                    mode: 'cors', method: 'DELETE', headers: new Headers({
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    })
                });
                if (res.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đã xóa thành công!',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    navigate("/my-menus");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Someting wrong!'
                    })
                    navigate("/my-menus");
                }
            }
          })
    }

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
                    <div className=" bg-orange-950 w-full relative">
                        {parseInt(userId) === parseInt(menu.userId) ? (
                            <div className="absolute top-5 right-5 hover:text-white flex">
                                <Fragment className="grid place-items-center">
                                    <Button onClick={handleOpen} variant="gradient" className="shadow-none text-yellow-300 flex justify-center items-center 
                        hover:cursor-pointer hover:text-white">
                                        <span >Chỉnh sửa</span>
                                        <BiSolidEdit size={30} />
                                    </Button>
                                    <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">

                                        <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Chỉnh Sửa Menu</h2></DialogHeader>
                                        <DialogBody divider>
                                            <form id="update" onSubmit={fetchUpdateMenuData}>
                                                <div className="mb-4">
                                                    <h5 className="text-left ml-3 font-bold">Tên menu:</h5>
                                                    <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                                        type="text" placeholder="Nhập tên menu của bạn!" onChange={handleNameChange} value={name}
                                                        required minLength={6} maxLength={50} />
                                                </div>
                                                <div className="mb-4">
                                                    <h5 className="text-left ml-3 font-bold">Mô tả:</h5>
                                                    <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                                        type="text" placeholder="Nhập mô tả cho menu của bạn!" onChange={handleDescriptionChange} value={description}
                                                        required minLength={10} maxLength={250} />
                                                </div>
                                                <div className="text-left" >
                                                    <h5 className="ml-3 font-bold mb-3">Chọn chế độ:</h5>
                                                    <input type="radio" value="public" checked={mode === "public"} onChange={handleModeChange}
                                                        className="ml-5" />
                                                    Công khai
                                                    <input type="radio" value="private" checked={mode === "private"} onChange={handleModeChange} className="ml-3" />
                                                    Riêng tư
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
                                            <Button variant="gradient" color="green" type="submit" className=" bg-green-600 px-3 py-1" form="update">
                                                <span className="text-xl">Chỉnh sửa</span>
                                            </Button>
                                        </DialogFooter>
                                    </Dialog>
                                </Fragment>
                                <Button onClick={handleDeleteClick} variant="gradient" className="shadow-none text-red-600 flex justify-center items-center 
                        hover:cursor-pointer hover:text-white">
                                        <span >Xóa</span>
                                        <MdDeleteForever size={30} />
                                    </Button>
                            </div>

                        ) : (<div></div>)}

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