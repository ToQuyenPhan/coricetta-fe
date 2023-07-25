'use client';
import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import { BsFillPlusCircleFill } from 'react-icons/bs';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { Tooltip } from "./components/Tooltip";
import EmptyBox from '../../assets/empty.png';

function Menu() {
    const [menus, setMenus] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem("Id");
    const navigate = useNavigate();
    let modeStatus = 0;

    const fetchMenusData = async () => {
        const res = await fetch(`https://localhost:44327/api/Menus/all?userId=${userId}&currentPage=1&pageSize=8`, {
            mode: 'cors', method: 'GET', headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            })
        });
        if (res.status === 200) {
            const data = await res.json();
            setMenus(data.items);
        }
    }

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

    const getRecipe = (id) => {
        navigate('/menu-details', { state: { menuId: id } });
    }

    const fetchCreateMenuData = async (e) => {
        setOpen(!open);
        e.preventDefault();
        if (mode === "public") modeStatus = 1;
        const res = await fetch("https://localhost:44327/api/Menus/create",
            {
                mode: 'cors', method: 'POST', headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ "menuName": name, "description": description, "status": modeStatus })
            });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tạo menu thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            fetchMenusData();
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
    };

    useEffect(() => {
        if (localStorage) {
            var role = localStorage.getItem('Role');
            if (role !== 'USER') {
                navigate('/');
            } else {
                fetchMenusData();
            }
        }
    }, [])

    return (
        <div className="w-full">
            <Header />
            {menus?.length > 0 ? (
                <div>
                    <div className="max-w-[1640px] m-auto px-4 py-5">
                        <div>
                            <h1 className="text-orange-600 font-bold text-4xl mb-3 inline-block">Danh sách các menu của bạn:</h1>
                            <h2 className="inline-block float-right font-bold">Tổng cộng {menus.length} menu</h2>
                        </div>
                        <Fragment className="grid place-items-center">
                            <Tooltip position="right" content="Tạo menu mới!">
                                <Button onClick={handleOpen} variant="gradient" className="shadow-none">
                                    <BsFillPlusCircleFill size={30} color="green" />
                                </Button>
                            </Tooltip>
                            <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">

                                <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Tạo Menu Mới</h2></DialogHeader>
                                <DialogBody divider>
                                    <form id="create" onSubmit={fetchCreateMenuData}>
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
                                    <Button variant="gradient" color="green" type="submit" className=" bg-green-600 px-3 py-1" form="create">
                                        <span className="text-xl">Tạo menu</span>
                                    </Button>
                                </DialogFooter>
                            </Dialog>
                        </Fragment>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {menus.map(menu => (
                            <button onClick={() => getRecipe(menu.id)}>
                                <div key={menu.id} className="border shadow-lg hover:scale-105 duration-300 rounded-lg relative">
                                    <img src="https://as1.ftcdn.net/v2/jpg/03/14/55/62/1000_F_314556236_hRwCkoZIayHyTW4IBjIizEaX8vc7XwV5.jpg" alt="/" className="w-full h-[200px] object-cover rounded-t-lg" />
                                    <div className="flex justify-between px-2 py-4">
                                        <p className="font-bold">{menu.menuName}</p>
                                        <p>
                                            <span className="bg-orange-500 text-white p-1 rounded-full"></span>
                                        </p>
                                    </div>
                                    <span className=" bg-blue-600 text-white p-1 rounded-full px-3 py-1 absolute top-2 right-2">{menu.status}</span>
                                </div></button>
                        ))}
                    </div>
                    <br></br>
                    <br></br>
                </div>
            ) : (
                <div>
                    <div className="max-w-[1640px] m-auto px-4 py-5">
                        <div>
                            <h1 className="text-orange-600 font-bold text-4xl mb-3 inline-block">Danh sách các menu của bạn:</h1>
                            <h2 className="inline-block float-right font-bold">Tổng cộng 0 menu</h2>
                        </div>
                        <Fragment className="grid place-items-center">
                            <Tooltip position="right" content="Tạo menu mới!">
                                <Button onClick={handleOpen} variant="gradient" className="shadow-none">
                                    <BsFillPlusCircleFill size={30} color="green" />
                                </Button>
                            </Tooltip>
                            <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">

                                <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Tạo Menu Mới</h2></DialogHeader>
                                <DialogBody divider>
                                    <form id="create" onSubmit={fetchCreateMenuData}>
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
                                    <Button variant="gradient" color="green" type="submit" className=" bg-green-600 px-3 py-1" form="create">
                                        <span className="text-xl">Tạo menu</span>
                                    </Button>
                                </DialogFooter>
                            </Dialog>
                        </Fragment>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src={EmptyBox} alt="..." width={300} height={300} />
                    </div>
                    <br></br>
                    <br></br>
                </div>
            )}
        </div>
    );

}

export default Menu;