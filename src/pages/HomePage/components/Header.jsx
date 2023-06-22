import React from "react";
import { Popover} from '@headlessui/react';


function Header() {

  return (
    <header className="bg-white">
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">CoRicetta</span>
           {/*<img className="h-10 w-30" src="" alt="" />*/}
        </a>
      </div>
      <Popover.Group className="hidden lg:flex lg:gap-x-12">
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Home
        </a>
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          About
        </a>
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Contact
        </a>
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Users
        </a>
      </Popover.Group>
    </nav> 
  </header>
  );
}

export default Header;