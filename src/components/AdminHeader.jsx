import React, { Fragment, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineMenuBook, MdOutlineRestaurantMenu } from 'react-icons/md'
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
                        <BsFillPersonFill size={20} /><span>Users</span>
                    </Link>
                    <Link to="/reports" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                        <BiSolidReport size={20} /><span>Reports</span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold leading-6 text-gray-900 no-underline flex items-center gap-1">
                                    <AiOutlineLogout size={20} />
                                    <span>Log out</span>
                                </Link>
                </Popover.Group>
            </div>
        </div>
    );
}

export default AdminHeader;
