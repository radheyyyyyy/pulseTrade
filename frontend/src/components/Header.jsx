import React from "react";
import {Menu} from "lucide-react"
import {useNavigate} from "react-router-dom";
import dev from "../../public/dev.png"
export const Header = ({ onMenuToggle }) => {
    const navigate=useNavigate();
    return (
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm"><img className='rounded' src={dev}/></span>
                        </div>
                        <span className="text-white font-bold text-xl">pulseTrade</span>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <a onClick={()=>{navigate("/markets")}} className="cursor-pointer text-gray-300 hover:text-white">Markets</a>
                        <a onClick={()=>{navigate("/trade")}} className="cursor-pointer text-gray-300 hover:text-white">Trade</a>

                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Sign Up
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Sign In
                    </button>
                    <button className="md:hidden text-gray-300" onClick={onMenuToggle}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

