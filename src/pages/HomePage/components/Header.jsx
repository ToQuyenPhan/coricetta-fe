import React, { Fragment } from "react";
import { Popover } from '@headlessui/react';
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";


function Header() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

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
        <AiOutlineSearch size={25} />
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
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            My Recipes
          </a>
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
              <Popover.Panel className="absolute -left-28 top-full z-10 mt-3 w-screen max-w-[200px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  <a href="#">Create a Recipe</a>
                </div>
                <div className="p-4">
                  <Fragment>
                    <Button className="text-black" onClick={handleOpen} variant="gradient">
                      Tạo một menu mới
                    </Button>
                    <Dialog open={open} handler={handleOpen} className="mx-auto w-full max-w-[60rem]">
                      <form>
                        <DialogHeader className="flex justify-center items-center font-bold text-3xl">Tạo menu mới</DialogHeader>
                        <DialogBody divider>
                          <div className="mb-5">
                            <h3>Tên menu:</h3>
                            <input className='border border-gray-300 p-3 w-full rounded-xl font-sans text-base text-black focus:outline-0'
                              type='text' placeholder="Nhập tên menu mới" required />
                          </div>
                          <div className="mb-5">
                            <h3>Mô tả:</h3>
                            <input className='border border-gray-300 p-3 w-full rounded-xl font-sans text-base text-black focus:outline-0'
                              type='text' placeholder="Nhập mô tả cho menu" required />
                          </div>
                          <div>
                          <h3>Chọn chế độ:</h3>
                            <div>
                              <input className="ml-5" type="radio" value="Public" name="gender" /> Công khai 
                              <input className="ml-5" type="radio" value="Private" name="gender" /> Riêng tư
                            </div>
                          </div>
                        </DialogBody>
                        <DialogFooter className="flex justify-end item-center">
                          <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                            className="mr-1"
                          >
                            <span>Hủy</span>
                          </Button>
                          <Button variant="gradient" type="submit" className=" bg-green-700 px-3 py-1 ml-2">
                            <span>Tạo menu</span>
                          </Button>
                        </DialogFooter>
                      </form>
                    </Dialog>
                  </Fragment>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </Popover.Group>
      </div>
    </div>
  );
}

export default Header;