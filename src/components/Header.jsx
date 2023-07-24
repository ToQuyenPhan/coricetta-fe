import React, { Fragment, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineMenuBook, MdOutlineRestaurantMenu } from 'react-icons/md'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { BsPersonBoundingBox } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { GiCabbage } from 'react-icons/gi';
import Swal from 'sweetalert2';


function Header() {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [measurement, setMeasurement] = useState('');
    const [calo, setCalo] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('Token');
    const username = localStorage.getItem('Name');

    const fetchCreateData = async (e) => {
        setOpen(!open);
        e.preventDefault();
        const res = await fetch(`https://localhost:44327/api/Ingredients/create`, {
            mode: "cors",
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({ "ingredientName": name, "measurement": measurement, "calories": calo, "status": 0 })
        });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Yêu cầu nguyên liệu thành công!',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            const data = await res.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data
            })
        }
        setName('');
        setMeasurement('');
        setCalo(0);
    }

    const handleSearch = () => {
        navigate('/search', { state: { searchString: search } });
    }

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleOpen = () => setOpen(!open);

    const handleNameChange = event => {
        setName(event.target.value);
    };

    const handleMeasurementChange = event => {
        setMeasurement(event.target.value);
    };

    const handleCaloChange = event => {
        setCalo(event.target.value);
    };

    return (
        <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-md">
            {/* Left side */}
            <div className="flex items-center">
                <div className="cursor-pointer hidden">
                    <AiOutlineMenu size={30} />
                </div>
                <Link to="/home"><h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">Co<span className="font-bold">Ricetta</span>
                </h1></Link>
            </div>

            {/* Search */}
            <div className="bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
                <AiOutlineSearch size={25} onClick={handleSearch} className="hover:cursor-pointer" />
                <input className="bg-transparent p-2 focus:outline-none w-full" type="text" placeholder="Tìm kiếm công thức & menu" required
                    onChange={handleSearchChange} value={search} minLength={1} maxLength={50} />
            </div>

            {/* Nav menu */}
            <div className="flex items-center justify-between p-6">
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <Link to="/home" className="text-sm font-semibold leading-6 text-gray-900 no-underline">
                        Home
                    </Link>
                    <Popover className="relative">
                        <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                            {username}
                            <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-screen max-w-[300px] overflow-hidden rounded-xl
                                 bg-white shadow-lg ring-1 ring-gray-900/5">
                                <Link to="/profile" className="px-3 py-2 text-center border-b flex gap-3 justify-center items-center">
                                    <BsPersonBoundingBox size={20} />
                                    Hồ sơ
                                </Link>
                                <Link to="/my-recipes" className="px-3 py-2 text-center border-b flex gap-2 justify-center items-center">
                                    <MdOutlineRestaurantMenu size={20} />
                                    Công thức của tôi
                                </Link>
                                <Link to="/my-menus" className="px-3 py-2 border-b flex gap-2 justify-center items-center no-underline
                                     text-black">
                                    <MdOutlineMenuBook size={20} />
                                    Menu của tôi
                                </Link>
                                <div className="px-3 py-2 text-center  border-b flex gap-3 justify-center items-center">
                                    <Fragment className="grid place-items-center">
                                        <Button onClick={handleOpen} variant="gradient" className="shadow-none text-base font-normal text-black flex gap-2">
                                            <GiCabbage size={20} />
                                            Yêu cầu nguyên liệu
                                        </Button>
                                        <Dialog open={open} handler={handleOpen} className="max-w-[1000px] text-center ">
                                            <DialogHeader><h2 className="font-bold text-center w-full text-orange-600">Yêu Cầu Nguyên Liệu Mới</h2></DialogHeader>
                                            <DialogBody divider>
                                                <form id="create" onSubmit={fetchCreateData}>
                                                    <div className="mb-4">
                                                        <h5 className="text-left ml-3 font-bold">Tên nguyên liệu:</h5>
                                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                                            type="text" placeholder="Nhập tên cho nguyên liệu mới của bạn!" onChange={handleNameChange} value={name}
                                                            required minLength={1} maxLength={50} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <h5 className="text-left ml-3 font-bold">Đơn vị:</h5>
                                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                                            type="text" placeholder="Nhập đơn vị cho nguyên liệu!" onChange={handleMeasurementChange} value={measurement}
                                                            required minLength={1} maxLength={20} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <h5 className="text-left ml-3 font-bold">Lượng calo:</h5>
                                                        <input className='border border-gray-300 p-3 w-full rounded font-sans text-base text-black focus:outline-0'
                                                            type="number" placeholder="Nhập lượng calo cho nguyên liệu!" onChange={handleCaloChange} value={calo}
                                                            required min={0} />
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
                                                    <span className="text-xl">Xác nhận</span>
                                                </Button>
                                            </DialogFooter>
                                        </Dialog>
                                    </Fragment>
                                </div>
                                <Link to="/" className="px-3 py-2 text-center border-b flex gap-3 justify-center items-center 
                                    no-underline text-black">
                                    <AiOutlineLogout size={20} />
                                    Đăng xuất
                                </Link>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Popover.Group>
            </div>
        </div>
    );
}

export default Header;
