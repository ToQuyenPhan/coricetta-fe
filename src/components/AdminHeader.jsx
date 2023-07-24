import React, { Fragment, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineLogout } from 'react-icons/ai'
import { MdFastfood } from 'react-icons/md'
import { GiCabbage } from 'react-icons/gi';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { BsFillPersonFill } from 'react-icons/bs';
import { BiSolidReport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';


function AdminHeader() {
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
                <Link to="/users"><h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">Co<span className="font-bold">Ricetta</span>
                    </h1></Link> 
            </div>

            {/* Nav menu */}
            <div className="flex items-center justify-between p-6">
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <Link to="/users" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                        <BsFillPersonFill size={20} /><span>Người dùng</span>
                    </Link>
                    <Link to="/reports" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                        <BiSolidReport size={20} /><span>Báo cáo</span>
                    </Link>
                    <Link to="/ingredients" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                        <GiCabbage size={20} /><span>Nguyên liệu</span>
                    </Link>
                    <Link to="/categories" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                        <MdFastfood size={20} /><span>Loại món ăn</span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                                    <AiOutlineLogout size={20} />
                                    <span>Đăng xuất</span>
                                </Link>
                </Popover.Group>
            </div>
        </div>
    );
}

export default AdminHeader;
