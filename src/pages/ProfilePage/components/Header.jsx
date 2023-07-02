import React from "react";
import { Popover} from '@headlessui/react';
import {AiOutlineMenu, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';


function Header() {  
    const navigate = useNavigate();

    const getUserId = () => {
        navigate('/myRecipes');
    }
    const goToProfile = () => {
        navigate('/profile');
    }
  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4">
        {/* Left side */}
        <div className="flex items-center">
            <div className="cursor-pointer hidden">
                <AiOutlineMenu size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">Co<span className="font-bold">Ricetta</span></h1>
        </div>

        {/* Search */}
        <div className="bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
            <AiOutlineSearch size={25}/>
            <input className="bg-transparent p-2 focus:outline-none w-full" type="text" placeholder="Tìm kiếm công thức" />
        </div> 

        {/* Nav menu */}  
        <div className="flex items-center justify-between p-6">
            <Popover.Group className="hidden lg:flex lg:gap-x-12">
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    Home
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    Menus
                </a>
                <a  className="text-sm font-semibold leading-6 text-gray-900">
                    <button onClick={() => getUserId()}>My Recipes</button>
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                <button onClick={() => goToProfile()}>User</button>
                </a>
            </Popover.Group>
        </div>    
    </div>
  );
}

export default Header;