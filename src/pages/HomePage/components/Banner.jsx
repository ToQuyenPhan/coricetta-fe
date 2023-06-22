import React, {useState, useEffect} from "react";
import {RiSearch2Line, RiMapPinLine, RiArrowDownSLine, RiArrowUpLine} from 'react-icons/ri';


function Banner(){
    return(
        <section className="h-full max-h-[640px] mb-8 xl:mb-24 mt-8">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center
                    flex-1 px-4 lg:px-0">
                    <h1 className="text-4xl lg:text-[58px] font-semibold leading-none mb-6">
                        <span className="text-violet-700">Rent</span> Your Dream Room With Us.</h1>
                </div>
                <div className="hidden flex-1 lg:flex justify-end items-end ml-2">
                    <img className="rounded-tl-2xl" src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=958&q=80" alt=""/>
                </div>
            </div>
            <div className="px-[3px] py-6 max-w-[1170px] mx-auto flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-3 relative 
                lg:-top-4 lg:shadow-1 bg-white lg:bg-transparent lg:backdrop-blur rounded-lg">
                <button className="bg-violet-700 hover:bg-violet-800 transition w-full lg:max-w-[162px] h-16 rounded-lg flex 
                    justify-center items-center text-white text-lg">
                    <RiSearch2Line /></button>
            </div>
        </section>
    );
}

export default Banner;