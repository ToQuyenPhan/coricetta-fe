import React, {useState, useEffect} from "react";
import {RiSearch2Line, RiMapPinLine, RiArrowDownSLine, RiArrowUpLine} from 'react-icons/ri';


function Banner(){
    return(
        <div className="max-w-[1640px] mx-auto p-4">
            <div className="max-h-[700px] relative">
                {/* Overlay */}
                <div className="absolute w-full h-full text-gray-200 max-h-[700px] bg-black/40 flex flex-col justify-center">
                    <h1 className="px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Các 
                        <span className="text-orange-600"> công thức</span> nấu ăn</h1>
                    <h1 className="px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                        <span className="text-orange-600">tuyệt vời</span> nhất!</h1>
                </div>
                <img className="w-full max-h-[700px] object-cover" src="https://images.unsplash.com/photo-1590420882553-4f9150b71f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1165&q=80" alt="/" />
            </div>
        </div>
    );
}

export default Banner;