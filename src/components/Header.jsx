import React, { Fragment, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineMenuBook, MdOutlineRestaurantMenu } from 'react-icons/md'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { BsPersonBoundingBox } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';


function Header() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/search', {state: {searchString: search}});
    }

    const handleSearchChange = event => {
        setSearch(event.target.value);
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
                <AiOutlineSearch size={25} onClick={handleSearch} className="hover:cursor-pointer"/>
                <input className="bg-transparent p-2 focus:outline-none w-full" type="text" placeholder="Tìm kiếm công thức" required
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
                            User
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
                                    Profile
                                </Link>
                                <Link to="/my-recipes" className="px-3 py-2 text-center border-b flex gap-2 justify-center items-center">
                                    <MdOutlineRestaurantMenu size={20} />
                                    My Recipes
                                </Link>
                                <Link to="/my-menus" className="px-3 py-2 border-b flex gap-2 justify-center items-center no-underline
                                     text-black">
                                    <MdOutlineMenuBook size={20} />
                                    My Menus
                                </Link>
                                <Link to="/" className="px-3 py-2 text-center border-b flex gap-3 justify-center items-center 
                                    no-underline text-black">
                                    <AiOutlineLogout size={20} />
                                    Log out
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
